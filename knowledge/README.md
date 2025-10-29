# 📚 Knowledge Base - Arquitectura Modular

## 🎯 **CONCEPTO**

Los conocimientos técnicos sobre fotografía profesional están **separados** de la lógica del sistema. Esto permite:

- ✅ **Mantenibilidad**: Editar conocimientos sin tocar lógica
- ✅ **Claridad**: Cada archivo tiene un propósito específico
- ✅ **Escalabilidad**: Agregar nuevas categorías fácilmente
- ✅ **Reutilización**: Usar conocimientos en otros componentes
- ✅ **Testing**: Probar conocimientos independientemente

---

## 📁 **ESTRUCTURA DE ARCHIVOS**

```
/knowledge/
├── index.js            ← Exporta todo junto
├── platforms.js        ← Nano-banana, Midjourney
├── lighting.js         ← Rembrandt, Butterfly, Loop, Split...
├── lenses.js           ← 50mm, 85mm, 135mm, especificaciones
├── filters.js          ← Black Pro-Mist, ND, Polarizadores
├── composition.js      ← Shot types, ángulos, reglas
├── colorGrading.js     ← Teal & Orange, Vintage, High-Key...
└── emotions.js         ← Expresiones faciales, miradas

/api/
└── gemini-processor.js ← Lógica del sistema (importa /knowledge)
```

---

## 📖 **CONTENIDO DE CADA ARCHIVO**

### **platforms.js**
Estructura de prompts para diferentes plataformas:
- Nano-banana (Google Gemini)
- Midjourney V7
- Reglas específicas de cada plataforma
- Errores comunes a evitar

### **lighting.js**
Esquemas de iluminación profesional:
- Classic Schemes: Rembrandt, Butterfly, Loop, Split, Broad, Short
- Quality: Soft (difusa), Hard (dura)
- Time of Day: Golden Hour, Blue Hour, Midday, Overcast
- Direction: Frontal, Lateral, Trasera, Cenital, Uplighting

### **lenses.js**
Lentes y especificaciones técnicas:
- Lentes: 24-35mm, 50mm, 85mm, 135-200mm
- Aperturas: f/1.2, f/1.4, f/1.8, f/2.8, f/4, f/5.6-f/16
- Camera Specs: Sensores (Full-frame, APS-C, Medium format), ISO, Shutter Speed

### **filters.js**
Filtros cinematográficos:
- Diffusion: Black Pro-Mist, Hollywood Black Magic, Glimmerglass
- ND Filters: Fijos, Variables, Graduados
- Polarizers: CPL (Circular Polarizing)
- Special Effects: Anamorphic Flares, Prism Effects

### **composition.js**
Composición y encuadre:
- Shot Types: ECU, CU, MCU, MS, American, Full, Long
- Camera Angles: Eye level, High angle, Low angle, Bird's eye, Dutch angle
- Composition Rules: Rule of thirds, Golden ratio, Centered, Leading lines
- Framing Techniques: Headroom, Looking room, Balance, Depth

### **colorGrading.js**
Color grading y post-procesamiento:
- Styles: Teal & Orange, Vintage, High-Key, Low-Key, Warm, Cool
- Film Stocks: Portra 400, Ektar 100, HP5 Plus
- Post-processing: Contrast, Clarity, Grain

### **emotions.js**
Expresiones y emociones:
- Expressions: Confident, Friendly, Joyful, Seductive, Playful, Serious, etc.
- Gaze Directions: Direct, Away, Distance, Down, Up, Over-shoulder
- Smile Types: Genuine, Subtle, Wide, Closed, Smirk

---

## 🔧 **CÓMO USAR EN GEMINI-PROCESSOR.JS**

### **Importar el Knowledge Base:**

```javascript
// En la parte superior de gemini-processor.js
import { KNOWLEDGE_BASE } from '../knowledge/index.js';

// O importar módulos específicos
import { lighting, lenses, filters } from '../knowledge/index.js';
```

### **Usar en el código:**

```javascript
// Ejemplo 1: Acceder a información de iluminación
const rembrandtInfo = KNOWLEDGE_BASE.lighting.classicSchemes.rembrandt;
console.log(rembrandtInfo.prompt);
// Output: "Rembrandt lighting with triangle of light on cheek..."

// Ejemplo 2: Acceder a lentes
const lens85mm = KNOWLEDGE_BASE.lenses.types["85mm"];
console.log(lens85mm.prompt);
// Output: "85mm f/1.2 lens, shallow depth of field..."

// Ejemplo 3: Construir system prompt con conocimientos
const systemPrompt = `
You are an expert photographer with deep knowledge in:

LIGHTING SCHEMES:
${JSON.stringify(KNOWLEDGE_BASE.lighting.classicSchemes, null, 2)}

LENSES:
${JSON.stringify(KNOWLEDGE_BASE.lenses.types, null, 2)}

Generate a professional prompt using this knowledge...
`;
```

---

## ✅ **VENTAJAS DE ESTA ARQUITECTURA**

