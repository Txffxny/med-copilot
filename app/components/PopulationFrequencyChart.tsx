import { Phenotype } from "@/app/data/cpic-data";

type FreqEntry = { phenotype: Phenotype; label: string; pct: number; color: string };

const geneFrequencies: Record<string, { entries: FreqEntry[]; source: string; sourceUrl: string; note: string }> = {
  CYP2D6: {
    entries: [
      { phenotype: "poor_metabolizer", label: "Poor", pct: 1, color: "#dc2626" },
      { phenotype: "intermediate_metabolizer", label: "Intermediate", pct: 24, color: "#d97706" },
      { phenotype: "normal_metabolizer", label: "Normal", pct: 70, color: "#16a34a" },
      { phenotype: "ultrarapid_metabolizer", label: "Ultrarapid", pct: 4, color: "#d97706" },
    ],
    source: "NCBI Medical Genetics Summaries: CYP2D6 Overview",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK574601/",
    note: "Global pooled average. Poor-metabolizer frequency alone ranges from under 1% to over 10% depending on ancestry.",
  },
  CYP2C19: {
    entries: [
      { phenotype: "poor_metabolizer", label: "Poor", pct: 2, color: "#dc2626" },
      { phenotype: "intermediate_metabolizer", label: "Intermediate", pct: 26, color: "#d97706" },
      { phenotype: "normal_metabolizer", label: "Normal", pct: 40, color: "#16a34a" },
      { phenotype: "rapid_metabolizer", label: "Rapid", pct: 27, color: "#2563eb" },
      { phenotype: "ultrarapid_metabolizer", label: "Ultrarapid", pct: 5, color: "#7c3aed" },
    ],
    source: "St. Jude Pharmacogenomics (European population estimate)",
    sourceUrl: "https://www.stjude.org/content/dam/en_US/shared/www/research/pharmaceutical-sciences/CYP2C19%20Competency.pdf",
    note: "Estimate for European ancestry. Frequencies differ substantially by ancestry.",
  },
  SLCO1B1: {
    entries: [
      { phenotype: "poor_metabolizer", label: "Poor", pct: 2, color: "#dc2626" },
      { phenotype: "normal_metabolizer", label: "Normal", pct: 72, color: "#16a34a" },
    ],
    source: "KNMP Pharmacogenetics (Caucasian population estimate)",
    sourceUrl: "https://www.knmp.nl/sites/default/files/2023-11/SLCO1B1_English.pdf",
    note: "Estimate for individuals of Caucasian ancestry.",
  },
  CYP2C9: {
    entries: [
      { phenotype: "poor_metabolizer", label: "Poor", pct: 5, color: "#dc2626" },
      { phenotype: "intermediate_metabolizer", label: "Intermediate", pct: 36, color: "#d97706" },
      { phenotype: "normal_metabolizer", label: "Normal", pct: 57, color: "#16a34a" },
    ],
    source: "Population cohort estimate, broadly consistent with European data",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11823145/",
    note: "Approximate estimate. Frequencies vary by ancestry.",
  },
};

export default function PopulationFrequencyChart(props: {
  gene: string;
  highlightPhenotype: Phenotype;
}) {
  const data = geneFrequencies[props.gene];
  if (!data) return null;

  return (
    <div>
      <p className="text-sm font-medium text-zinc-700 mb-3">
        How common is your result?
      </p>
      <div className="space-y-2">
        {data.entries.map((entry) => {
          const isYou = entry.phenotype === props.highlightPhenotype;
          return (
            <div key={entry.phenotype} className="flex items-center gap-3">
              <span className={"w-24 text-xs shrink-0 " + (isYou ? "font-semibold text-zinc-900" : "text-zinc-500")}>
                {entry.label}{isYou ? " (you)" : ""}
              </span>
              <div className="flex-1 bg-zinc-100 rounded h-4 overflow-hidden">
                <div className="h-full rounded" style={{ width: entry.pct + "%", backgroundColor: entry.color, opacity: isYou ? 1 : 0.5 }} />
              </div>
              <span className="w-10 text-xs text-zinc-500 text-right">{entry.pct}%</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-zinc-400 mt-3">{data.note}</p>
      <p className="text-xs text-zinc-400 mt-1">
        {"Source: "}
        <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600">{data.source}</a>
      </p>
    </div>
  );
}