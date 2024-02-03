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
export const remindersKeyboard = new Keyboard()
  .text("View all reminders")
  .row()
  .text("Set reminders");
