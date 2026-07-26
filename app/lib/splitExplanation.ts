export function splitExplanation(text: string): { summary: string; action: string } {
  const marker = /\*\*what to do\*\*/i;
  const match = text.search(marker);

  if (match === -1) {
    return { summary: text, action: "" };
  }

  const summary = text.slice(0, match).trim();
  const action = text.slice(match).replace(/\*\*/g, "").trim();

  return { summary, action };
}