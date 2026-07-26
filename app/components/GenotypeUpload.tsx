"use client";

import { useState } from "react";
import { parseRawGenotypeFile, GenotypeCall } from "@/app/data/genotype-map";
import { cpicPairs, Phenotype } from "@/app/data/cpic-data";
import Accordion from "@/app/components/Accordion";
import PopulationFrequencyChart from "@/app/components/PopulationFrequencyChart";
import ProcessingExplainer from "@/app/components/ProcessingExplainer";
import FurtherReading from "@/app/components/FurtherReading";
import ListenButton from "@/app/components/ListenButton";
import { splitExplanation } from "@/app/lib/splitExplanation";

interface UploadResult {
  gene: string;
  drugName: string;
  phenotype: Phenotype;
  rawGenotype: string;
  note: string;
  explanation?: string;
  source?: string;
  sourceUrl?: string;
  loading: boolean;
  error?: string;
}

export default function GenotypeUpload() {
  const [fileName, setFileName] = useState("");
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [parsing, setParsing] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParsing(true);
    setResults([]);
    setParseErrors([]);

    const text = await file.text();
    const { calls, errors } = parseRawGenotypeFile(text);
    setParseErrors(errors);

    const initial: UploadResult[] = calls
      .map((call: GenotypeCall) => {
        const match = cpicPairs.find(
          (p) => p.gene === call.gene && p.phenotype === call.phenotype
        );
        if (!match) return null;
        return {
          gene: call.gene,
          drugName: match.drugName,
          phenotype: call.phenotype,
          rawGenotype: call.rawGenotype,
          note: call.note,
          loading: true,
        } as UploadResult;
      })
      .filter((r): r is UploadResult => r !== null);

    setResults(initial);
    setParsing(false);

    for (const item of initial) {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            drugName: item.drugName,
            phenotype: item.phenotype,
          }),
        });
        const data = await res.json();

        setResults((prev) =>
          prev.map((r) =>
            r.gene === item.gene
              ? {
                  ...r,
                  loading: false,
                  explanation: data.explanation,
                  source: data.source,
                  sourceUrl: data.sourceUrl,
                  error: res.ok ? undefined : data.error,
                }
              : r
          )
        );
      } catch {
        setResults((prev) =>
          prev.map((r) =>
            r.gene === item.gene
              ? { ...r, loading: false, error: "Could not reach the server." }
              : r
          )
        );
      }
    }
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <h2 className="text-lg font-semibold text-zinc-900 mb-1">
        Upload genetic test results
      </h2>
      <p className="text-sm text-zinc-600 mb-4">
        Upload a raw genotype file (23andMe-style .txt format) to
        automatically check it against our supported genes and medications.
      </p>

      <label className="block">
        <span className="sr-only">Choose file</span>
        <input
          type="file"
          accept=".txt"
          onChange={handleFile}
          className="block w-full text-sm text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 file:cursor-pointer"
        />
      </label>

      <ProcessingExplainer />

      {fileName && (
        <p className="text-xs text-zinc-400 mt-2">
          {"Loaded: "}
          {fileName}
        </p>
      )}

      {parsing && (
        <p className="text-sm text-zinc-500 mt-4">Reading file...</p>
      )}

      {parseErrors.length > 0 && (
        <div className="mt-4 bg-zinc-50 border border-zinc-200 rounded-lg p-3">
          {parseErrors.map((err, i) => (
            <p key={i} className="text-xs text-zinc-500">
              {err}
            </p>
          ))}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          {results.map((r) => {
            const split = r.explanation ? splitExplanation(r.explanation) : null;
            return (
              <div key={r.gene} className="border border-zinc-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-zinc-900">
                    {r.drugName} ({r.gene})
                  </span>
                  <span className="text-xs text-zinc-400">
                    {"Raw call: "}
                    {r.rawGenotype}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-3">{r.note}</p>

                {r.loading && <p className="text-sm text-zinc-500">Analyzing...</p>}

                {r.error && <p className="text-sm text-red-600">{r.error}</p>}

                {split && (
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        What this means
                      </p>
                      <ListenButton text={split.summary} label="Listen" />
                    </div>
                    <div className="whitespace-pre-wrap text-sm text-zinc-800 leading-relaxed mb-4">
                      {split.summary}
                    </div>

                    {split.action && (
                      <>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                            What to do
                          </p>
                          <ListenButton text={split.action} label="Listen" />
                        </div>
                        <div className="whitespace-pre-wrap text-sm text-zinc-800 leading-relaxed">
                          {split.action}
                        </div>
                      </>
                    )}

                    {r.sourceUrl && r.source && (
                      <div className="mt-3 pt-3 border-t border-zinc-100 text-xs text-zinc-500">
                        {"Source: "}
                        <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-700">{r.source}</a>
                      </div>
                    )}
                    <Accordion title="Learn more: how common is this?">
                      <PopulationFrequencyChart gene={r.gene} highlightPhenotype={r.phenotype} />
                    </Accordion>

                    <FurtherReading gene={r.gene} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}