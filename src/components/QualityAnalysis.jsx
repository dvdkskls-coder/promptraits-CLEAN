import { CheckCircle2, Lightbulb, TrendingUp } from "lucide-react";

export default function QualityAnalysis({
  analysis,
  isPro,
  onApplySuggestions,
  isApplying,
}) {
  if (!analysis) return null;

  const { score, included, suggestions } = analysis;

  // Calcular porcentaje y color
  const percentage = Math.round(score * 10);
  const getScoreColor = () => {
    if (score >= 9) return "text-green-400";
    if (score >= 7) return "text-yellow-400";
    return "text-orange-400";
  };

  const getScoreLabel = () => {
    if (score >= 9) return "Excelente";
    if (score >= 7.5) return "Muy Bueno";
    if (score >= 6) return "Bueno";
    return "Mejorable";
  };

  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-semibold text-lg">Análisis de Calidad</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-60">{getScoreLabel()}</span>
            <span className={`text-2xl font-bold ${getScoreColor()}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-sm opacity-60">/10</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-white/5 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--primary)] to-yellow-400 transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 space-y-5">
        {/* Lo que está bien */}
        {included && included.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <h4 className="font-semibold text-green-400">
                Elementos Fuertes
              </h4>
            </div>
            <ul className="space-y-2">
              {included.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm opacity-80"
                >
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sugerencias de mejora */}
        {suggestions && suggestions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <h4 className="font-semibold text-yellow-400">
                Sugerencias de Mejora
              </h4>
            </div>
            <ul className="space-y-2">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm opacity-80"
                >
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Botón aplicar sugerencias (solo PRO) */}
            {isPro && (
              <button
                onClick={onApplySuggestions}
                disabled={isApplying}
                className="mt-4 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--primary)] to-yellow-400 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isApplying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Aplicando sugerencias...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4" />
                    <span>Aplicar Sugerencias</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer con nota */}
      <div className="px-5 py-3 bg-white/5 border-t border-white/10">
        <p className="text-xs opacity-60 text-center">
          Análisis basado en estándares de fotografía profesional y edición en
          Capture One
        </p>
      </div>
    </div>
  );
}
