const fs = require("fs");

// Leer archivo
const content = fs.readFileSync(
  "C:\\Users\\Samuel\\Downloads\\events.sql",
  "utf8"
);

console.log("=== INVESTIGANDO POR QUÉ SOLO SE PROCESA 1 EVENTO ===");

// Buscar el bloque INSERT
const insertStart = content.indexOf("INSERT INTO `events`");
const insertEnd = content.indexOf(";", insertStart);
const insertBlock = content.substring(insertStart, insertEnd + 1);

// Extraer solo los VALUES
const valuesStart = insertBlock.indexOf("VALUES") + 6;
const valuesSection = insertBlock.substring(valuesStart).trim();

// Separar por líneas
const lines = valuesSection.split("\n");
console.log(`Total líneas después de split: ${lines.length}`);

let found2025Events = 0;
let processedEvents = 0;

// Buscar específicamente algunos eventos que sabemos que existen
const targetEvents = [454, 455, 456, 457, 458, 459, 460]; // De la lista del debug

for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
  const line = lines[lineIndex].trim();

  // Buscar líneas que empiecen con (número,
  const lineMatch = line.match(/^\((\d+),/);
  if (!lineMatch) continue;

  const id = parseInt(lineMatch[1]);

  // Buscar fechas 2025+ en esta línea
  const has2025Dates =
    line.includes("-2025") || line.includes("-2026") || line.includes("-2027");

  if (has2025Dates) {
    found2025Events++;
    console.log(`\n📅 Evento ${id} contiene fechas 2025+`);

    // Verificar regex de fechas
    const dateMatches = line.match(/'(\d{2}-\d{2}-\d{4})'/g);
    console.log(
      `  Fechas regex: ${dateMatches ? dateMatches.join(", ") : "NO MATCH"}`
    );

    if (dateMatches && dateMatches.length >= 2) {
      const startDate = dateMatches[0].replace(/'/g, "");
      const eventYear = parseInt(startDate.split("-")[2]);
      console.log(`  Año extraído: ${eventYear}`);

      if (eventYear >= 2025) {
        // Verificar regex de nombre/imagen
        const nameMatch = line.match(
          /^\(\d+,\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',/
        );
        console.log(
          `  Nombre/imagen regex: ${nameMatch ? "MATCH" : "NO MATCH"}`
        );

        if (nameMatch) {
          processedEvents++;
          console.log(`  ✅ PROCESADO: ${nameMatch[1]}`);
        } else {
          console.log(`  ❌ Falló extracción nombre/imagen`);
          // Mostrar el inicio de la línea para debug
          console.log(`  Inicio línea: ${line.substring(0, 100)}`);
        }
      }
    }
  }

  // Solo mostrar algunos eventos específicos para debug
  if (targetEvents.includes(id)) {
    console.log(`\n🎯 Evento objetivo ${id}:`);
    console.log(`  Línea: ${line.substring(0, 150)}...`);
    console.log(`  Contiene 2025+: ${has2025Dates}`);
  }
}

console.log(`\n=== RESUMEN ===`);
console.log(`Eventos con fechas 2025+ encontrados: ${found2025Events}`);
console.log(`Eventos procesados exitosamente: ${processedEvents}`);

// Verificar si hay problema con el split
console.log(`\n=== ANÁLISIS DE SPLIT ===`);
const firstFewLines = lines.slice(0, 10);
firstFewLines.forEach((line, i) => {
  const match = line.match(/^\((\d+),/);
  console.log(
    `Línea ${i}: ${match ? `ID ${match[1]}` : "NO MATCH"} - ${line.substring(
      0,
      50
    )}`
  );
});
