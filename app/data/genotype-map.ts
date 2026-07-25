// Simplified single-SNP "tag" markers for common star alleles.
// This is a simplified educational approximation, not a full clinical
// pharmacogenomic panel (e.g. it does not detect CYP2D6 copy-number
// variants such as gene duplications or deletions).

import { Phenotype } from "@/app/data/cpic-data";

export interface SnpMarker {
  rsid: string;
  gene: string;
  allele: string; // the star allele this SNP tags, e.g. "*4"
  variantGenotype: string[]; // genotype calls (either order) that indicate the variant allele is present
}

export const snpMarkers: SnpMarker[] = [
  { rsid: "rs3892097", gene: "CYP2D6", allele: "*4", variantGenotype: ["AA", "AG", "GA"] },
  { rsid: "rs4244285", gene: "CYP2C19", allele: "*2", variantGenotype: ["AA", "AG", "GA"] },
  { rsid: "rs12248560", gene: "CYP2C19", allele: "*17", variantGenotype: ["TT", "CT", "TC"] },
  { rsid: "rs1799853", gene: "CYP2C9", allele: "*2", variantGenotype: ["TT", "CT", "TC"] },
  { rsid: "rs1057910", gene: "CYP2C9", allele: "*3", variantGenotype: ["CC", "AC", "CA"] },
  { rsid: "rs4149056", gene: "SLCO1B1", allele: "decreased", variantGenotype: ["CC", "TC", "CT"] },
];

export interface GenotypeCall {
  gene: string;
  phenotype: Phenotype;
  rawGenotype: string;
  note: string;
}

// Very simplified zygosity-based phenotype derivation from a single tag SNP
// per gene. Real clinical calling considers many more variants and, for
// CYP2D6, gene copy number.
export function derivePhenotype(gene: string, genotype: string): GenotypeCall {
  const upper = genotype.toUpperCase();
  const isHomozygousVariant =
    upper.length === 2 && upper[0] === upper[1];

  if (gene === "CYP2D6") {
    if (isHomozygousVariant) {
      return {
        gene,
        phenotype: "poor_metabolizer",
        rawGenotype: genotype,
        note: "Homozygous for the CYP2D6*4 no-function tag SNP (simplified single-marker estimate).",
      };
    }
    return {
      gene,
      phenotype: "intermediate_metabolizer",
      rawGenotype: genotype,
      note: "Heterozygous carrier of the CYP2D6*4 no-function tag SNP (simplified single-marker estimate).",
    };
  }

  if (gene === "CYP2C19") {
    return {
      gene,
      phenotype: "intermediate_metabolizer",
      rawGenotype: genotype,
      note: "Simplified single-marker estimate based on CYP2C19 tag SNPs.",
    };
  }

  if (gene === "CYP2C9") {
    if (isHomozygousVariant) {
      return {
        gene,
        phenotype: "poor_metabolizer",
        rawGenotype: genotype,
        note: "Homozygous for a CYP2C9 reduced-function tag SNP (simplified single-marker estimate).",
      };
    }
    return {
      gene,
      phenotype: "intermediate_metabolizer",
      rawGenotype: genotype,
      note: "Heterozygous carrier of a CYP2C9 reduced-function tag SNP (simplified single-marker estimate).",
    };
  }

  if (gene === "SLCO1B1") {
    if (isHomozygousVariant) {
      return {
        gene,
        phenotype: "poor_metabolizer",
        rawGenotype: genotype,
        note: "Homozygous for the SLCO1B1 decreased-function tag SNP (simplified single-marker estimate).",
      };
    }
    return {
      gene,
      phenotype: "intermediate_metabolizer",
      rawGenotype: genotype,
      note: "Heterozygous carrier of the SLCO1B1 decreased-function tag SNP (simplified single-marker estimate).",
    };
  }

  return {
    gene,
    phenotype: "normal_metabolizer",
    rawGenotype: genotype,
    note: "No variant tag SNP detected for this gene; defaulting to normal function (simplified estimate).",
  };
}

export interface ParsedFileResult {
  calls: GenotypeCall[];
  errors: string[];
}

// Parses 23andMe-style raw genotype text: rsid <tab> chromosome <tab> position <tab> genotype
export function parseRawGenotypeFile(fileText: string): ParsedFileResult {
  const lines = fileText.split("\n");
  const genotypeByRsid: Record<string, string> = {};

  for (const line of lines) {
    if (!line || line.startsWith("#")) continue;
    const parts = line.trim().split(/\t|\s+/);
    if (parts.length < 4) continue;
    const [rsid, , , genotype] = parts;
    genotypeByRsid[rsid] = genotype;
  }

  const calls: GenotypeCall[] = [];
  const errors: string[] = [];
  const seenGenes = new Set<string>();

  for (const marker of snpMarkers) {
    if (seenGenes.has(marker.gene)) continue; // one call per gene for this simplified demo
    const genotype = genotypeByRsid[marker.rsid];

    if (!genotype || genotype === "--") {
      errors.push(`No usable result found for ${marker.gene} (marker ${marker.rsid}).`);
      continue;
    }

    const isVariant = marker.variantGenotype.includes(genotype.toUpperCase());
    seenGenes.add(marker.gene);

    if (!isVariant) {
      calls.push({
        gene: marker.gene,
        phenotype: "normal_metabolizer",
        rawGenotype: genotype,
        note: `No variant detected at ${marker.rsid} (simplified single-marker estimate).`,
      });
    } else {
      calls.push(derivePhenotype(marker.gene, genotype));
    }
  }

  return { calls, errors };
}