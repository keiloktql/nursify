import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export const OCR = (photo) => {
  return "";
};

export const analyzeMedicalReport = (text) => {
  return "Analyzed medical report";
};

export const analyzeMedication = (text) => {
  return "Analyzed medication";
};
