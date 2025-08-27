const mysql = require("mysql2/promise");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Configuración de MySQL (actualiza con tus datos)
const MYSQL_CONFIG = {
  host: "localhost", // Cambia por tu host
  user: "tu_usuario", // Cambia por tu usuario MySQL
  password: "tu_password", // Cambia por tu password MySQL
  database: "tu_base_datos", // Cambia por tu base de datos MySQL
  port: 3306,
};

// Mapeo de idiomas: MySQL ID -> PostgreSQL ID
const LANGUAGE_MAP = {
  1: 1, // Español
  2: 2, // Inglés
  3: 3, // Francés
  4: 4, // Alemán
  // Agrega más según tus idiomas
};

// Función para generar slug único
function generateSlug(name, id) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-") +
    "-" +
    id
  );
}

// Función principal de migración
async function migrateEvents() {
  let mysqlConnection;

  try {
    console.log("🔄 Iniciando migración de eventos...");

    // Conectar a MySQL
    console.log("📡 Conectando a MySQL...");
    mysqlConnection = await mysql.createConnection(MYSQL_CONFIG);

    // Obtener eventos de MySQL
    console.log("📥 Obteniendo eventos de MySQL...");
    const [mysqlEvents] = await mysqlConnection.execute(`
      SELECT 
        id, name, image, start_date, end_date, start_time, end_time, 
        color, location, description, state, region, tipo, website, 
        slugevento, seo_title, seo_desc, idioma, id_user
      FROM events 
      ORDER BY id
    `);

    console.log(`📊 Encontrados ${mysqlEvents.length} eventos en MySQL`);

    // Verificar idiomas en PostgreSQL
    console.log("🔍 Verificando idiomas en PostgreSQL...");
    const languages = await prisma.language.findMany();
    console.log(
      `📋 Idiomas disponibles: ${languages
        .map((l) => `${l.id}:${l.code}`)
        .join(", ")}`
    );

    let migrated = 0;
    let errors = 0;

    // Migrar cada evento
    for (const event of mysqlEvents) {
      try {
        // Mapear idioma
        const languageId = LANGUAGE_MAP[event.idioma] || 1; // Default español

        // Generar slug único si no existe o está duplicado
        let slug = event.slugevento || generateSlug(event.name, event.id);

        // Verificar que el slug sea único
        const existingEvent = await prisma.event.findUnique({
          where: { slug },
        });

        if (existingEvent) {
          slug = generateSlug(event.name, event.id);
        }

        // Mapear status (todos como PUBLISHED ya que en MySQL state=0)
        const status = "PUBLISHED";

        // Preparar datos para PostgreSQL
        const eventData = {
          name: event.name || "Sin título",
          image: event.image,
          startDate: new Date(event.start_date),
          endDate: event.end_date ? new Date(event.end_date) : null,
          startTime: event.start_time,
          endTime: event.end_time,
          color: event.color,
          location: event.location,
          description: event.description,
          state: event.state?.toString(),
          region: event.region,
          tipo: event.tipo,
          website: event.website,
          slug: slug,
          status: status,
          languageId: languageId,
          userId: 1, // Asignar al admin
          views: 0,
          isRecurring: false,
          isFeatured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Crear evento en PostgreSQL
        const newEvent = await prisma.event.create({
          data: eventData,
        });

        // Crear SEO metadata si existe
        if (event.seo_title || event.seo_desc) {
          await prisma.seoMetadata.create({
            data: {
              entityType: "EVENT",
              entityId: newEvent.id,
              languageId: languageId,
              title: event.seo_title,
              description: event.seo_desc,
              keywords: "",
              slug: slug,
            },
          });
        }

        migrated++;
        console.log(`✅ Migrado evento ${event.id}: ${event.name}`);
      } catch (error) {
        errors++;
        console.error(`❌ Error migrando evento ${event.id}: ${error.message}`);
      }
    }

    console.log("\n🎉 Migración completada!");
    console.log(`✅ Eventos migrados: ${migrated}`);
    console.log(`❌ Errores: ${errors}`);
  } catch (error) {
    console.error("💥 Error en la migración:", error);
  } finally {
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
    await prisma.$disconnect();
  }
}

// Función para verificar conexiones
async function testConnections() {
  console.log("🔍 Verificando conexiones...");

  try {
    // Test MySQL
    const mysqlConnection = await mysql.createConnection(MYSQL_CONFIG);
    const [result] = await mysqlConnection.execute(
      "SELECT COUNT(*) as count FROM events"
    );
    console.log(`✅ MySQL: ${result[0].count} eventos encontrados`);
    await mysqlConnection.end();

    // Test PostgreSQL
    const count = await prisma.event.count();
    console.log(`✅ PostgreSQL: ${count} eventos actuales`);
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
  }
}

// Ejecutar según el argumento
const command = process.argv[2];

if (command === "test") {
  testConnections();
} else if (command === "migrate") {
  migrateEvents();
} else {
  console.log(`
🚀 Script de Migración MySQL → PostgreSQL

Uso:
  node migrate-from-mysql.js test     - Verificar conexiones
  node migrate-from-mysql.js migrate - Ejecutar migración

⚠️  IMPORTANTE: Actualiza las credenciales MySQL en el archivo antes de ejecutar
`);
}
