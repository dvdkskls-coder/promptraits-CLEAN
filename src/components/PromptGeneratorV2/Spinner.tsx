// src/components/PromptGeneratorV2/Spinner.tsx

import React from "react";

interface SpinnerProps {
  message?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  message = "Cargando...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-zinc-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-zinc-400 text-sm">{message}</p>
    </div>
  );
};
