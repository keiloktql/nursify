import { Keyboard } from "grammy";

export const mainKeyboard = new Keyboard()
  .text("Explain Medical Reports")
  .row()
  .text("Explain Medication")
  .row()
  .resized();
export const goBackKeyboard = new Keyboard().text("Go back").row().resized();
