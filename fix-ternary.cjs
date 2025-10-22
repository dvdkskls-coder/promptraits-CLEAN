/**
 * Script para corregir operadores ternarios (?) mal codificados
 * Ejecutar: node fix-ternary.cjs
 */

const fs = require('fs');

console.log('\n🔧 Corrigiendo operadores ternarios...\n');

try {
  let content = fs.readFileSync('src/App.jsx', 'utf8');
  let changes = 0;

  // Contar cuántos hay antes
  const ternaryBefore = (content.match(/\s✓\s/g) || []).length;
  console.log(`📊 Operadores ternarios corruptos encontrados: ${ternaryBefore}\n`);

  // Reemplazar ✓ que están rodeados de espacios (operador ternario)
  // IMPORTANTE: Esto NO debe afectar a los ✓. ya corregidos
  const beforeReplace = content;
  
  // Patrón: espacio + ✓ + espacio = operador ternario
  content = content.replace(/(\s)✓(\s)/g, '$1?$2');
  
  // Contar cambios
  const ternaryAfter = (content.match(/\s✓\s/g) || []).length;
  changes = ternaryBefore - ternaryAfter;

  if (changes > 0) {
    fs.writeFileSync('src/App.jsx', content, 'utf8');
    console.log(`✅ src/App.jsx corregido`);
    console.log(`   └─ ${changes} operadores ternarios arreglados\n`);
    
    // Mostrar las líneas afectadas (aproximado)
    console.log('📝 Cambios aplicados en estas líneas:\n');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('referenceImage ? referenceImage.type') ||
          line.includes('selectedPreset ? PRESETS') ||
          line.includes('selectedScenario ? SCENARIOS')) {
        console.log(`   Línea ${index + 1}: ${line.trim().substring(0, 80)}...`);
      }
    });
    console.log('');
  } else {
    console.log('ℹ️  No se encontraron operadores ternarios corruptos\n');
  }

  console.log('================================================================================');
  console.log('✨ ¡Corrección completada!');
  console.log('================================================================================\n');
  console.log('📋 PRÓXIMOS PASOS:\n');
  console.log('1. Verifica los cambios:');
  console.log('   git diff src/App.jsx\n');
  console.log('2. Haz commit y push:');
  console.log('   git add src/App.jsx');
  console.log('   git commit -m "fix: corregir operadores ternarios"');
  console.log('   git push\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
