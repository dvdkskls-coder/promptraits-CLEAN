/**
 * Script GLOBAL - Corrige TODOS los archivos del proyecto
 * Ejecutar: node fix-all-files.cjs
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔧 CORRECCIÓN GLOBAL DE TODOS LOS ARCHIVOS\n');
console.log('='.repeat(80) + '\n');

// Archivos a procesar (según el análisis inicial)
const filesToFix = [
  'src/App.jsx',
  'src/components/AIGenerator.jsx',
  'src/components/__tests__/example.test.js',
  'src/test/setup.js'
];

let totalFiles = 0;
let totalChanges = 0;

filesToFix.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileChanges = 0;

    console.log(`📄 Procesando: ${filePath}`);

    // PATRÓN 1: Optional chaining (✓.)
    const optionalBefore = (content.match(/✓\./g) || []).length;
    content = content.replace(/✓\./g, '?.');
    const optionalFixed = optionalBefore - (content.match(/✓\./g) || []).length;
    if (optionalFixed > 0) {
      console.log(`   ✓ ${optionalFixed}x optional chaining (✓. → ?.)`);
      fileChanges += optionalFixed;
    }

    // PATRÓN 2: Operadores ternarios (solo fuera de comentarios y strings)
    const lines = content.split('\n');
    const fixedLines = lines.map(line => {
      // Ignorar comentarios
      if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
        return line;
      }
      
      // Ignorar strings de console.log
      if (/console\.(log|error)\(['"]✓/.test(line)) {
        return line;
      }
      
      // Reemplazar operadores ternarios (espacio antes y después)
      const before = line;
      line = line.replace(/(\s)✓(\s)/g, '$1?$2');
      if (before !== line) {
        fileChanges++;
      }
      
      return line;
    });
    content = fixedLines.join('\n');

    // PATRÓN 3: URLs (✓text= en URLs)
    const urlBefore = (content.match(/✓text=/g) || []).length;
    content = content.replace(/✓text=/g, '?text=');
    const urlFixed = urlBefore - (content.match(/✓text=/g) || []).length;
    if (urlFixed > 0) {
      console.log(`   ✓ ${urlFixed}x URL query parameters (✓text= → ?text=)`);
      fileChanges += urlFixed;
    }

    // Guardar si hubo cambios
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✅ ${fileChanges} correcciones aplicadas\n`);
      totalFiles++;
      totalChanges += fileChanges;
    } else {
      console.log(`   ℹ️  Sin cambios necesarios\n`);
    }

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
  }
});

console.log('='.repeat(80));
console.log('📊 RESUMEN GLOBAL:');
console.log(`   Archivos procesados: ${filesToFix.length}`);
console.log(`   Archivos modificados: ${totalFiles}`);
console.log(`   Total de correcciones: ${totalChanges}`);
console.log('='.repeat(80) + '\n');

if (totalFiles > 0) {
  console.log('✅ Corrección completada exitosamente!\n');
  console.log('📋 PRÓXIMOS PASOS:\n');
  console.log('1. Verifica los cambios:');
  console.log('   git diff\n');
  console.log('2. Si todo se ve bien:');
  console.log('   git add .');
  console.log('   git commit -m "fix: corrección global de encoding en todos los archivos"');
  console.log('   git push\n');
} else {
  console.log('ℹ️  No se requirieron cambios.\n');
}
