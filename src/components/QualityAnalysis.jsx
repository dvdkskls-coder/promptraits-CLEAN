export default function QualityAnalysis({ analysis, isPro, onApplySuggestions, isApplying }) {
  if (!analysis) return null;
  
  return (
    <div className="mt-6 p-4 rounded-lg border border-white/10 bg-white/5">
      <div className="font-semibold mb-2">Análisis de calidad</div>
      <pre className="text-sm opacity-80 whitespace-pre-wrap">{JSON.stringify(analysis, null, 2)}</pre>
      {isPro && analysis?.suggestions?.length > 0 && (
        <button
          onClick={onApplySuggestions}
          disabled={isApplying}
          className="mt-3 px-4 py-2 rounded bg-[color:var(--primary)] text-black font-bold disabled:opacity-50"
        >
          {isApplying ? 'Aplicando' : 'Aplicar sugerencias'}
        </button>
      )}
    </div>
  );
}
