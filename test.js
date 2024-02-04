// Test the file, backend.js
import { OCR, analyzeMedicalReport } from "./processor.js";

// Create an IIFE
(async () => {
    // Test the explainMedicalReport function
    const OCR_MEDICAL_REPORT = `Fair; CHAL PIN ZHENG Date Pred: 3/2/2024 4:24 PM
  ‘Gncer: Male, DOB: 18/2/2003, ge: 0yrs wc:
  Frid 8: CHALPIN ZHENG Phone: -, Enat:
  Free rc: Ministry of efence Patent Portal Primary Care Proacr: Pooe:
  noma rom: Sumi
  Result Details:
  Type of test Laboratory
  Test name: Full Blood Count
  Ordered By. Protocol, Order
  Dale test performed: 2023 10:48 AM
  Pertomed By:
  Component Value unit Ref. Range
  Haemoglobin 141 gL 135180
  Red Call Count Total ~~ 46 Sorizn i565
  Total Whi Call Count 6.0 oa pre)
  Platelets Count 20 oa ‘0-440
  Neutrophis 37 ora 180690
  Lymphocytes rs ora 120390
  Nonocyles os ora 010080
  Eosnophis 016 ora <ost
  Basophis 003 ora 220
  Neutrophils (%) 23 % 00760
  Lymphocytes (%) 277 * 200450
  Nonocyls (%) 52 * 20110
  Ecsinophis (%) 27 * i050
  Basophis (5) os % 21
  PACKED CELL VOLUME
  (PCV) HAEMATOCRIT (%) “4 * dost
  Mean Cll Volume. os ® 78%
  Mean Corpuscuar
  i El bo Ee)
  eon Compscuer 2 so a0
  Row ne % 10155
  Peripheral Blood Fim
  Result Notes: Red cells appear normochromic and normocytic.
  Hematoct (PCV) ABS 0.44 040054
  No Comments found
  Retrieve fo: sunrise
  Eeeaty S01 Snices sve System Administrator) (7/8/2023 10:25
  Last odd By: SCM, Services sve (System Administrator) (8/8/2023 7:48`;

    const analysis = await analyzeMedicalReport(OCR_MEDICAL_REPORT);
    console.log(analysis);
})();
