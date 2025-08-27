const fs = require("fs");

// Leer archivo MySQL
const content = fs.readFileSync(
  "C:\\Users\\Samuel\\Downloads\\events.sql",
  "utf8"
);

// Extraer solo las líneas que empiezan con números (los datos reales)
const lines = content.split("\n");
const dataLines = lines.filter((line) => line.trim().match(/^\(\d+,/));

console.log(`Encontradas ${dataLines.length} líneas de datos`);

let sql = `-- Migración limpia de eventos
DELETE FROM events WHERE id > 0;

`;

let inserted = 0;
let skipped = 0;

dataLines.forEach((line) => {
  // Limpiar línea
  let clean = line.trim().replace(/^\(/, "").replace(/\),?$/, "");

  // Split básico por comas (muy simple)
  let parts = clean.split("', '");

  if (parts.length >= 15) {
    // Extraer solo campos básicos
    let id = parts[0].replace(/'/g, "");
    let name = parts[1].replace(/^'/, "").replace(/'/g, "''");
    let image = parts[2] || "";
    let startDate = parts[3];
    let endDate = parts[4];
    let startTime = parts[5] || "";
    let endTime = parts[6] || "";
    let color = parts[7] || "";
    let location = parts[8] || "";
    let description = parts[9] || "";

    // Validar fecha
    if (
      !startDate ||
      startDate.includes("NULL") ||
      startDate.includes("00-00")
    ) {
      console.log(`Omitiendo evento ${id} - fecha inválida`);
      skipped++;
      return;
    }

    // Convertir fecha simple
    let convertedDate = startDate;
    if (startDate.length === 10 && startDate.includes("-")) {
      let dateParts = startDate.split("-");
      if (dateParts[0].length <= 2) {
        // DD-MM-YYYY -> YYYY-MM-DD
        convertedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    }

    let convertedEndDate = endDate;
    if (endDate && endDate.length === 10 && endDate.includes("-")) {
      let dateParts = endDate.split("-");
      if (dateParts[0].length <= 2) {
        convertedEndDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    }

    // Limpiar strings problemáticos y escapar comillas
    name = name.replace(/[\\]/g, "").replace(/'/g, "''").substring(0, 100);
    location = location
      .replace(/[\\]/g, "")
      .replace(/'/g, "''")
      .substring(0, 100);
    description = description
      .replace(/[\\]/g, "")
      .replace(/'/g, "''")
      .substring(0, 200);
    image = image.replace(/'/g, "''");
    startTime = startTime.replace(/'/g, "''");
    endTime = endTime.replace(/'/g, "''");
    color = color.replace(/'/g, "''");

    // Generar slug simple
    let slug = `evento-${id}`;

    // INSERT simple
    sql += `INSERT INTO events (id, name, image, start_date, end_date, start_time, end_time, color, location, description, state, region, tipo, website, slugevento, status, idioma, user_id, created_at, updated_at) VALUES (${id}, '${name}', '${image}', '${convertedDate}', '${convertedEndDate}', '${startTime}', '${endTime}', '${color}', '${location}', '${description}', '', '', '', '', '${slug}', 'PUBLISHED', 1, 1, NOW(), NOW()) ON CONFLICT (slugevento) DO NOTHING;
`;

    inserted++;
  }
});

sql += `
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));
`;

fs.writeFileSync("./events-simple.sql", sql);
console.log(`✅ Archivo creado: events-simple.sql`);
console.log(`📊 Eventos insertados: ${inserted}`);
console.log(`⚠️  Eventos omitidos: ${skipped}`);
