// src/utils/dataProcessor.js

/**
 * Procesa un objeto de datos agrupados por categorías y lo aplana en una lista
 * para ser usada en los componentes de selección.
 *
 * @param {object} dataObject - El objeto de datos (ej. `cameras`, `lenses`).
 * @param {function} setterFunction - La función de estado de React (ej. `setProcessedCameras`) para actualizar la lista.
 */
export const processAndSetItems = (data) => {
  if (!data) {
    return [];
  }

  // Caso 1: El dato es un array de objetos (ej. SHOT_TYPES, LIGHTING_SETUPS)
  if (Array.isArray(data)) {
    return data.map((item) => ({
      id: item.id,
      name: item.nameES || item.name, // Prioriza el nombre en español si existe
    }));
  }

  // Caso 2: El dato es un objeto de objetos (ej. ENVIRONMENTS)
  // y no tiene sub-categorías con 'options'.
  if (
    typeof data === "object" &&
    !Object.values(data).some((cat) => cat.options)
  ) {
    return Object.values(data).map((item) => ({
      id: item.id,
      name: item.name,
    }));
  }

  // Caso 3: El dato es un objeto con categorías que contienen 'options' (ej. cameras, lenses)
  if (typeof data === "object") {
    return Object.values(data)
      .flatMap((category) => category.options || [])
      .map((item) => ({
        id: item.id,
        name: item.name,
      }));
  }

  return [];
};
