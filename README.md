# Medication Safety Copilot

A pharmacogenomic medication safety tool that translates genetic test results into clear, sourced, actionable guidance — built for the Juno "Build the Future of Healthcare" Hackathon (July 2026).

**Live demo:** https://med-copilot-roan.vercel.app

---

## ⚠️ Important disclaimer

This is an educational prototype, **not medical advice**. It does not replace a full clinical pharmacogenomic test or a conversation with your doctor or pharmacist. See the in-app "How is my data actually processed?" section for a full breakdown of this tool's methodology and limitations.

## What it does

1. **Upload your genetic data** (23andMe-style raw `.txt` file) or manually enter a known metabolizer status
2. The app checks your genotype against a small set of well-established pharmacogenomic markers (CYP2D6, CYP2C19, CYP2C9, SLCO1B1)
3. Your estimated metabolizer status is matched against real **CPIC clinical guidelines** — never guessed
4. Claude rephrases the matched guideline into plain, patient-friendly language (it cannot introduce information beyond the matched guideline)
5. Every result includes: the source citation, a population-frequency comparison chart, links to peer-reviewed literature, and a split, speed-adjustable audio read-aloud (via ElevenLabs)

## Why this design

Most consumer genetic tools either stop at ancestry/traits or risk free-text AI interpretation of raw genetic data with no grounding. This tool is built around a **verified lookup layer**: the AI only ever rephrases a pre-matched, real clinical guideline — if there's no verified match, it says so rather than guessing.

## Supported genes & medications

| Gene | Medication |
|------|-----------|
| CYP2D6 | Codeine |
| CYP2C19 | Clopidogrel |
| CYP2C9 | Warfarin |
| SLCO1B1 | Simvastatin |

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **Anthropic Claude** (Sonnet) for plain-language rephrasing
- **ElevenLabs** for audio read-aloud
- **Tailwind CSS**
- Deployed on **Vercel**

## Try it without your own data

A synthetic sample genotype file (not real genetic data) is available here for testing:
`sample-genotype.txt` in this repo, or [raw link](https://raw.githubusercontent.com/Txffxny/med-copilot/main/app/sample-genotype.txt)

## Known limitations

- Uses single-marker (tag SNP) estimates, not full clinical haplotype phasing
- Does not detect CYP2D6 copy-number variation (duplications/deletions)
- Covers only 4 genes and 4 medications — not a comprehensive panel
- Population frequency data are approximate and ancestry-averaged

## Local development

```bash
npm install
npm run dev
```

Requires a `.env.local` file with:
ANTHROPIC_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here

## Roadmap

- NHS-backed sourcing alongside CPIC guidelines
- Printable "for your GP" summary view
- Expanded gene/medication coverage
