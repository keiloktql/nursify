import "dotenv/config";
import axios from "axios";
import OpenAI from "openai";
import { createWorker } from "tesseract.js";
import supabase from "./supabaseClient.js";
import { LOG } from "./constants.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is the default and can be omitted
});

const MEDICAL_REPORT_TEMPLATE = `Medical Report Template:
Everything below the sentence, "Start of template:", is going to be a template response I want to send to the user.

In your role as a virtual medical advisor, your task is to meticulously analyze the provided medical report, assuming the role of the attending physician. Your responsibilities include delving into the report, decoding complex medical terminology, and offering in-depth insights. Walk the user through any critical findings, ensuring clarity through clear explanations, and suggesting actionable steps. Make sure to emphasize key recommendations and provide a nuanced understanding of the severity of identified issues to empower the user in addressing their health concerns. You are to address the user in a professional and empathetic manner, ensuring that they feel supported and informed throughout the process. As such, use words such as "you," "your," and "we" to create a sense of collaboration and understanding.

Our goal is to provide the user with a comprehensive understanding of their medical report, enabling them to make informed decisions about their health. As such, reduce the complexity of the medical report and offer actionable insights to guide the user through their health journey. This include medical jargon, test results, and any other relevant information. Make it clear that the chatbot is not a substitute for professional medical advice and that the user should consult a healthcare provider for personalized guidance. Also, make it short and concise, ensuring that the user can easily understand the information provided.

The user has shared the following medical report:
{MEDICAL_REPORT_TEXT}

Start of template:

🩺 ** Overall Medical Report Analysis:**
- A one-sentence summary of the overall medical report.

🤔 **Insights and Guidance:**
- Illuminate any critical findings for a better understanding.
- Decode medical terminology to enhance clarity.
- Emphasize crucial recommendations and suggest actionable steps.
- Offer context on the severity of identified issues.

⚠️ **Important Note:**
This chatbot serves to aid in comprehending medical reports, but it does not replace professional medical advice. Always consult your healthcare provider for personalized guidance.

Feel free to inquire if you have any questions or need further clarification!
`;

const MEDICATION_TEMPLATE = `Medication Template:
Everything below the sentence, "Start of template:", is going to be a template response I want to send to the user.

As a virtual medical advisor, your role extends to providing guidance on prescribed medications. Delve into the details of the prescribed regimen, offering insights, clarifying medication terminology, and outlining crucial considerations. Empower the user to adhere to their medication plan effectively and understand the importance of each prescribed drug.

The user has shared the following medical report:
{MEDICATION_PRESCRIPTION_TEXT}

Intermediary template:
THE MEDCINE NAME IS: 
{
  "name": "Medicine Name",
}

Start of template:

💊 **Medication Guidance:**
- Medication name, dosage, and frequency.
- Clarify the purpose and importance of the prescribed drug.
- Offer insights into potential side effects and interactions.
- Provide guidance on adhering to the medication regimen.

⚠️ **Important Note:**
This chatbot serves to aid in understanding medication prescriptions but is not a substitute for professional medical advice. Consult with your healthcare provider for personalized guidance.

Feel free to ask if you have any questions or need further explanation!
`;

const chatGPTWrapper = async (prompt) => {
    // OpenAI API with chat completion
    try {
        const gptResponse = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            temperature: 0.1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        return {
            prompt: prompt,
            response: gptResponse.choices[0].message.content
        };
    } catch (error) {
        LOG(chalk.red("Error in OpenAI API:", error.message));
        // Handle the error as per your application's requirements
        return "Error occurred during analysis";
    }
};

export const loadPhoto = async (photoUrl) => {
    try {
        // Fetch image data
        const response = await axios.get(photoUrl, {
            responseType: "arraybuffer"
        });

        if (!response.data) {
            throw new Error("Empty response or invalid image data");
        }

        // Return the raw image data
        return response.data;
    } catch (error) {
        console.error("Error loading photo: ", error.message);
        throw error;
    }
};

export const OCR = async (photo) => {
    try {
        const worker = await createWorker("eng");
        const ret = await worker.recognize(photo);
        console.log(ret.data.text);
        await worker.terminate();

        return ret.data.text;
    } catch (error) {
        console.log("Err: ", error);
    }
};

export const analyzeMedicalReport = async (text) => {
    // Add the medical report text to the prompt template
    const medicalReportPromptTemplate = MEDICAL_REPORT_TEMPLATE.replace(
        "{MEDICAL_REPORT_TEXT}",
        text
    );

    return await chatGPTWrapper(medicalReportPromptTemplate);
};

export const analyzeMedication = async (text) => {
    const medicationPromptTemplate = MEDICATION_TEMPLATE.replace(
        "{MEDICATION_PRESCRIPTION_TEXT}",
        text
    );

    console.log(medicationPromptTemplate);

    return await chatGPTWrapper(medicationPromptTemplate);
};

export const enterReminder = async (hours, minutes) => {
    const { error } = await supabase.from("reminder").insert({
        user_id: "qwe123qwe123",
        reminder_name: "AntiCancer",
        reminder_cron: `${minutes} ${hours} * * *`
    });
    if (!error) {
        return `A reminder has been set for ${hours}${minutes}! To set another timing for this medication, please type another timing.`;
    } else {
        return error.message;
    }
};

export const getReminder = async () => {
    const { data, error } = await supabase
        .from("reminder")
        .select("reminder_name, reminder_cron")
        .eq("user_id", "qwe123qwe123");

    if (!error) {
        return { message: `These are your reminders:`, data };
    } else {
        return { message: error.message, data };
    }
};
