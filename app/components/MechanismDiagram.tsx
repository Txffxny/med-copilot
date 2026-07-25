import { Phenotype } from "@/app/data/cpic-data";

function getPathwayState(phenotype: Phenotype): "blocked" | "excess" | "normal" {
  if (phenotype === "poor_metabolizer" || phenotype === "intermediate_metabolizer") {
    return "blocked";
  }
  if (phenotype === "ultrarapid_metabolizer" || phenotype === "rapid_metabolizer") {
    return "excess";
  }
  return "normal";
}

export default function MechanismDiagram({
  drugName,
  gene,
  phenotype,
}: {
  drugName: string;
  gene: string;
  phenotype: Phenotype;
}) {
  const state = getPathwayState(phenotype);

  const arrowColor =
    state === "blocked" ? "#dc2626" : state === "excess" ? "#d97706" : "#16a34a";
  const label =
    state === "blocked"
      ? "Conversion impaired"
      : state === "excess"
      ? "Conversion sped up"
      : "Conversion normal";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 520 160" className="w-full max-w-md">
        <rect x="10" y="55" width="130" height="50" rx="8" fill="#f4f4f5" stroke="#d4d4d8" />
        <text x="75" y="85" textAnchor="middle" fontSize="14" fill="#27272a">
          {drugName}
        </text>

        <line
          x1="140"
          y1="80"
          x2="215"
          y2="80"
          stroke={arrowColor}
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />
        {state === "blocked" && (
          <text x="177" y="65" textAnchor="middle" fontSize="16" fill={arrowColor}>
            ✕
          </text>
        )}

        <rect x="215" y="55" width="90" height="50" rx="8" fill="#f4f4f5" stroke="#d4d4d8" />
        <text x="260" y="80" textAnchor="middle" fontSize="13" fill="#27272a">
          {gene}
        </text>
        <text x="260" y="95" textAnchor="middle" fontSize="10" fill="#71717a">
          enzyme
        </text>

        <line
          x1="305"
          y1="80"
          x2="380"
          y2="80"
          stroke={arrowColor}
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />

        <rect x="380" y="55" width="130" height="50" rx="8" fill="#f4f4f5" stroke="#d4d4d8" />
        <text x="445" y="80" textAnchor="middle" fontSize="13" fill="#27272a">
          Active form
        </text>
        <text x="445" y="95" textAnchor="middle" fontSize="10" fill="#71717a">
          (intended effect)
        </text>

        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill={arrowColor} />
          </marker>
        </defs>
      </svg>
      <p className="text-xs mt-2 font-medium" style={{ color: arrowColor }}>
        {label}
      </p>
    </div>
  );
}