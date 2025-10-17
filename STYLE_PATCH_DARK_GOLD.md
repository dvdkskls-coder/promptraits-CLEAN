# Promptraits — Style Patch “Dark + Dorado”
Aplicar este tema a cualquier versión funcional del proyecto (Vite + Tailwind).

## 0) Requisitos
- Proyecto con Tailwind configurado (`tailwind.config.js`, `index.css` con `@tailwind base; @tailwind components; @tailwind utilities;`).
- No elimina lógica ni endpoints; SOLO cambia aspecto: colores, tipografías y espaciamiento.

---

## 1) Tipografías
**Archivo:** `public/index.html` (dentro de `<head>`).  
Eliminar `<link>` de fuentes previas y añadir:

```html
<link href="https://fonts.googleapis.com/css2?family=Saira+Extra+Condensed:wght@600&family=Montserrat:wght@300;600&display=swap" rel="stylesheet">
