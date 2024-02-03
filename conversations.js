import { OCR, analyzeMedicalReport, analyzeMedication } from "./backend.js";
import { goBackKeyboard, mainKeyboard } from "./keyboards.js";

async function handleResponse(ctx, conversation, analyzeFunction) {
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

  if (isPhotoUploaded) {
    const OCRText = OCR();
    const analysis = await analyzeFunction(OCRText);
    ctx.reply(analysis, { reply_markup: mainKeyboard });
    return;
  }

  if (responseMessage) {
    const analysis = await analyzeFunction(responseMessage);
    ctx.reply(analysis, { reply_markup: mainKeyboard });
    return;
  }
}

export async function explainMedicalReport(conversation, ctx) {
  ctx.reply(
    "Upload a picture of the medical report or send a message of the medical condition",
    { reply_markup: goBackKeyboard }
  );

  await handleResponse(ctx, conversation, analyzeMedicalReport);
}

export async function explainMedication(conversation, ctx) {
  ctx.reply("Upload a picture or send the name of the medication", {
    reply_markup: goBackKeyboard,
  });

  // Send the analysis to the user
  await handleResponse(ctx, conversation, analyzeMedication);
}

export async function manageReminders(conversation, ctx) {
  ctx.reply("test test", { reply_markup: goBackKeyboard });
}
