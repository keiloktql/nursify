import { Bot, webhookCallback, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import "dotenv/config";
import { explainMedicalReport } from "../conversations.js";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(token);
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

// CONVERSATIONS
bot.use(createConversation(explainMedicalReport));

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
