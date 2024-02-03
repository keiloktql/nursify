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
    const analysis = analyzeFunction(OCRText);
    ctx.reply(analysis, { reply_markup: mainKeyboard });
    return;
  }

  if (responseMessage) {
    const analysis = analyzeFunction(responseMessage);
    ctx.reply(analysis, { reply_markup: mainKeyboard });
    return;
  }
}

// Define a function to wait for user response
const waitForUserResponse = () => {
  return new Promise((resolve) => {
    conversation.on("text", (ctx) => {
      resolve(ctx.message.text);
    });
  });
};

export async function explainMedicalReport(conversation, ctx) {
  ctx.reply(
    "Upload a picture of the medical report or send a message of the medical condition",
    { reply_markup: goBackKeyboard }
  );

  // Wait for user response
  const userResponse = await waitForUserResponse();

  // Pass user response to analyzeMedicalReport function
  await handleResponse(ctx, conversation, analyzeMedicalReport, userResponse);
}

export async function explainMedication(conversation, ctx) {
  ctx.reply("Upload a picture or send the name of the medication", {
    reply_markup: goBackKeyboard,
  });
  await handleResponse(ctx, conversation, analyzeMedication);
}

export async function manageReminders(conversation, ctx) {
  ctx.reply("test test", { reply_markup: goBackKeyboard });
}