### **1. Mantenibilidad**
```javascript
// ANTES: Editar dentro de 1200 líneas del gemini-processor.js
// AHORA: Abrir lighting.js, editar lo que necesites, listo
```

### **2. Escalabilidad**
```javascript
// Agregar nueva categoría: crear /knowledge/newCategory.js
// Agregar al index.js
// Importar en gemini-processor.js
// ¡Listo!
```

### **3. Reutilización**
```javascript
// Usar en otros componentes:
import { lighting } from '../knowledge/index.js';

// En tu componente React:
const lightingOptions = Object.keys(lighting.classicSchemes);
```

### **4. Testing**
```javascript
// Probar conocimientos independientemente:
import { lenses } from '../knowledge/index.js';

test('85mm lens should have correct specs', () => {
  expect(lenses.types["85mm"].type).toBe("Retrato clásico - REY DEL RETRATO");
});
```

---

## 📝 **CÓMO AGREGAR NUEVOS CONOCIMIENTOS**

### **Paso 1: Editar el archivo correspondiente**

Por ejemplo, agregar nuevo esquema de iluminación en `lighting.js`:

```javascript
export const classicSchemes = {
  // ... esquemas existentes
  
  clamshell: {
    name: "Clamshell Lighting",
    description: "Luz desde arriba y reflector debajo, tipo concha",
    mood: "Glamuroso, beauty lighting profesional",
    prompt: "clamshell lighting setup, top key light with bottom reflector",
    use: "Fotografía de belleza, makeup, headshots glamurosos"
  }
};
```

### **Paso 2: Guardar y listo**

No necesitas tocar ningún otro archivo. El `index.js` ya lo exporta, y `gemini-processor.js` ya lo tiene disponible.

---

## 🆕 **CÓMO AGREGAR NUEVA CATEGORÍA**

### **Paso 1: Crear nuevo archivo**

`/knowledge/backgrounds.js`:

```javascript
export const backgrounds = {
  studio: {
    white: "Clean white studio background, high-key, minimalist",
    black: "Black studio background, dramatic, low-key",
    gray: "Neutral gray background, professional, versatile"
  },
  urban: {
    street: "Urban street background, graffiti, city life",
    cafe: "Interior café setting, warm ambient lighting"
  }
};
```

### **Paso 2: Agregar al index.js**

```javascript
import { backgrounds } from './backgrounds.js';

export const KNOWLEDGE_BASE = {
  // ... categorías existentes
  backgrounds
};
```

### **Paso 3: Usar en gemini-processor.js**

```javascript
const backgroundInfo = KNOWLEDGE_BASE.backgrounds.studio.black;
```

---

## 🎯 **SEPARACIÓN DE RESPONSABILIDADES**

```
┌─────────────────────────────────────────────────┐
│           /knowledge/ (CONOCIMIENTOS)           │
│                                                 │
│  ✅ QUÉ información técnica existe              │
│  ✅ Definiciones de conceptos fotográficos     │
│  ✅ Datos estáticos de referencia              │
│  ❌ NO tiene lógica de negocio                 │
│  ❌ NO construye prompts                       │
└─────────────────────────────────────────────────┘
                        ↓
                   [IMPORTA]
                        ↓
┌─────────────────────────────────────────────────┐
│      /api/gemini-processor.js (LÓGICA)          │
│                                                 │
│  ✅ CÓMO usar los conocimientos                │
│  ✅ Lógica de construcción de prompts          │
│  ✅ Reglas de negocio                          │
│  ✅ Manejo de requests/responses               │
│  ❌ NO define conocimientos técnicos           │
└─────────────────────────────────────────────────┘
```

---

## 🚀 **MIGRACIÓN DESDE CÓDIGO MONOLÍTICO**

Si ya tienes un `gemini-processor.js` con todo mezclado:

1. **Extraer conocimientos**: Copia bloques de datos a archivos `/knowledge/`
2. **Crear imports**: Agregar `import { KNOWLEDGE_BASE } from '../knowledge/index.js'`
3. **Reemplazar referencias**: Cambiar objetos inline por `KNOWLEDGE_BASE.categoria.item`
4. **Testing**: Verificar que funciona igual
5. **Mantener**: Ahora es mucho más fácil

---

## 📚 **DOCUMENTACIÓN ADICIONAL**

Cada archivo de conocimiento tiene:
- ✅ Comentarios claros sobre qué contiene
- ✅ Estructura consistente
- ✅ Exports nombrados para acceso específico
- ✅ Export unificado en index.js

---

## ✨ **RESULTADO FINAL**

- 📁 **Organización clara**: Cada cosa en su lugar
- 🔧 **Fácil mantenimiento**: Editar conocimientos sin miedo
- 📈 **Escalable**: Agregar categorías sin problemas
- 🔄 **Reutilizable**: Usar conocimientos en toda la app
- 🧪 **Testeable**: Probar componentes por separado

---

**¡Arquitectura profesional para un producto profesional!** 🎯
