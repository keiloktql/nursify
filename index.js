// Test the file, backend.js
import { OCR, analyzeMedicalReport } from "./backend.js";

// Create an IIFE
(async () => {
  // Test the explainMedicalReport function
  const ocr = OCR(
    "https://asset.cloudinary.com/dyp4najuf/411f9af8f040d969c07dfbcbd040bbd1"
  );
  const text = await analyzeMedicalReport(ocr);
  console.log(text);
})();
