import { Bot, webhookCallback } from "grammy";
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

bot.command(
  "start",
  (ctx) =>
    ctx.reply(
      "Welcome to Nursify, would you like to explain condition, or explain "
    ),
  {
    reply_markup: mainNenu,
  }
);

export default webhookCallback(bot, "http");
