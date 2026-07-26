"use client";

import { useState, useMemo } from "react";
import { cpicPairs, Phenotype } from "@/app/data/cpic-data";
import Accordion from "@/app/components/Accordion";
import PopulationFrequencyChart from "@/app/components/PopulationFrequencyChart";
import Disclaimer from "@/app/components/Disclaimer";
import GenotypeUpload from "@/app/components/GenotypeUpload";
import FurtherReading from "@/app/components/FurtherReading";

const phenotypeLabels: Record<Phenotype, string> = {
  poor_metabolizer: "Poor Metabolizer",
  intermediate_metabolizer: "Intermediate Metabolizer",
  normal_metabolizer: "Normal Metabolizer",
  rapid_metabolizer: "Rapid Metabolizer",
  ultrarapid_metabolizer: "Ultrarapid Metabolizer",
};

interface AnalyzeResult {
  explanation: string;
  source: string;
  sourceUrl: string;
  drugName: string;
  gene: string;
  phenotype: Phenotype;
}

export default function Home() {
  const [selectedDrug, setSelectedDrug] = useState("");
  const [selectedPhenotype, setSelectedPhenotype] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState("");

  const drugs = useMemo(
    () => Array.from(new Set(cpicPairs.map((p) => p.drugName))),
    []
  );

  const availablePhenotypes = useMemo(() => {
    if (!selectedDrug) return [];
    return cpicPairs
      .filter((p) => p.drugName === selectedDrug)
      .map((p) => p.phenotype);
  }, [selectedDrug]);

  function handleDrugChange(drug: string) {
    setSelectedDrug(drug);
    setSelectedPhenotype("");
    setResult(null);
    setError("");
  }

  async function handleSubmit() {
    if (!selectedDrug || !selectedPhenotype) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drugName: selectedDrug,
          phenotype: selectedPhenotype,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Could not reach the server. Is it still running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-xl">
        <Disclaimer />

        <h1 className="text-2xl font-semibold text-zinc-900 mb-2">
          Medication Safety Copilot
        </h1>
        <p className="text-zinc-600 mb-8">
          Check how your genetics may affect how you respond to common
          medications.
        </p>

        <div className="mb-3">
          <span className="inline-block text-xs font-semibold uppercase tracking-wide text-zinc-500 bg-zinc-200 rounded-full px-3 py-1">
            Option 1
          </span>
        </div>
        <GenotypeUpload />

        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-xs text-zinc-400 uppercase tracking-wide">
            or
          </span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        <div className="mb-3">
          <span className="inline-block text-xs font-semibold uppercase tracking-wide text-zinc-500 bg-zinc-200 rounded-full px-3 py-1">
            Option 2
          </span>
        </div>
        <p className="text-sm text-zinc-600 mb-4">
          Don&apos;t have a genetic test file? Enter your metabolizer status
          manually if you already know it.
        </p>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Medication
            </label>
            <select
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900"
              value={selectedDrug}
              onChange={(e) => handleDrugChange(e.target.value)}
            >
              <option value="">Select a medication...</option>
              {drugs.map((drug) => (
                <option key={drug} value={drug}>
                  {drug}
                </option>
              ))}
            </select>
          </div>

          {selectedDrug && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Your Metabolizer Status
              </label>
              <select
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900"
                value={selectedPhenotype}
                onChange={(e) => setSelectedPhenotype(e.target.value)}
              >
                <option value="">Select your status...</option>
                {availablePhenotypes.map((ph) => (
                  <option key={ph} value={ph}>
                    {phenotypeLabels[ph]}
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-400 mt-1">
                Only statuses with established CPIC guidance for this
                medication are shown.
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selectedDrug || !selectedPhenotype || loading}
            className="w-full bg-zinc-900 text-white rounded-lg py-2.5 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
          >
            {loading ? "Analyzing..." : "Get Guidance"}
          </button>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-white rounded-xl border border-zinc-200 p-6">
            <div className="whitespace-pre-wrap text-zinc-800 leading-relaxed">
              {result.explanation}
            </div>
            <div className="mt-5 pt-4 border-t border-zinc-100 text-sm text-zinc-500">
              {"Source: "}
              <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-700">{result.source}</a>
            </div>

            <Accordion title="Learn more: how common is this?">
              <PopulationFrequencyChart
                gene={result.gene}
                highlightPhenotype={result.phenotype}
              />
            </Accordion>

            <FurtherReading gene={result.gene} />
          </div>
        )}
      </div>
    </div>
  );
}