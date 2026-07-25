export type Phenotype =
  | "poor_metabolizer"
  | "intermediate_metabolizer"
  | "normal_metabolizer"
  | "rapid_metabolizer"
  | "ultrarapid_metabolizer";

export interface GeneDrugPair {
  id: string;
  drugName: string;
  gene: string;
  phenotype: Phenotype;
  summary: string;
  action: string;
  source: string;
  sourceUrl: string;
}

export const cpicPairs: GeneDrugPair[] = [
  {
    id: "codeine-cyp2d6-poor",
    drugName: "Codeine",
    gene: "CYP2D6",
    phenotype: "poor_metabolizer",
    summary:
      "Poor CYP2D6 metabolizers cannot efficiently convert codeine into morphine, its active form. This means codeine is likely to provide little to no pain relief.",
    action:
      "Ask your doctor or pharmacist about an alternative pain reliever that does not depend on CYP2D6 activation, such as morphine or a non-opioid option.",
    source: "CPIC Guideline for Codeine and CYP2D6 (2021 update)",
    sourceUrl: "https://cpicpgx.org/guidelines/guideline-for-codeine-and-cyp2d6/",
  },
  {
    id: "codeine-cyp2d6-normal",
    drugName: "Codeine",
    gene: "CYP2D6",
    phenotype: "normal_metabolizer",
    summary:
      "Normal CYP2D6 metabolizers convert codeine into morphine as expected, so it should provide typical pain relief at standard doses.",
    action:
      "No special precaution needed for this gene-drug interaction. Take codeine as prescribed by your doctor.",
    source: "CPIC Guideline for Codeine and CYP2D6 (2021 update)",
    sourceUrl: "https://cpicpgx.org/guidelines/guideline-for-codeine-and-cyp2d6/",
  },
  {
    id: "codeine-cyp2d6-ultrarapid",
    drugName: "Codeine",
    gene: "CYP2D6",
    phenotype: "ultrarapid_metabolizer",
    summary:
      "Ultrarapid CYP2D6 metabolizers convert codeine to morphine unusually fast, which can lead to dangerously high morphine levels even at normal doses.",
    action:
      "Tell your doctor about this status before taking codeine — a non-codeine pain reliever is usually recommended to avoid overdose risk.",
    source: "CPIC Guideline for Codeine and CYP2D6 (2021 update)",
    sourceUrl: "https://cpicpgx.org/guidelines/guideline-for-codeine-and-cyp2d6/",
  },
  {
    id: "clopidogrel-cyp2c19-poor",
    drugName: "Clopidogrel",
    gene: "CYP2C19",
    phenotype: "poor_metabolizer",
    summary:
      "Poor CYP2C19 metabolizers cannot properly activate clopidogrel, a blood thinner. This significantly reduces its ability to prevent blood clots.",
    action:
      "Ask your doctor whether an alternative antiplatelet medication (such as prasugrel or ticagrelor) would be safer and more effective for you.",
    source: "CPIC Guideline for Clopidogrel and CYP2C19 (2022 update)",
    sourceUrl: "https://cpicpgx.org/guidelines/guideline-for-clopidogrel-and-cyp2c19/",
  },
  {
    id: "clopidogrel-cyp2c19-normal",
    drugName: "Clopidogrel",
    gene: "CYP2C19",
    phenotype: "normal_metabolizer",
    summary:
      "Normal CYP2C19 metabolizers activate clopidogrel effectively, so it should work as intended to help prevent blood clots.",
    action:
      "No special precaution needed for this gene-drug interaction. Take clopidogrel as prescribed by your doctor.",
    source: "CPIC Guideline for Clopidogrel and CYP2C19 (2022 update)",
    sourceUrl: "https://cpicpgx.org/guidelines/guideline-for-clopidogrel-and-cyp2c19/",
  },
  {
    id: "simvastatin-slco1b1-poor",
    drugName: "Simvastatin",
    gene: "SLCO1B1",
    phenotype: "poor_metabolizer",
    summary:
      "Reduced SLCO1B1 transporter function can cause simvastatin to build up in the blood, substantially raising the risk of muscle pain and damage (myopathy).",
    action:
      "Ask your doctor about a lower dose, a different statin, or extra monitoring for muscle symptoms like unexplained pain or weakness.",
    source: "CPIC Guideline for Simvastatin and SLCO1B1 (2022 update)",
    sourceUrl: "https://cpicpgx.org/guidelines/guideline-for-simvastatin-and-slco1b1/",
  },
  {
    id: "simvastatin-slco1b1-normal",
    drugName: "Simvastatin",
    gene: "SLCO1B1",
    phenotype: "normal_metabolizer",
    summary:
      "Normal SLCO1B1 transporter function means simvastatin is cleared from the blood as expected, without an increased genetic risk of muscle-related side effects.",
    action:
      "No special precaution needed for this gene-drug interaction. Take simvastatin as prescribed by your doctor.",
    source: "CPIC Guideline for Simvastatin and SLCO1B1 (2022 update)",
    sourceUrl: "https://cpicpgx.org/guidelines/guideline-for-simvastatin-and-slco1b1/",
  },
  {
    id: "warfarin-cyp2c9-poor",
    drugName: "Warfarin",
    gene: "CYP2C9",
    phenotype: "poor_metabolizer",
    summary:
      "Poor CYP2C9 metabolizers clear warfarin more slowly, increasing the risk of excessive blood thinning and bleeding at standard doses.",
    action:
      "Ask your doctor about starting at a lower dose and monitoring your INR (blood clotting test) more closely than usual.",
    source: "CPIC Guideline for Warfarin (2017 update)",
    sourceUrl: "https://cpicpgx.org/guidelines/guideline-for-warfarin-and-cyp2c9-cyp4f2-vkorc1/",
  },
  {
    id: "warfarin-cyp2c9-normal",
    drugName: "Warfarin",
    gene: "CYP2C9",
    phenotype: "normal_metabolizer",
    summary:
      "Normal CYP2C9 metabolizers clear warfarin at a typical rate, so standard dosing guidance should apply without added genetic bleeding risk.",
    action:
      "No special precaution needed for this gene-drug interaction. Follow your doctor's standard warfarin dosing and monitoring schedule.",
    source: "CPIC Guideline for Warfarin (2017 update)",
    sourceUrl: "https://cpicpgx.org/guidelines/guideline-for-warfarin-and-cyp2c9-cyp4f2-vkorc1/",
  },
];

export const supportedDrugs = Array.from(
  new Set(cpicPairs.map((p) => p.drugName))
);