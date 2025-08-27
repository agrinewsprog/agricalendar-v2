const fs = require("fs");

// Leer el archivo MySQL original
const mysqlFile = "C:\\Users\\Samuel\\Downloads\\events.sql";
const content = fs.readFileSync(mysqlFile, "utf8");

// Buscar el INSERT con el formato correcto
const insertMatch = content.match(
  /INSERT INTO `events`[^)]+\) VALUES\s*([\s\S]*);/
);

if (!insertMatch) {
  console.error("No se encontraron eventos");
  process.exit(1);
}

let postgresSQL = `-- Migración completa de eventos MySQL → PostgreSQL
DELETE FROM events;

`;

const valuesSection = insertMatch[1];

// Dividir por filas que terminan en ),
const rows = valuesSection.split(/\),\s*\n\s*\(/);

console.log(`Encontradas ${rows.length} filas de eventos`);

rows.forEach((row, index) => {
  // Limpiar la fila
  let cleanRow = row.replace(/^\(/, "").replace(/\)$/, "").replace(/\);$/, "");

  // Parsear campos de forma más robusta
  const fields = [];
  let current = "";
  let inQuotes = false;
  let quoteChar = "";
  let parenthesesCount = 0;

  for (let i = 0; i < cleanRow.length; i++) {
    const char = cleanRow[i];

    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
      current += char;
    } else if (char === quoteChar && inQuotes) {
      // Verificar si es escape
      if (i > 0 && cleanRow[i - 1] === "\\") {
        current += char;
      } else {
        inQuotes = false;
        current += char;
      }
    } else if (char === "(" && !inQuotes) {
      parenthesesCount++;
      current += char;
    } else if (char === ")" && !inQuotes) {
      parenthesesCount--;
      current += char;
    } else if (char === "," && !inQuotes && parenthesesCount === 0) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) fields.push(current.trim());

  if (fields.length >= 28) {
    const [
      id,
      name,
      image,
      start_date,
      end_date,
      start_time,
      end_time,
      color,
      location,
      description,
      state,
      region,
      tipo,
      website,
      id_parent,
      idioma,
      slugevento,
      seo_title,
      seo_desc,
      views,
      visitante,
      programa,
      ponentes,
      registro,
      id_user,
      descuento,
      id_medio,
      url_redirect,
    ] = fields;

    // Convertir fechas DD-MM-YYYY → YYYY-MM-DD
    const convertDate = (dateStr) => {
      if (!dateStr || dateStr === "''" || dateStr === "NULL")
        return "'2024-01-01'";
      const cleaned = dateStr.replace(/'/g, "");
      if (cleaned.includes("-")) {
        const parts = cleaned.split("-");
        if (parts.length === 3 && parts[0].length <= 2) {
          // DD-MM-YYYY format
          return `'${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(
            2,
            "0"
          )}'`;
        } else if (parts.length === 3 && parts[0].length === 4) {
          // Already YYYY-MM-DD format
          return `'${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(
            2,
            "0"
          )}'`;
        }
      }
      return "'2024-01-01'";
    };

    // Generar slug único
    let slug = slugevento;
    if (!slug || slug === "''") {
      const nameClean = name
        .replace(/'/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      slug = `'${nameClean}-${id.replace(/'/g, "")}'`;
    }
    if (!slug || slug === "''") {
      slug = `'evento-${id.replace(/'/g, "")}'`;
    }

    postgresSQL += `INSERT INTO events (id, name, image, start_date, end_date, start_time, end_time, color, location, description, state, region, tipo, website, slugevento, status, idioma, user_id, created_at, updated_at) VALUES (${id}, ${name}, ${image}, ${convertDate(
      start_date
    )}, ${convertDate(
      end_date
    )}, ${start_time}, ${end_time}, ${color}, ${location}, ${description}, ${state}, ${region}, ${tipo}, ${website}, ${slug}, 'PUBLISHED', ${
      idioma || 1
    }, 1, NOW(), NOW()) ON CONFLICT (slugevento) DO UPDATE SET name = EXCLUDED.name;
`;
  }
});

postgresSQL += `
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));
`;

// Escribir archivo
fs.writeFileSync("./events-migration.sql", postgresSQL);
console.log("✅ Archivo de migración creado: events-migration.sql");
console.log(`📊 Total de eventos procesados: ${rows.length}`);
