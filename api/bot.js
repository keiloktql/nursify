import { Bot, webhookCallback, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import "dotenv/config";
import { explainMedicalReport, explainMedication } from "../conversations.js";
import { mainKeyboard } from "../keyboards.js";
import { BOT_TOKEN } from "../constants.js";

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(BOT_TOKEN);
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

// CONVERSATIONS
bot.use(createConversation(explainMedicalReport));
bot.use(createConversation(explainMedication));

// COMMANDS
bot.command("start", (ctx) =>
  ctx.reply("Welcome to Nursify, seek explanations or medication conditions", {
    reply_markup: mainKeyboard,
  })
);

// ON
bot.on("message:text", async (ctx) => {
  const text = ctx.msg.text;
  if (text === "Explain Medical Report 🧑‍🔬") {
    await ctx.conversation.enter("explainMedicalReport");
    return;
  }

  if (text === "Explain Medication 💊") {
    await ctx.conversation.enter("explainMedication");
    return;
  }

  if (text === "Manage Reminders ⏰") {
    await ctx.conversation.enter("manageReminders");
    return;
  }

  if (text === "Go back") {
    return ctx.reply(
      "Welcome to Nursify, seek explanations or medication conditions!",
      {
        reply_markup: mainKeyboard,
      }
    );
  }
});

export default webhookCallback(bot, "http");
