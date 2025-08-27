const fs = require("fs");

// Leer archivo
const content = fs.readFileSync(
  "C:\\Users\\Samuel\\Downloads\\events.sql",
  "utf8"
);

console.log("=== MIGRACIÓN COMPLETA - TODOS LOS INSERT STATEMENTS ===");

let sql = `-- Migración completa de eventos 2025+
DELETE FROM events WHERE id > 0;

`;

let totalEventCount = 0;
let processedEventCount = 0;

// Buscar TODOS los bloques INSERT
const insertRegex = /INSERT INTO `events`[^;]+;/g;
let match;
let insertIndex = 1;

while ((match = insertRegex.exec(content)) !== null) {
  const insertBlock = match[0];
  console.log(`\n📦 Procesando INSERT statement ${insertIndex}...`);

  // Extraer solo los VALUES de este bloque
  const valuesStart = insertBlock.indexOf("VALUES") + 6;
  const valuesSection = insertBlock
    .substring(valuesStart, insertBlock.length - 1)
    .trim(); // -1 para quitar el ;

  // Usar regex para encontrar todas las filas en este bloque
  const rowRegex = /\(([^)]+)\)(?=\s*,\s*\(|\s*$)/g;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(valuesSection)) !== null) {
    const rowData = rowMatch[1];
    totalEventCount++;

    // Dividir los valores por comas (respetando comillas)
    const values = [];
    let current = "";
    let inQuotes = false;
    let i = 0;

    while (i < rowData.length) {
      const char = rowData[i];

      if (char === "'" && (i === 0 || rowData[i - 1] !== "\\")) {
        inQuotes = !inQuotes;
        current += char;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
      i++;
    }
    if (current.trim()) {
      values.push(current.trim());
    }

    if (values.length < 5) continue; // Necesitamos al menos id, name, image, start_date, end_date

    const id = values[0];
    const name = values[1].replace(/^'|'$/g, ""); // Quitar comillas
    const image = values[2].replace(/^'|'$/g, "");
    const startDate = values[3].replace(/^'|'$/g, "");
    const endDate = values[4].replace(/^'|'$/g, "");

    // Verificar si tiene fecha válida
    if (
      !startDate ||
      startDate === "" ||
      !startDate.match(/^\d{2}-\d{2}-\d{4}$/)
    ) {
      continue;
    }

    // Verificar si es 2025+
    const eventYear = parseInt(startDate.split("-")[2]);
    if (eventYear < 2025) {
      continue;
    }

    console.log(`✅ Evento ${id}: ${name} (${startDate})`);

    // Convertir fecha DD-MM-YYYY a YYYY-MM-DD
    const dateParts = startDate.split("-");
    const convertedStartDate = `${dateParts[2]}-${dateParts[1].padStart(
      2,
      "0"
    )}-${dateParts[0].padStart(2, "0")}`;

    let convertedEndDate = convertedStartDate; // Default
    if (endDate && endDate.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const endDateParts = endDate.split("-");
      convertedEndDate = `${endDateParts[2]}-${endDateParts[1].padStart(
        2,
        "0"
      )}-${endDateParts[0].padStart(2, "0")}`;
    }

    // Limpiar strings para SQL
    const cleanName = name.replace(/'/g, "''").substring(0, 100);
    const cleanImage = image.replace(/'/g, "''");
    const slug = `evento-${id}`;

    sql += `INSERT INTO events (id, name, image, start_date, end_date, start_time, end_time, color, location, description, state, region, tipo, website, slugevento, status, idioma, user_id, created_at, updated_at) VALUES (${id}, '${cleanName}', '${cleanImage}', '${convertedStartDate}', '${convertedEndDate}', '', '', '', '', '', '', '', '', '', '${slug}', 'PUBLISHED', 1, 1, NOW(), NOW()) ON CONFLICT (slugevento) DO NOTHING;
`;

    processedEventCount++;
  }

  insertIndex++;
}

sql += `
-- Actualizar secuencia
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));
`;

fs.writeFileSync("./events-all-inserts.sql", sql);
console.log(`\n=== RESUMEN FINAL ===`);
console.log(`📊 Total eventos analizados: ${totalEventCount}`);
console.log(`🎯 Eventos 2025+ procesados: ${processedEventCount}`);
console.log(`✅ Archivo creado: events-all-inserts.sql`);
