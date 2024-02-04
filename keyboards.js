import { Keyboard } from "grammy";

export const mainKeyboard = new Keyboard()
    .text("Explain Medical Report 🧑‍🔬")
    .row()
    .text("Explain Medication 💊")
    .row()
    .text("Manage Reminders ⏰")
    .row()
    .resized();
export const goBackKeyboard = new Keyboard().text("Go back").row().resized();
export const setReminderKeyboard = new Keyboard()
    .text("Set new reminder")
    .row()
    .text("Go back")
    .resized();
export const remindersKeyboard = new Keyboard()
    .text("View all reminders")
    .row()
    .text("Set reminders");
export const chooseLanguageKeyboard = new Keyboard()
    .text("English 🇬🇧")
    .text("Chinese 🇨🇳")
    .row()
    .text("Malay 🇲🇾")
    .text("Tamil 🇮🇳")
    .resized();
