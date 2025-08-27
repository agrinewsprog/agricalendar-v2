const fs = require("fs");
const path = require("path");

// Script súper simple para convertir el SQL de MySQL a PostgreSQL

function convertMySQLToPostgreSQL(inputFile, outputFile) {
  console.log("🔄 Convirtiendo MySQL a PostgreSQL...");

  // Leer archivo MySQL
  const sqlContent = fs.readFileSync(inputFile, "utf8");

  // Extraer solo los INSERT
  const insertRegex = /INSERT INTO `events` \(.*?\) VALUES\s*([\s\S]*?);/g;
  const matches = sqlContent.match(insertRegex);

  if (!matches) {
    console.error("❌ No se encontraron INSERT statements");
    return;
  }

  let postgresSQL = `-- Migración de eventos MySQL → PostgreSQL
-- Generado automáticamente

-- Limpiar tabla (opcional, descomenta si quieres borrar eventos existentes)
-- DELETE FROM events;

-- Insertar eventos migrados
`;

  // Procesar cada INSERT
  matches.forEach((insertStatement) => {
    // Extraer los VALUES
    const valuesMatch = insertStatement.match(/VALUES\s*([\s\S]*)/);
    if (!valuesMatch) return;

    const valuesString = valuesMatch[1].replace(/;$/, "");

    // Dividir por filas (cada fila termina en ),)
    const rows = valuesString.split(/\),\s*\(/);

    rows.forEach((row, index) => {
      // Limpiar la fila
      let cleanRow = row.replace(/^\(/, "").replace(/\)$/, "");

      // Dividir campos
      const fields = [];
      let currentField = "";
      let inQuotes = false;
      let quoteChar = "";

      for (let i = 0; i < cleanRow.length; i++) {
        const char = cleanRow[i];

        if ((char === '"' || char === "'") && !inQuotes) {
          inQuotes = true;
          quoteChar = char;
          currentField += char;
        } else if (char === quoteChar && inQuotes) {
          inQuotes = false;
          currentField += char;
        } else if (char === "," && !inQuotes) {
          fields.push(currentField.trim());
          currentField = "";
        } else {
          currentField += char;
        }
      }

      if (currentField.trim()) {
        fields.push(currentField.trim());
      }

      if (fields.length >= 28) {
        // Mínimo de campos esperados
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

        // Convertir fechas de DD-MM-YYYY a YYYY-MM-DD
        const convertDate = (dateStr) => {
          if (!dateStr || dateStr === "''" || dateStr === "NULL") return "NULL";
          const cleaned = dateStr.replace(/'/g, "");
          if (cleaned.includes("-")) {
            const parts = cleaned.split("-");
            if (parts.length === 3) {
              return `'${parts[2]}-${parts[1]}-${parts[0]}'`; // DD-MM-YYYY → YYYY-MM-DD
            }
          }
          return dateStr;
        };

        // Mapear idioma (1 = español, por defecto)
        const languageId = idioma === "1" ? "1" : "1";

        // Generar slug si no existe
        let slug = slugevento;
        if (!slug || slug === "''") {
          const nameClean = name
            .replace(/'/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
          slug = `'${nameClean}-${id.replace(/'/g, "")}'`;
        }

        // Status por defecto
        const status = "'PUBLISHED'";

        // Usuario admin
        const userId = "1";

        // Crear INSERT para PostgreSQL
        const postgresInsert = `INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  ${id}, ${name}, ${image}, ${convertDate(start_date)}, ${convertDate(
          end_date
        )}, 
  ${start_time}, ${end_time}, ${color}, ${location}, ${description}, 
  ${state}, ${region}, ${tipo}, ${website}, ${slug}, ${status}, 
  ${languageId}, ${userId}, COALESCE(${views}, 0), false, false,
  NOW(), NOW()
);`;

        postgresSQL += postgresInsert + "\n\n";
      }
    });
  });

  // Agregar reset de secuencia
  postgresSQL += `
-- Actualizar secuencia de IDs
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));

-- Crear metadatos SEO para eventos con seo_title
-- (Ejecutar después si se necesita)
`;

  // Escribir archivo
  fs.writeFileSync(outputFile, postgresSQL);
  console.log(`✅ Archivo convertido: ${outputFile}`);
  console.log("📝 Revisa el archivo antes de ejecutarlo en PostgreSQL");
}

// Ejecutar conversión
const inputFile = "C:\\Users\\Samuel\\Downloads\\events.sql";
const outputFile =
  "C:\\Users\\Samuel\\Desktop\\proyectos_github\\agricalendar-v2\\backend\\scripts\\events-postgres.sql";

try {
  convertMySQLToPostgreSQL(inputFile, outputFile);
} catch (error) {
  console.error("❌ Error:", error.message);
}
