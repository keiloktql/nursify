import chalk from "chalk";
import axios from "axios";
import {
    OCR,
    analyzeMedicalReport,
    analyzeMedication,
    enterReminder,
    getReminder
} from "./processor.js";
import {
    goBackKeyboard,
    mainKeyboard,
    setReminderKeyboard
} from "./keyboards.js";
import { isArrayOnlyNumbers } from "./common/functions.js";
import { BOT_TOKEN, LOG } from "./constants.js";

async function handleResponse(ctx, conversation, analyzeFunction, requestType) {
    try {
        const conversationCtx = await conversation.wait();
        const responsePhoto = conversationCtx.message.photo;
        const responseMessage = conversationCtx.message.text || "";
        const isPhotoUploaded = responsePhoto !== undefined;

        if (!(isPhotoUploaded || responseMessage)) {
            ctx.reply(
                "Invalid response type. Please upload a photo or provide text explanation.",
                { reply_markup: mainKeyboard }
            );
            return;
        }

        let analysis = "";
        if (isPhotoUploaded) {
            const file = await conversationCtx.getFile(); // valid for at least 1 hour
            const path = file.file_path; // file path on Bot API server
            const photo = await axios.get(
                `https://api.telegram.org/file/bot${BOT_TOKEN}/${path}`
            );
            const OCRText = OCR(photo.data);
            analysis = await analyzeFunction(OCRText);
        } else {
            analysis = await analyzeFunction(responseMessage);
        }

        switch (requestType) {
            case "report":
                ctx.reply(analysis, { reply_markup: mainKeyboard });
                return;
            case "medication":
                // TODO: REPLACE REPLY TEXT WITH GENERATED RESPONSE
                ctx.reply("This is paracetemol", {
                    reply_markup: setReminderKeyboard
                });
                return;
            default:
                ctx.reply("Something went wrong 😥", {
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
    isError = true;

    if (responseMessage) {
        const timing = [...responseMessage];
        if (timing.length === 4 && isArrayOnlyNumbers(timing)) {
            const hours = timing.slice(0, 2).join("");
            const minutes = timing.slice(-2).join("");
            if (hours < 24 && minutes < 60) {
                isError = false;
                const response = await enterReminder(hours, minutes);
                ctx.reply(response, { reply_markup: goBackKeyboard });
                await handleReminder(ctx, conversation);
                return;
            }
        }
    }

    if (isError) {
        ctx.reply(
            "Invalid response, check if your timing is correctly formatted (e.g 0915)",
            { reply_markup: goBackKeyboard }
        );
        await handleReminder(ctx, conversation);
        return;
    }
}

async function fetchReminders(ctx, conversation) {
    const { message, data } = await getReminder();

    if (data !== null) {
        ctx.reply("These are your current reminders:", {
            reply_markup: goBackKeyboard
        });
        data.map((reminder) => {
            const cronArray = reminder.reminder_cron.split(" ");
            ctx.reply(
                `Medication: ${reminder.reminder_name}\nTime: ${cronArray[1]}${cronArray[0]}`
            );
        });
        return;
    } else {
        ctx.reply(message, { reply_markup: goBackKeyboard });
        return;
    }
}

export async function explainMedicalReport(conversation, ctx) {
    ctx.reply(
        "Upload a picture of the medical report or send a message of the medical condition",
        { reply_markup: goBackKeyboard }
    );

    await handleResponse(ctx, conversation, analyzeMedicalReport, "report");
}

export async function explainMedication(conversation, ctx) {
    ctx.reply("Upload a picture or send the name of the medication", {
        reply_markup: goBackKeyboard
    });

    // Send the analysis to the user
    await handleResponse(ctx, conversation, analyzeMedication, "medication");
}

export async function setReminders(conversation, ctx) {
    ctx.reply(
        "To set a reminder, type in the time you would like to be reminded at in the 24 hour format (e.g: 0030, 0900, 1345, etc)",
        { reply_markup: goBackKeyboard }
    );

    await handleReminder(ctx, conversation);
}

export async function manageReminders(conversation, ctx) {
    ctx.reply("Fetching your reminders...");

    await fetchReminders(ctx, conversation);
}
