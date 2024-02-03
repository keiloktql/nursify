import OpenAI from "openai";
const tesseract = require("node-tesseract-ocr");

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
};

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export const OCR = async (photo) => {
  tesseract
    .recognize(photo, config)
    .then((text) => {
      console.log("Result:", text);
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export const analyzeMedicalReport = (text) => {
  return "Analyzed medical report";
};

export const analyzeMedication = (text) => {
  return "Analyzed medication";
};
