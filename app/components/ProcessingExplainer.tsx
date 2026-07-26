"use client";

import { useState } from "react";

const steps = [
  {
    title: "1. Your file is read in your browser",
    detail:
      "Your genotype file is parsed directly on your device. It is not stored, uploaded to a database, or sent anywhere except as part of the specific request needed to generate your result.",
  },
  {
    title: "2. We look up a small number of specific markers",
    detail:
      "We search your file for a handful of well-established single-marker positions (rsIDs) linked to CYP2D6, CYP2C19, CYP2C9, and SLCO1B1 — the genes with established CPIC medication guidelines in this tool.",
  },
  {
    title: "3. Each marker is compared against known variant calls",
    detail:
      "For each marker found, we check whether your genotype matches a known variant call, and whether you carry one or two copies of it.",
  },
  {
    title: "4. A simplified metabolizer status is estimated",
    detail:
      "Based on the markers found, we estimate a simplified metabolizer status (Poor, Intermediate, Normal, Rapid, or Ultrarapid). This is a single-marker approximation, not a full clinical genotype call.",
  },
  {
    title: "5. That status is matched against a fixed guideline table",
    detail:
      "Your estimated status is matched against a fixed set of real CPIC clinical pharmacogenomic guidelines. If there's no verified match for your result, we say so directly rather than guessing.",
  },
  {
    title: "6. Claude only rewrites the matched guideline in plain English",
    detail:
      "The AI model never freely interprets your raw genetic data. It only rephrases the specific, pre-matched CPIC guidance into plain language — it cannot introduce information that isn't already in that matched guideline.",
  },
];

const limitations = [
  "This uses single-marker (tag SNP) estimates, not full clinical haplotype phasing — the gold-standard method used in real pharmacogenomic testing.",
  "CYP2D6 in particular can involve gene copy-number variation (duplications or deletions), which a single marker cannot detect.",
  "This tool covers only 4 genes and 4 medications — it is not a comprehensive pharmacogenomic panel.",
  "This is an educational prototype, not a diagnostic or clinical-grade tool.",
];

export default function ProcessingExplainer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4 border border-zinc-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
      >
        <span className="text-sm font-medium text-zinc-700">
          How is my data actually processed?
        </span>
        <span
          className={`text-zinc-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          {"▾"}
        </span>
      </button>

      {open && (
        <div className="px-4 py-5 bg-white space-y-4">
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.title}>
                <p className="text-sm font-medium text-zinc-800">
                  {step.title}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-100">
            <p className="text-xs font-semibold text-zinc-700 mb-2">
              Real limitations of this approach
            </p>
            <ul className="space-y-1.5">
              {limitations.map((item, i) => (
                <li
                  key={i}
                  className="text-xs text-zinc-500 leading-relaxed flex gap-2"
                >
                  <span className="text-zinc-300">{"•"}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}