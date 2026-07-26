import { furtherReading } from "@/app/data/further-reading";

export default function FurtherReading({ gene }: { gene: string }) {
  const links = furtherReading[gene];
  if (!links || links.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-xs font-medium text-zinc-600 mb-1.5">
        Want to read the underlying research yourself?
      </p>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.url} className="text-xs">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline hover:text-blue-900">{link.label}</a>
            <span className="text-zinc-400"> — {link.sourceType}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}