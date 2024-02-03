import { Bot, webhookCallback, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import "dotenv/config";
import { explainMedicalReport, explainMedication } from "../conversations.js";
import { mainKeyboard } from "../keyboards.js";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(token);
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
  if (text === "Explain Medical Report") {
    await ctx.conversation.enter("explainMedicalReport");
    return;
  }

  if (text === "Explain Medication") {
    await ctx.conversation.enter("explainMedication");
    return;
  }

  if (text === "Go back") {
    return ctx.reply(
      "Welcome to Nursify, seek explanations or medication conditions",
      {
        reply_markup: mainKeyboard,
      }
    );
  }
});

export default webhookCallback(bot, "http");
