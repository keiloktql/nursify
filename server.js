import "dotenv/config";
import { BOT_TOKEN, PORT } from "./constants.js";
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
import { mainKeyboard, chooseLanguageKeyboard } from "./keyboards.js";
import { LOG } from "./common/functions.js";
import { authenticateUser, createUser } from "./processor.js";

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
bot.use(createConversation(setReminders));

// COMMANDS
bot.command("start", async (ctx) => {
    userData = await authenticateUser();
    if (userData.language) {
        ctx.reply(
            "👩‍⚕️: Welcome to Nursify! How can I assist you today? Feel free to seek explanations on medical reports or inquire about medication conditions.",
            {
                reply_markup: mainKeyboard
            }
        );
    } else {
        ctx.reply(
            "👩‍⚕️: Welcome to Nursify! Before we start, please choose your prefered language",
            { reply_markup: chooseLanguageKeyboard }
        );
    }
});

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
        return;
    }

    if (text === "English 🇬🇧") {
        return ctx.reply(
            `👩‍⚕️: You have selected English 🇬🇧! Welcome to Nursify! How can I assist you today? Feel free to seek explanations on medical reports or inquire about medication conditions.`,
            {
                reply_markup: mainKeyboard
            }
        );
    }

    if (text === "Chinese 🇨🇳") {
        async function newUser() {
            return await createUser();
        }
        const response = newUser("CHINESE");

        if (response) {
            return ctx.reply(response, {
                reply_markup: mainKeyboard
            });
        } else {
            return ctx.reply("Something went wrong :(", {
                reply_markup: mainKeyboard
            });
        }
    }

    if (text === "Malay 🇲🇾") {
        async function newUser() {
            return await createUser();
        }
        const response = newUser("MALAY");

        if (response) {
            return ctx.reply(response, {
                reply_markup: mainKeyboard
            });
        } else {
            return ctx.reply("Something went wrong :(", {
                reply_markup: mainKeyboard
            });
        }
    }

    if (text === "Tamil 🇮🇳") {
        async function newUser() {
            return await createUser("TAMIL");
        }

        const response = newUser();

        if (response) {
            return ctx.reply(response, {
                reply_markup: mainKeyboard
            });
        } else {
            return ctx.reply("Something went wrong :(", {
                reply_markup: mainKeyboard
            });
        }
    }

    if (text === "Go back") {
        return ctx.reply(
            "👩‍⚕️: Welcome to Nursify, seek explanations or medication conditions!",
            {
                reply_markup: mainKeyboard
            }
        );
    }
});

bot.start();
