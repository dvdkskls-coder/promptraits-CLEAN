/**
 * Script para CORREGIR automáticamente problemas de encoding
 * Ejecutar: node fix-encoding.cjs
 */

const fs = require('fs');
const path = require('path');

// Archivos a corregir (según el análisis)
const filesToFix = [
  'src/App.jsx',
  'src/components/AIGenerator.jsx',
  'src/components/__tests__/example.test.js',
  'src/test/setup.js'
];

// Mapeo de correcciones (carácter corrupto → carácter correcto)
const corrections = {
  // Vocales con tilde
  'A�ADIR': 'AÑADIR',
  'a�adir': 'añadir',
  'Cinematogr�fico': 'Cinematográfico',
  'cinematogr�fico': 'cinematográfico',
  'C�lido': 'Cálido',
  'c�lido': 'cálido',
  'homog�neo': 'homogéneo',
  'Cl�sico': 'Clásico',
  'cl�sico': 'clásico',
  'cl�sica': 'clásica',
  'Fotograf�a': 'Fotografía',
  'fotograf�a': 'fotografía',
  'Energ�a': 'Energía',
  'energ�a': 'energía',
  'Ensue�o': 'Ensueño',
  'ensue�o': 'ensueño',
  'Nost�lgico': 'Nostálgico',
  'nost�lgico': 'nostálgico',
  'a�os': 'años',
  'Ne�n': 'Neón',
  'ne�n': 'neón',
  '�ntimo': 'Íntimo',
  '�ntimo': 'íntimo',
  'Acci�n': 'Acción',
  'acci�n': 'acción',
  'n�tido': 'nítido',
  'Fantas�a': 'Fantasía',
  'fantas�a': 'fantasía',
  'Et�reo': 'Etéreo',
  'et�reo': 'etéreo',
  'On�rico': 'Onírico',
  'on�rico': 'onírico',
  'dram�tico': 'dramático',
  'dram�tica': 'dramática',
  'Atmosf�rico': 'Atmosférico',
  'atmosf�rico': 'atmosférico',
  'pr�cticas': 'prácticas',
  'cr�ditos': 'créditos',
  'cr�dito': 'crédito',
  'Cr�ditos': 'Créditos',
  'Cr�dito': 'Crédito',
  'CR�DITOS': 'CRÉDITOS',
  'CR�DITO': 'CRÉDITO',
  'especificaci�n': 'especificación',
  'Generaci�n': 'Generación',
  'generaci�n': 'generación',
  'sesi�n': 'sesión',
  'Sesi�n': 'Sesión',
  'SESI�N': 'SESIÓN',
  'suscr�bete': 'suscríbete',
  'recibi�': 'recibió',
  'B�sicos': 'Básicos',
  'b�sicos': 'básicos',
  'b�sico': 'básico',
  'BOT�N': 'BOTÓN',
  'bot�n': 'botón',
  'Bot�n': 'Botón',
  'AN�LISIS': 'ANÁLISIS',
  'an�lisis': 'análisis',
  'An�lisis': 'Análisis',
  'aparecer�': 'aparecerá',
  'pesta�a': 'pestaña',
  'a�n': 'aún',
  '�ltimos': 'últimos',
  '�ltimo': 'último',
  '�xito': 'éxito',
  '�Pago': '¡Pago',
  'P�GINA': 'PÁGINA',
  'p�gina': 'página',
  'm�vil': 'móvil',
  'Galer�a': 'Galería',
  'galer�a': 'galería',
  'GALER�A': 'GALERÍA',
  'colecci�n': 'colección',
  'Gu�a': 'Guía',
  'gu�a': 'guía',
  'qu�': 'qué',
  '�Qu�': '¿Qué',
  'versi�n': 'versión',
  '�pica': 'Épica',
  'drag�n': 'dragón',
  'monta�as': 'montañas',
  'm�gico': 'mágico',
  'luci�rnagas': 'luciérnagas',
  '�rboles': 'árboles',
  'crear�': 'creará',
  'im�genes': 'imágenes',
  'alien�gena': 'alienígena',
  'r�pidos': 'rápidos',
  'art�stico': 'artístico',
  'fotogr�fico': 'fotográfico',
  'Iluminaci�n': 'Iluminación',
  'iluminaci�n': 'iluminación',
  'deber�a': 'debería',
  'despu�s': 'después',
  
  // Signos de interrogación y exclamación
  '�': '¿',
  '�': '¡',
  
  // Ñ
  'a�o': 'año',
  'A�o': 'Año',
  'ni�o': 'niño',
  'espa�ol': 'español',
  'Espa�ol': 'Español',
  'dise�o': 'diseño',
  'Dise�o': 'Diseño',
  'ma�ana': 'mañana',
  'peque�o': 'pequeño',
  'sue�o': 'sueño',
  
  // Otros caracteres comunes
  'men�': 'menú',
  'Men�': 'Menú',
  'per�': 'Perú',
  'Per�': 'Perú',
  'caf�': 'café',
  'Caf�': 'Café',
  'beb�': 'bebé',
  'Beb�': 'Bebé',
  'despu�s': 'después',
  'Despu�s': 'Después',
  'tambi�n': 'también',
  'Tambi�n': 'También',
  'as�': 'así',
  'As�': 'Así',
  'pa�s': 'país',
  'Pa�s': 'País',
  'ra�z': 'raíz',
  'Ra�z': 'Raíz',
  'd�a': 'día',
  'D�a': 'Día',
  'Mar�a': 'María',
  'adi�s': 'adiós',
  'Adi�s': 'Adiós',
  'coraz�n': 'corazón',
  'Coraz�n': 'Corazón',
  'canci�n': 'canción',
  'Canci�n': 'Canción',
  'descripci�n': 'descripción',
  'Descripci�n': 'Descripción',
  'informaci�n': 'información',
  'Informaci�n': 'Información',
  '�nico': 'único',
  '�nico': 'Único',
  'p�blico': 'público',
  'P�blico': 'Público',
  '�ltima': 'última',
  '�ltima': 'Última',
  
  // Casos especiales de comentarios
  '??': '✓',
  '?': '✓',
};

