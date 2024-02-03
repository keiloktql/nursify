import { Bot, webhookCallback } from "grammy";
import { Commands, commands, CommandsFlavor } from "@grammyjs/commands";
import "dotenv/config";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(token);
bot.use(commands());

// MENU
// const mainNenu = new Menu("main")
//   .text("Explain medical condition", (ctx) =>
//     ctx.reply("You pressed medical condition")
//   )
//   .row()
//   .text("Explain medication", (ctx) => ctx.reply("You pressed B!"));
// bot.use(mainNenu);
// Registers the command handlers

bot.command("start", async (ctx) => {
  const cmds = new Commands();

  cmds.command("English", "english");
  await ctx.setMyCommands(cmds);

  return ctx.reply(
    "Welcome to Nursify, seek explanations or medication conditions via the buttons below!"
  );
});

export default webhookCallback(bot, "http");
