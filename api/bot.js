import { Bot, webhookCallback, Keyboard } from "grammy";
import { Menu } from "@grammyjs/menu";
import "dotenv/config";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(token);

// MENU
const mainNenu = new Menu("main")
  .text("Explain medical condition", (ctx) =>
    ctx.reply("You pressed medical condition")
  )
  .row()
  .text("Explain medication", (ctx) => ctx.reply("You pressed B!"));
bot.use(mainNenu);

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
bot.on("message:text", (ctx) => {
  const text = ctx.msg.text;
  if (text === "Explain Medical Reports") {
    return ctx.reply("Upload a picture of the medical report", {
      reply_markup: explainMedicalReportKeyboard,
    });
  } else if (text === "Explain Medication") {
    return ctx.reply("Upload a picture of the medication", {
      reply_markup: explainMedicalReportKeyboard,
    });
  } else if (text === "Go Back") {
    return ctx.reply(
      "Welcome to Nursify, seek explanations or medication conditions",
      {
        reply_markup: mainKeyboard,
      }
    );
  }
});

bot.on("message:photo", (ctx) => ctx.reply("You sent a picture"), {
  reply_markup: mainKeyboard,
});

export default webhookCallback(bot, "http");