let totalChanges = 0;
let filesFixed = 0;

console.log('\n🔧 INICIANDO CORRECCIÓN DE ENCODING...\n');
console.log('================================================================================\n');

filesToFix.forEach(filePath => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changesInFile = 0;

    // Aplicar todas las correcciones
    Object.entries(corrections).forEach(([wrong, correct]) => {
      const regex = new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = (content.match(regex) || []).length;
      if (matches > 0) {
        content = content.replace(regex, correct);
        changesInFile += matches;
      }
    });

    if (changesInFile > 0) {
      // Guardar archivo corregido
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath}`);
      console.log(`   └─ ${changesInFile} correcciones aplicadas\n`);
      totalChanges += changesInFile;
      filesFixed++;
    } else {
      console.log(`ℹ️  ${filePath} - Sin cambios necesarios\n`);
    }

  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
});

console.log('================================================================================');
console.log('📊 RESUMEN DE CORRECCIONES:');
console.log(`   Archivos procesados: ${filesToFix.length}`);
console.log(`   Archivos corregidos: ${filesFixed}`);
console.log(`   Total de correcciones: ${totalChanges}`);
console.log('================================================================================\n');

if (filesFixed > 0) {
  console.log('✨ ¡Corrección completada exitosamente!');
  console.log('\n📋 PRÓXIMOS PASOS:');
  console.log('   1. Revisa los cambios con: git diff');
  console.log('   2. Haz commit: git add . && git commit -m "fix: corregir encoding UTF-8"');
  console.log('   3. Push a GitHub: git push');
  console.log('   4. Vercel hará deploy automáticamente\n');
} else {
  console.log('ℹ️  No se encontraron problemas que corregir.\n');
}
