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

console.log("Bloque INSERT encontrado");

// Extraer solo los VALUES
const valuesStart = insertBlock.indexOf("VALUES") + 6;
const valuesSection = insertBlock.substring(valuesStart).trim();

let sql = `-- Migración de eventos 2025+
DELETE FROM events WHERE id > 0;

`;

let eventCount = 0;

// Separar por líneas para procesar fila por fila
const lines = valuesSection.split("\n");

for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
  const line = lines[lineIndex].trim();

  // Buscar líneas que empiecen con (número,
  const lineMatch = line.match(/^\((\d+),/);
  if (!lineMatch) continue;

  const id = lineMatch[1];

  // Buscar las fechas en formato DD-MM-YYYY
  const dateMatches = line.match(/'(\d{2}-\d{2}-\d{4})'/g);
  if (!dateMatches || dateMatches.length < 2) {
    continue; // Omitir sin mensaje (mayoría son eventos antiguos)
  }

  // Extraer fechas (quitar comillas)
  const startDate = dateMatches[0].replace(/'/g, "");
  const endDate = dateMatches[1].replace(/'/g, "");

  // Verificar si es 2025+ antes de procesar más
  const eventYear = parseInt(startDate.split("-")[2]);
  if (eventYear < 2025) {
    continue; // Omitir sin mensaje (mayoría son eventos antiguos)
  }

  // Extraer nombre e imagen usando patrones más flexibles
  const nameMatch = line.match(
    /^\(\d+,\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',/
  );
  if (!nameMatch) {
    console.log(
      `Omitiendo evento ${id} (${eventYear}) - no se pudo extraer nombre/imagen`
    );
    continue;
  }

  const name = nameMatch[1];
  const image = nameMatch[2];

  console.log(`✅ Procesando evento ${id}: ${name} (${startDate})`);

  // Validar fecha
  if (!startDate || startDate === "" || startDate.includes("00-00")) {
    console.log(`Omitiendo evento ${id} - fecha inválida`);
    continue;
  }

  // Convertir fecha DD-MM-YYYY a YYYY-MM-DD
  let convertedStartDate = startDate;
  if (startDate.includes("-") && startDate.length === 10) {
    const parts = startDate.split("-");
    if (parts[0].length <= 2) {
      convertedStartDate = `${parts[2]}-${parts[1].padStart(
        2,
        "0"
      )}-${parts[0].padStart(2, "0")}`;
    }
  }

  let convertedEndDate = endDate;
  if (endDate && endDate.includes("-") && endDate.length === 10) {
    const parts = endDate.split("-");
    if (parts[0].length <= 2) {
      convertedEndDate = `${parts[2]}-${parts[1].padStart(
        2,
        "0"
      )}-${parts[0].padStart(2, "0")}`;
    }
  }

  // Limpiar nombre e imagen para SQL
  const cleanName = name.replace(/'/g, "''").substring(0, 100);
  const cleanImage = image.replace(/'/g, "''");
  const slug = `evento-${id}`;

  sql += `INSERT INTO events (id, name, image, start_date, end_date, start_time, end_time, color, location, description, state, region, tipo, website, slugevento, status, idioma, user_id, created_at, updated_at) VALUES (${id}, '${cleanName}', '${cleanImage}', '${convertedStartDate}', '${convertedEndDate}', '', '', '', '', '', '', '', '', '', '${slug}', 'PUBLISHED', 1, 1, NOW(), NOW()) ON CONFLICT (slugevento) DO NOTHING;
`;

  eventCount++;
}

sql += `
-- Actualizar secuencia
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));
`;

fs.writeFileSync("./events-final.sql", sql);
console.log(`✅ Archivo creado: events-final.sql`);
console.log(`📊 Eventos 2025+ procesados: ${eventCount}`);
