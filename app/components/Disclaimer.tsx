export default function Disclaimer() {
  return (
    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
      <p className="text-sm font-medium text-amber-900 mb-1">
        Informational tool only — not medical advice
      </p>
      <p className="text-xs text-amber-800 leading-relaxed">
        This tool provides general pharmacogenomic information for
        educational purposes. It is not a substitute for professional
        medical advice, diagnosis, or treatment, and the simplified genetic
        analysis here does not replace a full clinical pharmacogenomic
        test. Always consult your doctor or pharmacist before starting,
        stopping, or changing any medication.
      </p>
    </div>
  );
}