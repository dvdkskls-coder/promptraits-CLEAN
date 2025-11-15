// src/utils/dataProcessor.js

/**
 * Procesa un objeto de datos agrupados por categorías y lo aplana en una lista
 * para ser usada en los componentes de selección.
 *
 * @param {object} dataObject - El objeto de datos (ej. `cameras`, `lenses`).
 * @param {function} setterFunction - La función de estado de React (ej. `setProcessedCameras`) para actualizar la lista.
 */
export const processAndSetItems = (dataObject, setterFunction) => {
  if (!dataObject) {
    setterFunction([]);
    return;
  }

  const allItems = Object.values(dataObject)
    .flatMap((category) => category.options || [])
    .map((item) => ({
      id: item.id,
      name: item.name,
    }));

  setterFunction(allItems);
};
