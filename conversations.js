import { OCR, analyzeMedicalReport, analyzeMedication } from "./backend.js";
import { explainMedicalReportKeyboard, mainKeyboard } from "./keyboards.js";

// MEDICAL REPORTS
export async function explainMedicalReport(conversation, ctx) {
  ctx.reply("Upload a picture of the medical report", {
    reply_markup: explainMedicalReportKeyboard,
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
    reply_markup: explainMedicalReportKeyboard,
  });
  const medicalReportCtx = await conversation.wait();

  if (medicalReportCtx.message.photo) {
    const OCRText = OCR();
    const analysis = analyzeMedication(OCRText);
    ctx.reply(analysis, {
      reply_markup: mainKeyboard,
    });
  } else if (medicalReportCtx.message.text) {
    const analysis = analyzeMedication(medicalReportCtx.message.text);
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
