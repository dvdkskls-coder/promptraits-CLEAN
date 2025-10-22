/**
 * Script de diagnóstico - Encuentra TODOS los ✓ problemáticos
 * Ejecutar: node diagnose-checkmarks.cjs
 */

const fs = require('fs');

console.log('\n🔍 DIAGNÓSTICO DE CHECKMARKS...\n');
console.log('='.repeat(80));

try {
  const content = fs.readFileSync('src/App.jsx', 'utf8');
  const lines = content.split('\n');
  
  let totalCheckmarks = 0;
  let inComment = 0;
  let inCode = 0;
  const problems = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    
    // Buscar todos los ✓
    const checkmarks = line.match(/✓/g);
    if (!checkmarks) return;
    
    totalCheckmarks += checkmarks.length;
    
    // Determinar si está en comentario o código
    const isComment = trimmed.startsWith('//') || 
                      trimmed.startsWith('/*') || 
                      trimmed.startsWith('*');
    
    if (isComment) {
      inComment += checkmarks.length;
      console.log(`✅ Línea ${lineNumber} (COMENTARIO - OK):`);
      console.log(`   ${trimmed.substring(0, 100)}`);
      console.log('');
    } else {
      inCode += checkmarks.length;
      
      // Analizar el contexto del checkmark
      const contexts = [];
      let pos = 0;
      while ((pos = line.indexOf('✓', pos)) !== -1) {
        const before = line.substring(Math.max(0, pos - 10), pos);
        const after = line.substring(pos + 1, Math.min(line.length, pos + 11));
        contexts.push({ before, after, pos });
        pos++;
      }
      
      problems.push({ lineNumber, line: trimmed, contexts });
      
      console.log(`❌ Línea ${lineNumber} (EN CÓDIGO - PROBLEMA):`);
      console.log(`   ${trimmed.substring(0, 120)}`);
      contexts.forEach(ctx => {
        console.log(`   Contexto: "${ctx.before}✓${ctx.after}"`);
      });
      console.log('');
    }
  });

  console.log('='.repeat(80));
  console.log('📊 RESUMEN:');
  console.log(`   Total de checkmarks: ${totalCheckmarks}`);
  console.log(`   En comentarios (OK): ${inComment}`);
  console.log(`   En código (PROBLEMAS): ${inCode}`);
  console.log('='.repeat(80));

  if (inCode > 0) {
    console.log('\n🔧 PATRONES DETECTADOS:\n');
    
    const patterns = {
      optionalChaining: 0,  // ✓.
      ternary: 0,           // espacio✓espacio
      other: 0
    };

    problems.forEach(({ contexts }) => {
      contexts.forEach(({ before, after }) => {
        if (after.startsWith('.')) {
          patterns.optionalChaining++;
        } else if (before.endsWith(' ') && after.startsWith(' ')) {
          patterns.ternary++;
        } else {
          patterns.other++;
        }
      });
    });

    console.log(`   Optional chaining (✓.): ${patterns.optionalChaining}`);
    console.log(`   Operador ternario ( ✓ ): ${patterns.ternary}`);
    console.log(`   Otros patrones: ${patterns.other}`);
    console.log('');
  }

  // Guardar reporte detallado
  const report = {
    total: totalCheckmarks,
    inComment,
    inCode,
    problems
  };
  
  fs.writeFileSync('checkmark-report.json', JSON.stringify(report, null, 2), 'utf8');
  console.log('💾 Reporte detallado guardado en: checkmark-report.json\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
