/**
 * Script de corrección final de encoding
 * Ejecutar: node fix-remaining.cjs
 */

const fs = require('fs');

console.log('\n🔧 Aplicando correcciones finales...\n');

// CORRECCIÓN 1: src/App.jsx
try {
  let content = fs.readFileSync('src/App.jsx', 'utf8');
  let changes = 0;

  // Reemplazos específicos
  const replacements = [
    // Línea 75
    { from: /seg¡n tu especificaci�n/g, to: 'según tu especificación' },
    { from: /seg¡n/g, to: 'según' },
    
    // Línea 102
    { from: /Asesor¡a/g, to: 'Asesoría' },
    
    // Símbolos raros (checkmarks convertidos mal)
    { from: /window\.App_showToast✓\./g, to: 'window.App_showToast?.' },
    { from: /profile✓\./g, to: 'profile?.' },
    { from: /\?✓/g, to: '??' },
    
    // Símbolo de exclamación con espacio
    { from: /¡\s+\{/g, to: '© {' },
    
    // Otros caracteres corruptos generales
    { from: /�/g, to: '' }, // Eliminar caracteres de reemplazo Unicode
  ];

  replacements.forEach(({ from, to }) => {
    const matches = (content.match(from) || []).length;
    if (matches > 0) {
      content = content.replace(from, to);
      changes += matches;
      console.log(`   ✓ ${matches}x: ${from} → ${to}`);
    }
  });

  if (changes > 0) {
    fs.writeFileSync('src/App.jsx', content, 'utf8');
    console.log(`\n✅ src/App.jsx - ${changes} correcciones aplicadas\n`);
  } else {
    console.log('ℹ️  src/App.jsx - Sin cambios necesarios\n');
  }
} catch (error) {
  console.error('❌ Error en src/App.jsx:', error.message);
}

// CORRECCIÓN 2: src/components/AIGenerator.jsx
try {
  let content = fs.readFileSync('src/components/AIGenerator.jsx', 'utf8');
  let changes = 0;

  const replacements = [
    { from: /qu� quieres generar/g, to: 'qué quieres generar' },
    { from: /sesi�n/g, to: 'sesión' },
    { from: /cr�ditos/g, to: 'créditos' },
    { from: /cr�dito/g, to: 'crédito' },
    { from: /Cr�ditos/g, to: 'Créditos' },
    { from: /versi�n/g, to: 'versión' },
    { from: /Fantas�a/g, to: 'Fantasía' },
    { from: /�pica/g, to: 'Épica' },
    { from: /drag�n/g, to: 'dragón' },
    { from: /monta�as/g, to: 'montañas' },
    { from: /m�gico/g, to: 'mágico' },
    { from: /luci�rnagas/g, to: 'luciérnagas' },
    { from: /�rboles/g, to: 'árboles' },
    { from: /crear�/g, to: 'creará' },
    { from: /im�genes/g, to: 'imágenes' },
    { from: /r�pidos/g, to: 'rápidos' },
    { from: /art�stico/g, to: 'artístico' },
    { from: /alien�gena/g, to: 'alienígena' },
    { from: /fotogr�fico/g, to: 'fotográfico' },
    { from: /Iluminaci�n/g, to: 'Iluminación' },
    { from: /�Qu�/g, to: '¿Qué' },
    { from: /Generaci�n/g, to: 'Generación' },
    { from: /generaci�n/g, to: 'generación' },
  ];

  replacements.forEach(({ from, to }) => {
    const matches = (content.match(from) || []).length;
    if (matches > 0) {
      content = content.replace(from, to);
      changes += matches;
    }
  });

  if (changes > 0) {
    fs.writeFileSync('src/components/AIGenerator.jsx', content, 'utf8');
    console.log(`✅ src/components/AIGenerator.jsx - ${changes} correcciones\n`);
  }
} catch (error) {
  console.error('❌ Error en AIGenerator.jsx:', error.message);
}

// CORRECCIÓN 3: Tests
try {
  let content = fs.readFileSync('src/components/__tests__/example.test.js', 'utf8');
  content = content.replace(/b�sico/g, 'básico');
  content = content.replace(/deber�a/g, 'debería');
  fs.writeFileSync('src/components/__tests__/example.test.js', content, 'utf8');
  console.log('✅ example.test.js - Corregido\n');
} catch (error) {
  console.error('⚠️  example.test.js no encontrado o sin cambios');
}

try {
  let content = fs.readFileSync('src/test/setup.js', 'utf8');
  content = content.replace(/despu�s/g, 'después');
  fs.writeFileSync('src/test/setup.js', content, 'utf8');
  console.log('✅ setup.js - Corregido\n');
} catch (error) {
  console.error('⚠️  setup.js no encontrado o sin cambios');
}

console.log('================================================================================');
console.log('✨ ¡Corrección final completada!');
console.log('================================================================================\n');
console.log('📋 PRÓXIMOS PASOS:\n');
console.log('1. Verifica los cambios:');
console.log('   git diff\n');
console.log('2. Si todo se ve bien, haz commit:');
console.log('   git add .');
console.log('   git commit -m "fix: corrección final de encoding UTF-8"');
console.log('   git push\n');
console.log('3. Vercel desplegará automáticamente 🚀\n');
