// src/components/AnimatedSection.jsx
import React from 'react';

/**
 * Contenedor simple para secciones animables (sin deps).
 * Exporta tanto "named" como "default" para evitar desajustes.
 */
export function AnimatedSection({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

export default AnimatedSection;
