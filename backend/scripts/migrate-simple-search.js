const fs = require("fs");

// Leer archivo completo
const content = fs.readFileSync(
  "C:\\Users\\Samuel\\Downloads\\events.sql",
  "utf8"
);

console.log("=== MIGRACIÓN SIMPLE - BÚSQUEDA DIRECTA ===");

let sql = `-- Migración eventos 2025+ - Método directo
DELETE FROM events WHERE id > 0;

`;

let eventCount = 0;

// Buscar TODAS las líneas que contengan fechas 2025+
const lines = content.split("\n");

lines.forEach((line, index) => {
  // Buscar líneas que contengan fechas 2025+ y que sean parte de un INSERT
  if (line.includes("2025") || line.includes("2026") || line.includes("2027")) {
    // Verificar que sea una línea de datos (contiene patrón de evento)
    const eventMatch = line.match(
      /\((\d+),\s*'([^']*)',\s*'([^']*)',\s*'(\d{2}-\d{2}-202[5-9])',\s*'(\d{2}-\d{2}-202[5-9])'/
    );

    if (eventMatch) {
      const [, id, name, image, startDate, endDate] = eventMatch;

      console.log(`✅ Encontrado evento ${id}: ${name} (${startDate})`);

      // Convertir fechas DD-MM-YYYY a YYYY-MM-DD
      const startParts = startDate.split("-");
      const convertedStartDate = `${startParts[2]}-${startParts[1].padStart(
        2,
        "0"
      )}-${startParts[0].padStart(2, "0")}`;

      const endParts = endDate.split("-");
      const convertedEndDate = `${endParts[2]}-${endParts[1].padStart(
        2,
        "0"
      )}-${endParts[0].padStart(2, "0")}`;

      // Limpiar datos para SQL
      const cleanName = name.replace(/'/g, "''").substring(0, 100);
      const cleanImage = image.replace(/'/g, "''");
      const slug = `evento-${id}`;

      sql += `INSERT INTO events (id, name, image, start_date, end_date, start_time, end_time, color, location, description, state, region, tipo, website, slugevento, status, idioma, user_id, created_at, updated_at) VALUES (${id}, '${cleanName}', '${cleanImage}', '${convertedStartDate}', '${convertedEndDate}', '', '', '', '', '', '', '', '', '', '${slug}', 'PUBLISHED', 1, 1, NOW(), NOW()) ON CONFLICT (slugevento) DO NOTHING;
`;

      eventCount++;
    } else {
      // Intentar patrón más flexible
      const flexibleMatch = line.match(/\((\d+),.*?'(\d{2}-\d{2}-202[5-9])'/);
      if (flexibleMatch) {
        console.log(
          `🔍 Línea ${index} contiene fecha 2025+ pero no coincide con patrón exacto:`
        );
        console.log(`    ${line.substring(0, 150)}...`);
      }
    }
  }
});

sql += `
-- Actualizar secuencia
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));
`;

fs.writeFileSync("./events-simple-search.sql", sql);
console.log(`\n=== RESUMEN ===`);
console.log(`🎯 Eventos 2025+ encontrados y procesados: ${eventCount}`);
console.log(`✅ Archivo creado: events-simple-search.sql`);
