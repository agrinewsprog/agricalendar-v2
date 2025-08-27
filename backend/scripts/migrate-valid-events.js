const fs = require("fs");

// Leer el archivo MySQL original
const mysqlFile = "C:\\Users\\Samuel\\Downloads\\events.sql";
const content = fs.readFileSync(mysqlFile, "utf8");

// Extraer solo la parte de los datos después de VALUES
const valuesMatch = content.match(/INSERT INTO `events`.*?VALUES\s*([\s\S]*);/);

if (!valuesMatch) {
  console.error("No se encontraron datos");
  process.exit(1);
}

let postgresSQL = `-- Migración de eventos válidos solamente
DELETE FROM events WHERE id > 0;

`;

const valuesSection = valuesMatch[1];
let validEvents = 0;
let skippedEvents = 0;

// Procesar línea por línea de forma más simple
const lines = valuesSection.split("\n");
let currentRow = "";
let inRow = false;

lines.forEach((line) => {
  line = line.trim();

  if (line.startsWith("(")) {
    inRow = true;
    currentRow = line;
  } else if (inRow) {
    currentRow += " " + line;
  }

  if (line.endsWith("),") || line.endsWith(");")) {
    inRow = false;

    // Procesar la fila completa
    let row = currentRow
      .replace(/^\(/, "")
      .replace(/\),?$/, "")
      .replace(/\);$/, "");

    // Extraer campos básicos usando split simple
    let parts = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < row.length; i++) {
      let char = row[i];

      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
        current += char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        current += char;
      } else if (char === "," && !inQuotes) {
        parts.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      parts.push(current.trim());
    }

    if (parts.length >= 10) {
      const id = parts[0];
      const name = parts[1];
      const image = parts[2] || "''";
      const startDate = parts[3];
      const endDate = parts[4];
      const startTime = parts[5] || "''";
      const endTime = parts[6] || "''";
      const color = parts[7] || "''";
      const location = parts[8] || "''";
      const description = parts[9] || "''";
      const state = parts[10] || "''";
      const region = parts[11] || "''";
      const tipo = parts[12] || "''";
      const website = parts[13] || "''";
      const idioma = parts[15] || "1";
      const slugevento = parts[16] || `'evento-${id.replace(/'/g, "")}'`;

      // Validar fecha - omitir si es NULL, vacía o inválida
      if (
        !startDate ||
        startDate === "''" ||
        startDate === "NULL" ||
        startDate.includes("00-00")
      ) {
        console.log(`Omitiendo evento ${id} - fecha inválida: ${startDate}`);
        skippedEvents++;
        return;
      }

      // Convertir fecha
      let convertedStartDate = startDate;
      let convertedEndDate = endDate;

      const convertDate = (dateStr) => {
        if (!dateStr || dateStr === "''" || dateStr === "NULL")
          return "'2024-01-01'";
        let cleaned = dateStr.replace(/'/g, "");
        if (cleaned.includes("-")) {
          let dateParts = cleaned.split("-");
          if (dateParts.length === 3 && dateParts[0].length <= 2) {
            return `'${dateParts[2]}-${dateParts[1].padStart(
              2,
              "0"
            )}-${dateParts[0].padStart(2, "0")}'`;
          }
        }
        return dateStr;
      };

      convertedStartDate = convertDate(startDate);
      convertedEndDate = convertDate(endDate);

      // Generar slug único
      let finalSlug = slugevento;
      if (!finalSlug || finalSlug === "''") {
        finalSlug = `'evento-${id.replace(/'/g, "")}'`;
      }

      // Generar INSERT válido
      postgresSQL += `INSERT INTO events (id, name, image, start_date, end_date, start_time, end_time, color, location, description, state, region, tipo, website, slugevento, status, idioma, user_id, created_at, updated_at) VALUES (${id}, ${name}, ${image}, ${convertedStartDate}, ${convertedEndDate}, ${startTime}, ${endTime}, ${color}, ${location}, ${description}, ${state}, ${region}, ${tipo}, ${website}, ${finalSlug}, 'PUBLISHED', ${idioma}, 1, NOW(), NOW()) ON CONFLICT (slugevento) DO NOTHING;
`;

      validEvents++;
    }

    currentRow = "";
  }
});

postgresSQL += `
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));
`;

// Escribir archivo
fs.writeFileSync("./events-migration-valid.sql", postgresSQL);
console.log(`✅ Archivo creado: events-migration-valid.sql`);
console.log(`📊 Eventos válidos: ${validEvents}`);
console.log(`⚠️  Eventos omitidos: ${skippedEvents}`);
