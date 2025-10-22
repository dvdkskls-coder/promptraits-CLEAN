/**
 * Script para encontrar problemas de encoding en Promptraits
 * Versión ES Modules
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirsToScan = ["src", "api", "public"];
const extensions = [".jsx", ".js", ".html", ".css", ".json"];

const results = {
  filesWithBadChars: [],
  filesWithGoodChars: [],
  suspiciousFiles: [],
  totalFiles: 0,
};

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    results.totalFiles++;

    const hasBadChars = content.includes("�") || content.includes("\uFFFD");

    const spanishWords = [
      "galería",
      "más",
      "está",
      "descripción",
      "información",
      "año",
      "español",
    ];
    const hasGoodSpanish = spanishWords.some((word) => content.includes(word));

    if (hasBadChars) {
      const lines = content.split("\n");
      const badLines = [];
      lines.forEach((line, index) => {
        if (line.includes("�") || line.includes("\uFFFD")) {
          badLines.push({
            lineNumber: index + 1,
            content: line.trim().substring(0, 100),
          });
        }
      });

      results.filesWithBadChars.push({
        path: filePath,
        lines: badLines,
      });
    }

    if (hasGoodSpanish) {
      results.filesWithGoodChars.push(filePath);
    }
  } catch (error) {
    console.error(`Error: ${filePath}`);
  }
}

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!["node_modules", "dist", ".git", ".vscode"].includes(item)) {
        scanDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (extensions.includes(ext)) {
        analyzeFile(fullPath);
      }
    }
  });
}

console.log("🚀 Analizando archivos...\n");

dirsToScan.forEach((dir) => {
  console.log(`📂 ${dir}/`);
  scanDirectory(dir);
});

console.log("\n" + "=".repeat(80));
console.log("REPORTE DE ENCODING");
console.log("=".repeat(80) + "\n");

console.log(`Archivos analizados: ${results.totalFiles}\n`);

if (results.filesWithBadChars.length > 0) {
  console.log("❌ ARCHIVOS CON PROBLEMAS:\n");
  results.filesWithBadChars.forEach((file) => {
    console.log(`📄 ${file.path}`);
    file.lines.forEach((line) => {
      console.log(`   Línea ${line.lineNumber}: ${line.content}`);
    });
    console.log("");
  });
} else {
  console.log("✅ No hay problemas de encoding\n");
}

if (results.filesWithGoodChars.length > 0) {
  console.log("\n✅ ARCHIVOS CON ESPAÑOL CORRECTO:");
  results.filesWithGoodChars.forEach((file) => {
    console.log(`   ${file}`);
  });
}

console.log("\n" + "=".repeat(80));
console.log(
  `RESUMEN: ${results.filesWithBadChars.length} archivos con problemas`
);
console.log("=".repeat(80) + "\n");

fs.writeFileSync("encoding-report.json", JSON.stringify(results, null, 2));
console.log("💾 Reporte guardado en: encoding-report.json\n");
