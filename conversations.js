import { OCR, analyzeMedicalReport, analyzeMedication } from "./backend.js";
import { goBackKeyboard, mainKeyboard } from "./keyboards.js";

// MEDICAL REPORTS
export async function explainMedicalReport(conversation, ctx) {
  ctx.reply("Upload a picture of the medical report", {
    reply_markup: goBackKeyboard,
  });
  const medicalReportCtx = await conversation.wait();

  if (medicalReportCtx.message.photo) {
    const OCRText = OCR();
    const analysis = analyzeMedicalReport(OCRText);
    ctx.reply(analysis, {
      reply_markup: mainKeyboard,
    });
  } else if (medicalReportCtx.message.text) {
    const analysis = analyzeMedicalReport(medicalReportCtx.message.text);
    ctx.reply(analysis, {
      reply_markup: mainKeyboard,
    });
  } else {
    ctx.reply(
      "Invalid response type. Please upload a photo or provide text explanation.",
      {
        reply_markup: mainKeyboard,
      }
    );
  }
  return;
}

export async function explainMedication(conversation, ctx) {
  ctx.reply("Upload a picture of the medication", {
    reply_markup: goBackKeyboard,
  });
  const medicationCtx = await conversation.wait();

  if (medicationCtx.message.photo) {
    const OCRText = OCR();
    const analysis = analyzeMedication(OCRText);
    ctx.reply(analysis, {
      reply_markup: mainKeyboard,
    });
  } else if (medicationCtx.message.text) {
    const analysis = analyzeMedication(medicationCtx.message.text);
    ctx.reply(analysis, {
      reply_markup: mainKeyboard,
    });
  } else {
    ctx.reply(
      "Invalid response type. Please upload a photo or provide text explanation.",
      {
        reply_markup: mainKeyboard,
      }
    );
  }
  return;
}
