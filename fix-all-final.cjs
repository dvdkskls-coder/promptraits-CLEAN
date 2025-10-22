/**
 * Script DEFINITIVO de corrección de encoding
 * Ejecutar: node fix-all-final.cjs
 */

const fs = require('fs');

console.log('\n🔧 Aplicando correcciones finales definitivas...\n');

try {
  let content = fs.readFileSync('src/App.jsx', 'utf8');
  const originalContent = content;
  let totalChanges = 0;

  // 1. RESTAURAR comentarios (revertir cambios incorrectos en comentarios)
  console.log('1️⃣ Restaurando comentarios...');
  const commentFixes = [
    { wrong: '// ? AÑADIR ESTOS IMPORTS', correct: '// ✓ AÑADIR ESTOS IMPORTS' },
  ];
  
  commentFixes.forEach(({ wrong, correct }) => {
    if (content.includes(wrong)) {
      content = content.replace(wrong, correct);
      console.log(`   ✓ Restaurado: ${correct}`);
      totalChanges++;
    }
  });

  // 2. CORREGIR operadores ternarios (pero solo en código, no en comentarios)
  console.log('\n2️⃣ Corrigiendo operadores ternarios...');
  
  // Dividir por líneas para procesamiento selectivo
  const lines = content.split('\n');
  const fixedLines = lines.map((line, index) => {
    // Si es un comentario, no tocar
    if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      return line;
    }
    
    // Si contiene operador ternario corrupto (espacio antes y después)
    if (/\s✓\s/.test(line)) {
      const before = line;
      line = line.replace(/(\s)✓(\s)/g, '$1?$2');
      if (before !== line) {
        console.log(`   ✓ Línea ${index + 1}: operador ternario`);
        totalChanges++;
      }
    }
    
    return line;
  });
  
  content = fixedLines.join('\n');

  // 3. CORREGIR optional chaining que quedó pendiente (✓.)
  console.log('\n3️⃣ Corrigiendo optional chaining pendiente...');
  
  const optionalChainingMatches = (content.match(/\)✓\./g) || []).length;
  if (optionalChainingMatches > 0) {
    content = content.replace(/\)✓\./g, ')?.');
    console.log(`   ✓ ${optionalChainingMatches} casos corregidos`);
    totalChanges += optionalChainingMatches;
  }

  // 4. Verificar si hubo cambios
  if (content !== originalContent) {
    fs.writeFileSync('src/App.jsx', content, 'utf8');
    console.log('\n✅ src/App.jsx actualizado correctamente');
    console.log(`   Total de correcciones: ${totalChanges}`);
  } else {
    console.log('\nℹ️  No se requieren cambios adicionales');
  }

  console.log('\n' + '='.repeat(80));
  console.log('✨ CORRECCIÓN DEFINITIVA COMPLETADA');
  console.log('='.repeat(80));
  
  // Verificación final
  console.log('\n🔍 Verificación final:');
  const remainingIssues = (content.match(/✓/g) || []).length;
  const commentCheckmarks = (content.match(/\/\/.*✓/g) || []).length;
  
  console.log(`   Checkmarks totales: ${remainingIssues}`);
  console.log(`   En comentarios (OK): ${commentCheckmarks}`);
  console.log(`   En código (PROBLEMAS): ${remainingIssues - commentCheckmarks}`);
  
  if (remainingIssues - commentCheckmarks === 0) {
    console.log('\n✅ ¡TODO CORRECTO! El archivo está listo.\n');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('   git add src/App.jsx');
    console.log('   git commit -m "fix: corrección definitiva de encoding"');
    console.log('   git push\n');
  } else {
    console.log('\n⚠️  Aún quedan problemas. Revisa manualmente.\n');
  }

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
