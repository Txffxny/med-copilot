import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { cpicPairs } from "@/app/data/cpic-data";

export async function POST(req: Request) {
  try {
    const { drugName, phenotype } = await req.json();

    if (!drugName || !phenotype) {
      return Response.json(
        { error: "Missing drugName or phenotype" },
        { status: 400 }
      );
    }

    const match = cpicPairs.find(
      (p) =>
        p.drugName.toLowerCase() === drugName.toLowerCase() &&
        p.phenotype === phenotype
    );

    if (!match) {
      return Response.json(
        {
          error:
            "No CPIC guidance found for this drug/phenotype combination in our current dataset.",
        },
        { status: 404 }
      );
    }

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      prompt: `You are a careful, plain-language medication safety assistant. Using ONLY the clinical information below, write a short, clear response for a patient (not a clinician). Be warm but direct. Do not add any medical facts beyond what is given.

Drug: ${match.drugName}
Gene: ${match.gene}
Phenotype: ${match.phenotype.replace("_", " ")}
Clinical summary: ${match.summary}
Recommended action: ${match.action}

Structure your response as:
1. One sentence stating what this means for them, in plain English.
2. A short paragraph explaining why (mechanism, kept simple).
3. A clear "What to do" line with the specific action.

Do not include a source citation in your text — that will be shown separately in the UI.`,
    });

    return Response.json({
      explanation: text,
      source: match.source,
      sourceUrl: match.sourceUrl,
      drugName: match.drugName,
      gene: match.gene,
      phenotype: match.phenotype,
    });
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return Response.json(
      { error: "Something went wrong generating the explanation." },
      { status: 500 }
    );
  }
}