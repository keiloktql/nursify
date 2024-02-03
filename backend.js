import "dotenv/config";
import OpenAI from "openai";
import { createWorker } from "tesseract.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

const promptTemplateInjector = (MEDICAL_REPORT_TEXT) => {
  return `Medical Report:
  
${MEDICAL_REPORT_TEXT}

Additional Details (if available):
- Any specific symptoms or concerns you'd like clarification on.
- Medications or treatments mentioned in the report.
- Previous medical history or conditions that might be relevant.

User Expectations:
- Please provide insights on critical findings.
- Explain any medical terminology or jargon.
- Highlight important recommendations or actions to be taken.
- Clarify the severity of any identified issues.

Note: This chatbot is designed to assist in understanding medical reports, but it does not replace professional medical advice. Consult with your healthcare provider for personalized guidance.`;
};

export const OCR = async (photo) => {
  try {
    const worker = await createWorker("eng");
    const ret = await worker.recognize(photo);
    console.log(ret.data.text);
    await worker.terminate();

    return ret.data.text;
  } catch (error) {
    console.log("Err: ", error.message);
  }
};

export const analyzeMedicalReport = async (text) => {
  // Add the medical report text to the prompt template
  const prompt = promptTemplateInjector(text);

  // OpenAI API with chat completion
  try {
    const gptResponse = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return gptResponse.choices[0].message.content;
  } catch (error) {
    console.error("Error in OpenAI API:", error.message);
    // Handle the error as per your application's requirements
    return "Error occurred during analysis";
  }
};

export const analyzeMedication = async (text) => {
  return "Analyzed medication";
};
