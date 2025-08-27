const fs = require("fs");

// Leer archivo
const content = fs.readFileSync(
  "C:\\Users\\Samuel\\Downloads\\events.sql",
  "utf8"
);

console.log("=== DEBUGGING MIGRATION ===");

// Buscar todas las líneas que contienen fechas de 2025 o superior
const lines = content.split("\n");
let eventsFound = 0;
let events2025Plus = 0;

lines.forEach((line, index) => {
  if (line.includes("INSERT INTO") || line.trim().startsWith("(")) {
    // Buscar fechas que contengan 2025, 2026, etc.
    const dateMatches = line.match(
      /'(\d{1,2}-\d{1,2}-202[5-9]|202[5-9]-\d{1,2}-\d{1,2})'/g
    );
    if (dateMatches) {
      console.log(`Línea ${index}: ${line.substring(0, 100)}...`);
      console.log(`  Fechas encontradas: ${dateMatches.join(", ")}`);
      events2025Plus++;
    }

    // También buscar patrón general de eventos
    if (line.includes("VALUES") || line.trim().startsWith("(")) {
      eventsFound++;
    }
  }
});

console.log(`\n=== RESUMEN ===`);
console.log(`Total de líneas con eventos: ${eventsFound}`);
console.log(`Eventos con fechas 2025+: ${events2025Plus}`);

// Buscar específicamente el bloque INSERT
const insertMatch = content.match(
  /INSERT INTO `events`.*?VALUES\s*([\s\S]*?);/
);
if (insertMatch) {
  console.log("\n=== BLOQUE INSERT ENCONTRADO ===");
  const valuesSection = insertMatch[1];
  console.log(`Longitud del bloque VALUES: ${valuesSection.length} caracteres`);

  // Mostrar primeras líneas del bloque VALUES
  const firstLines = valuesSection.split("\n").slice(0, 5);
  console.log("\nPrimeras 5 líneas del bloque VALUES:");
  firstLines.forEach((line, i) => {
    console.log(`${i + 1}: ${line.substring(0, 100)}...`);
  });
} else {
  console.log("\n❌ NO SE ENCONTRÓ EL BLOQUE INSERT");
}

// Buscar fechas 2025+ en todo el archivo
const allDates2025 = content.match(/'[0-3]?\d-[01]?\d-202[5-9]'/g) || [];
const allDates2025Reverse = content.match(/'202[5-9]-[01]?\d-[0-3]?\d'/g) || [];

console.log(`\nFechas formato DD-MM-2025+: ${allDates2025.length}`);
console.log(`Fechas formato YYYY-MM-DD 2025+: ${allDates2025Reverse.length}`);

if (allDates2025.length > 0) {
  console.log("Ejemplos DD-MM-2025+:", allDates2025.slice(0, 5));
}
if (allDates2025Reverse.length > 0) {
  console.log("Ejemplos YYYY-MM-DD 2025+:", allDates2025Reverse.slice(0, 5));
}
