import { Bot, webhookCallback, Keyboard, session } from "grammy";
import { Menu } from "@grammyjs/menu";
import { conversations, createConversation } from "@grammyjs/conversations";
import "dotenv/config";
import { OCR } from "../backend";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(token);
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

// CONVERSATIONS
async function explainMedicalReports(conversation, ctx) {
  ctx.reply("Upload a picture of the medical report", {
    reply_markup: explainMedicalReportKeyboard,
  });
  const medicalReportCtx = await conversation.wait();

  if (medicalReportCtx.message.photo) {
    OCR();
    ctx.reply("Thank you for uploading the medical report photo", {
      reply_markup: mainKeyboard,
    });
  } else if (medicalReportCtx.message.text) {
    // User entered text
    ctx.reply("Thank you for explaining the medical report in text", {
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
bot.use(createConversation(explainMedicalReports));

// KEYBOARDS
const mainKeyboard = new Keyboard()
  .text("Explain Medical Reports")
  .row()
  .text("Explain Medication")
  .row()
  .resized();
const explainMedicalReportKeyboard = new Keyboard()
  .text("Go back")
  .row()
  .resized();

// COMMANDS
bot.command("start", (ctx) =>
  ctx.reply("Welcome to Nursify, seek explanations or medication conditions", {
    reply_markup: mainKeyboard,
  })
);

// ON
bot.on("message:text", async (ctx) => {
  const text = ctx.msg.text;
  if (text === "Explain Medical Reports") {
    await ctx.conversation.enter("explainMedicalReports");
  } else if (text === "Explain Medication") {
    return ctx.reply("Upload a picture of the medication", {
      reply_markup: explainMedicalReportKeyboard,
    });
  } else if (text === "Go back") {
    return ctx.reply(
      "Welcome to Nursify, seek explanations or medication conditions",
      {
        reply_markup: mainKeyboard,
      }
    );
  }
});

export default webhookCallback(bot, "http");
