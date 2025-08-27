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

let sql = `-- Migración básica de eventos
DELETE FROM events WHERE id > 0;

`;

let eventCount = 0;

// Usar regex para encontrar cada fila de datos
const rowPattern =
  /\((\d+),\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',/g;

let match;
while ((match = rowPattern.exec(valuesSection)) !== null) {
  const [, id, name, image, startDate, endDate] = match;

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

  // Limpiar nombre
  const cleanName = name.replace(/'/g, "''").substring(0, 100);
  const cleanImage = image.replace(/'/g, "''");
  const slug = `evento-${id}`;

  sql += `INSERT INTO events (id, name, image, start_date, end_date, start_time, end_time, color, location, description, state, region, tipo, website, slugevento, status, idioma, user_id, created_at, updated_at) VALUES (${id}, '${cleanName}', '${cleanImage}', '${convertedStartDate}', '${convertedEndDate}', '', '', '', '', '', '', '', '', '', '${slug}', 'PUBLISHED', 1, 1, NOW(), NOW()) ON CONFLICT (slugevento) DO NOTHING;
`;

  eventCount++;

  if (eventCount >= 200) break; // Limitar a 200 para evitar problemas
}

sql += `
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));
`;

fs.writeFileSync("./events-final.sql", sql);
console.log(`✅ Archivo creado: events-final.sql`);
console.log(`📊 Eventos procesados: ${eventCount}`);
