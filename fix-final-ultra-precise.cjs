/**
 * Script ULTRA PRECISO - Solo corrige los 2 problemas reales
 * Ejecutar: node fix-final-ultra-precise.cjs
 */

const fs = require('fs');

console.log('\n🎯 Aplicando correcciones ultra precisas...\n');

try {
  let content = fs.readFileSync('src/App.jsx', 'utf8');
  const originalContent = content;
  let changes = 0;

  // CORRECCIÓN 1: Línea 216 - Optional chaining
  // suggestions✓.length → suggestions?.length
  console.log('1️⃣ Corrigiendo optional chaining en línea 216...');
  const before1 = content;
  content = content.replace(
    /qualityAnalysis\.suggestions✓\.length/g,
    'qualityAnalysis.suggestions?.length'
  );
  if (content !== before1) {
    console.log('   ✓ suggestions✓.length → suggestions?.length');
    changes++;
  }

  // CORRECCIÓN 2: Línea 923 - URL query parameter
  // 400x500✓text=No → 400x500?text=No
  console.log('\n2️⃣ Corrigiendo URL query parameter en línea 923...');
  const before2 = content;
  content = content.replace(
    /400x500✓text=/g,
    '400x500?text='
  );
  if (content !== before2) {
    console.log('   ✓ 400x500✓text= → 400x500?text=');
    changes++;
  }

  // Guardar archivo si hubo cambios
  if (content !== originalContent) {
    fs.writeFileSync('src/App.jsx', content, 'utf8');
    console.log('\n✅ Archivo actualizado correctamente');
    console.log(`   Total de correcciones: ${changes}`);
  } else {
    console.log('\nℹ️  No se encontraron problemas que corregir');
  }

  // Verificación final
  console.log('\n' + '='.repeat(80));
  console.log('🔍 VERIFICACIÓN FINAL');
  console.log('='.repeat(80) + '\n');

  const lines = content.split('\n');
  let problemsFound = 0;

  // Buscar checkmarks problemáticos (fuera de strings)
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    
    // Ignorar comentarios
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) return;
    
    // Ignorar strings (console.log, etc)
    if (/console\.(log|error)\(['"]✓/.test(line)) return;
    
    // Buscar checkmarks problemáticos
    if (line.includes('✓')) {
      // Verificar si está fuera de strings
      const withoutStrings = line.replace(/(["'`]).*?\1/g, ''); // Eliminar contenido de strings
      if (withoutStrings.includes('✓')) {
        console.log(`⚠️  Línea ${lineNumber}: ${trimmed.substring(0, 80)}`);
        problemsFound++;
      }
    }
  });

  if (problemsFound === 0) {
    console.log('✅ ¡PERFECTO! No quedan problemas de encoding.');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('   git diff src/App.jsx');
    console.log('   git add src/App.jsx');
    console.log('   git commit -m "fix: corrección final encoding - optional chaining y URL"');
    console.log('   git push');
    console.log('');
  } else {
    console.log(`\n⚠️  Se encontraron ${problemsFound} problemas adicionales.`);
    console.log('    Por favor revisa el reporte arriba.\n');
  }

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
