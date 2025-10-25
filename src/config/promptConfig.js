/**
 * CONFIGURACIÓN DEL SISTEMA DE PROMPTS - PROMPTRAITS
 * Límites de caracteres: 1000-1800 (óptimo: 1200-1600)
 */

export const PROMPT_LIMITS = {
  MIN_LENGTH: 1000,      // Mínimo requerido
  MAX_LENGTH: 1800,      // Máximo permitido
  OPTIMAL_MIN: 1200,     // Inicio del rango óptimo
  OPTIMAL_MAX: 1600,     // Fin del rango óptimo
};

export const QUALITY_THRESHOLDS = {
  EXCELLENT: 9.5,    // Excelente (1200-1600 chars)
  VERY_GOOD: 9.0,    // Muy bueno (1000-1800 chars)
  GOOD: 8.0,         // Bueno (800-2000 chars)
  ACCEPTABLE: 7.0,   // Aceptable (500+ chars)
};

/**
 * Validación de longitud de prompt
 */
export function validatePromptLength(prompt) {
  const length = prompt.length;
  
  return {
    isValid: length >= PROMPT_LIMITS.MIN_LENGTH && length <= PROMPT_LIMITS.MAX_LENGTH,
    length,
    status: getPromptLengthStatus(length),
    recommendation: getPromptLengthRecommendation(length),
  };
}

/**
 * Obtiene el estado de la longitud del prompt
 */
function getPromptLengthStatus(length) {
  if (length < PROMPT_LIMITS.MIN_LENGTH) return 'too_short';
  if (length > PROMPT_LIMITS.MAX_LENGTH) return 'too_long';
  if (length >= PROMPT_LIMITS.OPTIMAL_MIN && length <= PROMPT_LIMITS.OPTIMAL_MAX) return 'optimal';
  return 'acceptable';
}

/**
 * Obtiene recomendaciones basadas en la longitud
 */
function getPromptLengthRecommendation(length) {
  if (length < PROMPT_LIMITS.MIN_LENGTH) {
    return `El prompt es demasiado corto (${length} chars). Necesita al menos ${PROMPT_LIMITS.MIN_LENGTH} caracteres para garantizar calidad.`;
  }
  
  if (length > PROMPT_LIMITS.MAX_LENGTH) {
    return `El prompt es demasiado largo (${length} chars). Debe reducirse a máximo ${PROMPT_LIMITS.MAX_LENGTH} caracteres.`;
  }
  
  if (length >= PROMPT_LIMITS.OPTIMAL_MIN && length <= PROMPT_LIMITS.OPTIMAL_MAX) {
    return `¡Perfecto! El prompt está en el rango óptimo (${length} chars).`;
  }
  
  return `El prompt está en rango aceptable (${length} chars), pero ideal sería ${PROMPT_LIMITS.OPTIMAL_MIN}-${PROMPT_LIMITS.OPTIMAL_MAX} caracteres.`;
}

/**
 * Calcula el score de calidad basado en la longitud
 */
export function calculateLengthScore(length) {
  if (length >= PROMPT_LIMITS.OPTIMAL_MIN && length <= PROMPT_LIMITS.OPTIMAL_MAX) {
    return 3.0; // Puntuación máxima
  }
  
  if (length >= PROMPT_LIMITS.MIN_LENGTH && length <= PROMPT_LIMITS.MAX_LENGTH) {
    return 2.5; // Puntuación muy buena
  }
  
  if (length >= PROMPT_LIMITS.MIN_LENGTH - 200 && length <= PROMPT_LIMITS.MAX_LENGTH + 200) {
    return 1.5; // Puntuación aceptable
  }
  
  return 0.5; // Puntuación baja
}

export default {
  PROMPT_LIMITS,
  QUALITY_THRESHOLDS,
  validatePromptLength,
  calculateLengthScore,
};
