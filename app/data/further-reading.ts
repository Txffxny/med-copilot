export interface ReadingLink {
  label: string;
  url: string;
  sourceType: string;
}

export const furtherReading: Record<string, ReadingLink[]> = {
  CYP2D6: [
    {
      label: "Codeine Therapy and CYP2D6 Genotype",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK100662/",
      sourceType: "NCBI Medical Genetics Summaries (peer-reviewed)",
    },
    {
      label: "CYP2D6 Overview: Allele and Phenotype Frequencies",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK574601/",
      sourceType: "NCBI Medical Genetics Summaries (peer-reviewed)",
    },
  ],
  CYP2C19: [
    {
      label: "Clopidogrel Therapy and CYP2C19 Genotype",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK84114/",
      sourceType: "NCBI Medical Genetics Summaries (peer-reviewed)",
    },
  ],
  CYP2C9: [
    {
      label: "Warfarin Therapy and VKORC1 and CYP Genotype",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK84174/",
      sourceType: "NCBI Medical Genetics Summaries (peer-reviewed)",
    },
  ],
  SLCO1B1: [
    {
      label: "Simvastatin Therapy and SLCO1B1 Genotype",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK602238/",
      sourceType: "NCBI Medical Genetics Summaries (peer-reviewed)",
    },
    {
      label: "CPIC Guideline for SLCO1B1 and Simvastatin-Induced Myopathy (2014 update)",
      url: "https://pubmed.ncbi.nlm.nih.gov/24918167/",
      sourceType: "PubMed (peer-reviewed journal article)",
    },
  ],
};