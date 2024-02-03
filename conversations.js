import {
  OCR,
  analyzeMedicalReport,
  analyzeMedication,
  enterReminder,
} from "./backend.js";
import {
  goBackKeyboard,
  mainKeyboard,
  setReminderKeyboard,
} from "./keyboards.js";

async function handleResponse(ctx, conversation, analyzeFunction, requestType) {
  const conversationCtx = await conversation.wait();
  const responseMessage = conversationCtx.message.text || "";
  const isPhotoUploaded = conversationCtx.message.photo !== undefined;

  if (!(isPhotoUploaded || responseMessage)) {
    ctx.reply(
      "Invalid response type. Please upload a photo or provide text explanation.",
      { reply_markup: mainKeyboard }
    );
    return;
  }

  let analysis = "";

  if (isPhotoUploaded) {
    const OCRText = OCR();
    analysis = await analyzeFunction(OCRText);
    return;
  }

  if (responseMessage) {
    analysis = await analyzeFunction(responseMessage);
    return;
  }

  switch (requestType) {
    case "report":
      ctx.reply(analysis, { reply_markup: mainKeyboard });
      return;
    case "medication":
      //TODO: REPLACE REPLY TEXT WITH GENERATED RESPONSE
      ctx.reply("This is paracetemol", { reply_markup: setReminderKeyboard });
      return;
    default:
      ctx.reply("Something went wrong 😥", { reply_markup: mainKeyboard });
      return;
  }
}

//reminder function
async function handleReminder(ctx, conversation) {
  const conversationCtx = await conversation.wait();
  const responseMessage = conversationCtx.message.text || "";

  if (responseMessage) {
    const timing = [...responseMessage];
    if (timing.length === 4 && containsOnlyNumbers(timing)) {
      const hours = array.slice(0, 2).join("");
      const minutes = array.slice(-2).join("");
      if (hours < 24 && minutes < 60) {
        response = await enterReminder(hours, minutes);
        ct.reply(reponse, { reply_markup: goBackKeyboard });
      }
    }
  }

  ctx.reply(
    "Invalid response, check if your timing is correctly formatted (e.g 0915)",
    { reply_markup: setReminderKeyboard }
  );
  return;
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
    reply_markup: goBackKeyboard,
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

}
