const fs = require("fs");

// Leer archivo
const content = fs.readFileSync(
  "C:\\Users\\Samuel\\Downloads\\events.sql",
  "utf8"
);

// Buscar el bloque INSERT
const insertStart = content.indexOf("INSERT INTO `events`");
const insertEnd = content.indexOf(";", insertStart);
const insertBlock = content.substring(insertStart, insertEnd + 1);

// Extraer solo los VALUES
const valuesStart = insertBlock.indexOf("VALUES") + 6;
const valuesSection = insertBlock.substring(valuesStart).trim();

console.log("=== DEBUGGING PARSING ISSUES ===");

// Separar por líneas para procesar fila por fila
const lines = valuesSection.split("\n");
let tested = 0;
let processed = 0;

for (let lineIndex = 0; lineIndex < lines.length && tested < 10; lineIndex++) {
  const line = lines[lineIndex].trim();

  // Buscar líneas que empiecen con (número,
  const lineMatch = line.match(/^\((\d+),/);
  if (!lineMatch) continue;

  const id = lineMatch[1];
  tested++;

  console.log(`\n--- Probando evento ${id} ---`);
  console.log(`Línea: ${line.substring(0, 200)}...`);

  // Buscar las fechas en formato DD-MM-YYYY
  const dateMatches = line.match(/'(\d{2}-\d{2}-\d{4})'/g);
  console.log(
    `Fechas encontradas: ${dateMatches ? dateMatches.join(", ") : "NINGUNA"}`
  );

  if (!dateMatches || dateMatches.length < 2) {
    console.log(`❌ Omitiendo evento ${id} - no se encontraron fechas válidas`);
    continue;
  }

  // Extraer fechas (quitar comillas)
  const startDate = dateMatches[0].replace(/'/g, "");
  const endDate = dateMatches[1].replace(/'/g, "");
  console.log(`Fechas extraídas: ${startDate}, ${endDate}`);

  // Verificar si es 2025+
  const eventYear = parseInt(startDate.split("-")[2]);
  console.log(`Año del evento: ${eventYear}`);

  if (eventYear < 2025) {
    console.log(`❌ Omitiendo evento ${id} - año ${eventYear} (solo 2025+)`);
    continue;
  }

  // Extraer nombre e imagen usando patrones más flexibles
  const nameMatch = line.match(
    /^\(\d+,\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',/
  );
  console.log(`Regex de nombre/imagen: ${nameMatch ? "MATCH" : "NO MATCH"}`);

  if (!nameMatch) {
    console.log(`❌ Omitiendo evento ${id} - no se pudo extraer nombre/imagen`);

    // Intentar otros patrones más simples
    const simpleNameMatch = line.match(/^\(\d+,\s*'([^']+)',\s*'([^']+)',/);
    console.log(`Regex simple: ${simpleNameMatch ? "MATCH" : "NO MATCH"}`);

    if (simpleNameMatch) {
      console.log(`Nombre: ${simpleNameMatch[1]}`);
      console.log(`Imagen: ${simpleNameMatch[2]}`);
    }
    continue;
  }

  const name = nameMatch[1];
  const image = nameMatch[2];

  console.log(`✅ Evento ${id} procesado exitosamente`);
  console.log(`Nombre: ${name}`);
  console.log(`Imagen: ${image}`);
  console.log(`Fechas: ${startDate} - ${endDate}`);

  processed++;
}

console.log(`\n=== RESUMEN ===`);
console.log(`Líneas probadas: ${tested}`);
console.log(`Eventos procesados: ${processed}`);
