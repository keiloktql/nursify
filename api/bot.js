const { Bot, webhookCallback } = require("grammy");
require("dotenv/config").config();

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(token);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

export default webhookCallback(bot, "http");
