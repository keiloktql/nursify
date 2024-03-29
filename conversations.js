import chalk from "chalk";
import axios from "axios";
import {
    OCR,
    analyzeMedicalReport,
    analyzeMedication,
    chatGPTWrapper,
    enterReminder,
    getReminder
} from "./processor.js";
import {
    goBackKeyboard,
    mainKeyboard,
    setReminderKeyboard
} from "./keyboards.js";
import { isArrayOnlyNumbers } from "./common/functions.js";
import { BOT_TOKEN } from "./constants.js";
import { LOG } from "./common/functions.js";

const RequestType = {
    REPORT: "report",
    MEDICATION: "medication"
};

function handleGoBack(ctx) {
    ctx.reply(
        "👩‍⚕️: Welcome to Nursify! How can I assist you today? Feel free to seek explanations on medical reports or inquire about medication conditions.",
        { reply_markup: mainKeyboard }
    );
}

function handleInvalidResponse(ctx) {
    ctx.reply(
        "👩‍⚕️: Invalid response type. Please upload a photo or provide text explanation.",
        { reply_markup: mainKeyboard }
    );
}

async function processTextResponse(ctx, responseMessage, analyzeFunction) {
    ctx.reply("👩‍⚕️: Standby... I'm processing your message!", {
        reply_markup: goBackKeyboard
    });
    return await analyzeFunction(responseMessage);
}

async function handleContinueConvo(
    ctx,
    conversation,
    OCRText,
    responseMessage,
    analysis
) {
    let continueConversation = true;
    while (continueConversation) {
        // Get the next response from the user
        let userResponse = await conversation.wait();
        let nextResponse = userResponse.message.text || "";
        if (nextResponse === "Go back") {
            continueConversation = false;
            handleGoBack(ctx);
            return;
        }

        let initialResponse = OCRText || responseMessage;
        ctx.reply("👩‍⚕️: Standby... I'm processing your message!", {
            reply_markup: goBackKeyboard
        });
        let conversationResponse = await chatGPTWrapper(
            "This is what the user initially shared: " +
                initialResponse +
                "This is the response that was generated based on what the user shared: " +
                analysis.response +
                "This is what the user have asked based on the generated response" +
                nextResponse
        );
        ctx.reply(("👩‍⚕️: ", conversationResponse.response), {
            reply_markup: goBackKeyboard
        });
    }
}

async function handleResponse(ctx, conversation, analyzeFunction, requestType) {
    try {
        const conversationCtx = await conversation.wait();
        const responsePhoto = conversationCtx.message.photo;
        const responseMessage = conversationCtx.message.text || "";
        const isPhotoUploaded = responsePhoto !== undefined;

        if (responseMessage === "Go back") {
            handleGoBack(ctx);
            return;
        }

        if (!(isPhotoUploaded || responseMessage)) {
            handleInvalidResponse(ctx);
            return;
        }

        let analysis = "";
        let OCRText = "";
        if (isPhotoUploaded) {
            const file = await conversationCtx.getFile();
            const path = file.file_path;
            const photo = await axios.get(
                `https://api.telegram.org/file/bot${BOT_TOKEN}/${path}`,
                { responseType: "arraybuffer" }
            );

            ctx.reply(
                "👩‍⚕️: Processing your image! Standby... it might take a little longer!",
                { reply_markup: goBackKeyboard }
            );

            OCRText = await OCR(photo.data);
            analysis = await analyzeFunction(OCRText);
        } else {
            analysis = await processTextResponse(
                ctx,
                responseMessage,
                analyzeFunction
            );
        }

        switch (requestType) {
            case RequestType.REPORT: {
                ctx.reply(("👩‍⚕️: ", analysis.response), {
                    reply_markup: goBackKeyboard
                });
                handleContinueConvo(
                    ctx,
                    conversation,
                    OCRText,
                    responseMessage,
                    analysis
                );
                return;
            }
            case RequestType.MEDICATION: {
                ctx.reply(("👩‍⚕️: ", analysis.response), {
                    reply_markup: setReminderKeyboard
                });
                handleContinueConvo(
                    ctx,
                    conversation,
                    OCRText,
                    responseMessage,
                    analysis
                );
                return;
            }
            default:
                ctx.reply("👩‍⚕️: Something went wrong 😥", {
                    reply_markup: mainKeyboard
                });
                return;
        }
    } catch (error) {
        LOG(chalk.red(error));
    }
}

//reminder function
async function handleReminder(ctx, conversation) {
    const conversationCtx = await conversation.wait();
    const responseMessage = conversationCtx.message.text || "";
    let isError = true;

    if (responseMessage === "Go back") {
        handleGoBack(ctx);
        return;
    }

    if (responseMessage) {
        const timing = [...responseMessage];
        if (timing.length === 4 && isArrayOnlyNumbers(timing)) {
            const hours = timing.slice(0, 2).join("");
            const minutes = timing.slice(-2).join("");
            if (hours < 24 && minutes < 60) {
                isError = false;
                const response = await enterReminder(hours, minutes);
                ctx.reply(response, { reply_markup: mainKeyboard });
                return;
            }
        }
    }

    if (isError) {
        ctx.reply(
            "👩‍⚕️: Invalid response, check if your timing is correctly formatted (e.g 0915)",
            { reply_markup: goBackKeyboard }
        );
        await handleReminder(ctx, conversation);
        return;
    }
}

async function fetchReminders(ctx, conversation) {
    const { message, data } = await getReminder();

    if (data !== null) {
        ctx.reply("👩‍⚕️: These are your current reminders:", {
            reply_markup: setReminderKeyboard
        });
        data.map((reminder) => {
            const cronArray = reminder.reminder_cron.split(" ");
            ctx.reply(
                `Medication: ${reminder.reminder_name}\nTime: ${cronArray[1]}${cronArray[0]}`
            );
        });
        return;
    } else {
        ctx.reply(message, { reply_markup: setReminderKeyboard });
        return;
    }
}

export async function explainMedicalReport(conversation, ctx) {
    ctx.reply(
        "👩‍⚕️: Upload a picture of the medical report or send a message of the medical condition",
        { reply_markup: goBackKeyboard }
    );

    await handleResponse(
        ctx,
        conversation,
        analyzeMedicalReport,
        RequestType.REPORT
    );
}

export async function explainMedication(conversation, ctx) {
    ctx.reply("👩‍⚕️: Upload a picture or send the name of the medication", {
        reply_markup: goBackKeyboard
    });

    // Send the analysis to the user
    await handleResponse(
        ctx,
        conversation,
        analyzeMedication,
        RequestType.MEDICATION
    );
}

export async function setReminders(conversation, ctx) {
    ctx.reply(
        "👩‍⚕️: To set a reminder, type in the time you would like to be reminded at in the 24 hour format (e.g: 0030, 0900, 1345, etc)",
        { reply_markup: goBackKeyboard }
    );

    await handleReminder(ctx, conversation);
}

export async function manageReminders(conversation, ctx) {
    ctx.reply("👩‍⚕️: Fetching your reminders...");

    await fetchReminders(ctx, conversation);
}
