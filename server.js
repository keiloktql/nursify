import "dotenv/config";
import { BOT_TOKEN, LOG, PORT } from "./constants.js";
import chalk from "chalk";
import express from "express";

import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import "dotenv/config";
import {
    explainMedicalReport,
    explainMedication,
    manageReminders,
    setReminders
} from "./conversations.js";
import { mainKeyboard } from "./keyboards.js";

const app = express();

// parse the updates to JSON
app.use(express.json());

// Start Express Server
app.listen(PORT, () => {
    LOG(chalk.green(`Express server is listening on ${PORT}`));
});

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(BOT_TOKEN);
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

// CONVERSATIONS
bot.use(createConversation(explainMedicalReport));
bot.use(createConversation(explainMedication));
bot.use(createConversation(manageReminders));
bot.use(createConversation(setReminders)) 

// COMMANDS
bot.command("start", (ctx) =>
    ctx.reply(
        "Welcome to Nursify, seek explanations or medication conditions",
        {
            reply_markup: mainKeyboard
        }
    )
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

    if (text === "Set new reminder") {
        await ctx.conversation.enter("setReminders");
        return
    }

    if (text === "Go back") {
        return ctx.reply(
            "Welcome to Nursify, seek explanations or medication conditions!",
            {
                reply_markup: mainKeyboard
            }
        );
    }
});

bot.start();
