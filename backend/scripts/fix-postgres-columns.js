const fs = require("fs");

// Script para corregir los nombres de columnas PostgreSQL
function fixPostgreSQLColumns() {
  console.log("🔄 Corrigiendo nombres de columnas PostgreSQL...");

  // Leer archivo generado
  const inputFile = "./events-postgres-all.sql";
  const outputFile = "./events-postgres-complete.sql";

  let content = fs.readFileSync(inputFile, "utf8");

  // Reemplazar nombres de columnas de camelCase a snake_case
  content = content.replace(/"startDate"/g, "start_date");
  content = content.replace(/"endDate"/g, "end_date");
  content = content.replace(/"startTime"/g, "start_time");
  content = content.replace(/"endTime"/g, "end_time");
  content = content.replace(/"languageId"/g, "language_id");
  content = content.replace(/"userId"/g, "user_id");
  content = content.replace(/"isRecurring"/g, "is_recurring");
  content = content.replace(/"isFeatured"/g, "is_featured");
  content = content.replace(/"createdAt"/g, "created_at");
  content = content.replace(/"updatedAt"/g, "updated_at");

  // Escribir archivo corregido
  fs.writeFileSync(outputFile, content);
  console.log(`✅ Archivo corregido: ${outputFile}`);

  // Contar INSERT statements
  const insertCount = (content.match(/INSERT INTO events/g) || []).length;
  console.log(`📊 Total de eventos a migrar: ${insertCount}`);
}

try {
  fixPostgreSQLColumns();
} catch (error) {
  console.error("❌ Error:", error.message);
}
