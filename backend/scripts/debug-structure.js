const fs = require("fs");

// Leer archivo
const content = fs.readFileSync(
  "C:\\Users\\Samuel\\Downloads\\events.sql",
  "utf8"
);

console.log("=== ANÁLISIS DE ESTRUCTURA DEL ARCHIVO ===");

// Buscar el bloque INSERT
const insertStart = content.indexOf("INSERT INTO `events`");
const insertEnd = content.indexOf(";", insertStart);
const insertBlock = content.substring(insertStart, insertEnd + 1);

console.log(`Tamaño total del bloque INSERT: ${insertBlock.length} caracteres`);

// Extraer solo los VALUES
const valuesStart = insertBlock.indexOf("VALUES") + 6;
const valuesSection = insertBlock.substring(valuesStart).trim();

console.log(`Tamaño de la sección VALUES: ${valuesSection.length} caracteres`);

// Contar eventos usando regex directamente en toda la sección
const eventMatches = valuesSection.match(/\((\d+),/g);
console.log(
  `Total de eventos encontrados con regex: ${
    eventMatches ? eventMatches.length : 0
  }`
);

// Contar eventos 2025+ directamente
const events2025 = valuesSection.match(/\((\d+),[^)]*-202[5-9]/g);
console.log(
  `Eventos con fechas 2025+ encontrados: ${events2025 ? events2025.length : 0}`
);

if (events2025) {
  console.log("Primeros 10 eventos 2025+:");
  events2025.slice(0, 10).forEach((match, i) => {
    const id = match.match(/\((\d+),/)[1];
    console.log(`  ${i + 1}. Evento ${id}`);
  });
}

// Analizar por qué el split por líneas no funciona
const lines = valuesSection.split("\n");
console.log(`\nLíneas después de split por \\n: ${lines.length}`);

// Intentar otros separadores
const commaLines = valuesSection.split("),");
console.log(`Líneas después de split por '),': ${commaLines.length}`);

// Mostrar estructura de algunos eventos 2025+
console.log("\n=== ESTRUCTURA DE EVENTOS 2025+ ===");
const match454 = valuesSection.match(/\(454,[^)]+\)/);
if (match454) {
  console.log("Evento 454:", match454[0].substring(0, 200) + "...");
}

const match455 = valuesSection.match(/\(455,[^)]+\)/);
if (match455) {
  console.log("Evento 455:", match455[0].substring(0, 200) + "...");
}
