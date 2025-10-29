// ============================================================================
// KNOWLEDGE BASE - INDEX
// ============================================================================
// Punto de entrada centralizado para toda la base de conocimientos

import { platforms, commonMistakes } from './platforms.js';
import { classicSchemes, quality, timeOfDay, direction } from './lighting.js';
import { lenses, apertures, cameraSpecs } from './lenses.js';
import { diffusion, ndFilters, polarizers, specialEffects } from './filters.js';
import { shotTypes, cameraAngles, compositionRules, framingTechniques } from './composition.js';
import { colorGrading, filmStocks, postProcessing } from './colorGrading.js';
import { emotions, gazeDirections, smileTypes } from './emotions.js';

// ============================================================================
// EXPORTAR TODO JUNTO COMO KNOWLEDGE_BASE
// ============================================================================

export const KNOWLEDGE_BASE = {
  // Estructura de prompts por plataforma
  promptStructure: {
    nanoBanana: platforms.nanoBanana,
    midjourney: platforms.midjourney
  },

  // Iluminación profesional
  lighting: {
    classicSchemes,
    quality,
    timeOfDay,
    direction
  },

  // Lentes y especificaciones técnicas
  lenses: {
    types: lenses,
    apertures,
    cameraSpecs
  },

  // Filtros cinematográficos
  filters: {
    diffusion,
    ndFilters,
    polarizers,
    specialEffects
  },

  // Composición y encuadre
  composition: {
    shotTypes,
    cameraAngles,
    rules: compositionRules,
    framingTechniques
  },

  // Color grading y post-procesamiento
  colorGrading: {
    styles: colorGrading,
    filmStocks,
    postProcessing
  },

  // Expresiones y emociones
  emotions: {
    expressions: emotions,
    gazeDirections,
    smileTypes
  },

  // Errores comunes a evitar
  commonMistakes
};

// También exportar módulos individuales para uso específico
export {
  platforms,
  classicSchemes,
  quality,
  timeOfDay,
  direction,
  lenses,
  apertures,
  cameraSpecs,
  diffusion,
  ndFilters,
  polarizers,
  specialEffects,
  shotTypes,
  cameraAngles,
  compositionRules,
  framingTechniques,
  colorGrading,
  filmStocks,
  postProcessing,
  emotions,
  gazeDirections,
  smileTypes,
  commonMistakes
};
