const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Función para generar slug desde nombre
function generateSlug(name) {
  if (!name) return "evento-sin-nombre";

  return name
    .toLowerCase()
    .normalize("NFD") // Descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remover diacríticos (ñ, á, é, etc.)
    .replace(/[°º]/g, "") // Remover símbolos de grados
    .replace(/[^a-z0-9\s-]/g, "") // Remover caracteres especiales
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/-+/g, "-") // Múltiples guiones a uno
    .replace(/^-|-$/g, "") // Remover guiones del inicio y final
    .substring(0, 100); // Limitar a 100 caracteres
}

// Función para asegurar slug único
async function ensureUniqueSlug(baseSlug, eventId) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.event.findFirst({
      where: {
        slug: slug,
        id: { not: eventId },
      },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

async function fixAllSlugs() {
  try {
    console.log("🔍 REGENERANDO TODOS LOS SLUGS DE EVENTOS\n");
    console.log("Este script va a:\n");
    console.log('1. Buscar todos los eventos con slugs tipo "evento-XXX"');
    console.log("2. Generar nuevos slugs basados en el nombre real");
    console.log("3. Actualizar la base de datos\n");

    // Obtener todos los eventos
    const allEvents = await prisma.event.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { id: "asc" },
    });

    console.log(`📊 Total de eventos en BD: ${allEvents.length}\n`);

    if (allEvents.length === 0) {
      console.log("❌ No hay eventos en la base de datos");
      return;
    }

    // Filtrar eventos que necesitan corrección (slug tipo evento-XXX o event-XXX)
    const eventsToFix = allEvents.filter((event) => {
      const hasGenericSlug =
        /^evento-\d+$/.test(event.slug) || /^event-\d+$/.test(event.slug);
      const expectedSlug = generateSlug(event.name);
      const needsUpdate = event.slug !== expectedSlug;

      return hasGenericSlug || needsUpdate;
    });

    console.log(`🎯 Eventos que necesitan corrección: ${eventsToFix.length}\n`);

    if (eventsToFix.length === 0) {
      console.log("✅ Todos los slugs ya están correctos");
      return;
    }

    // Mostrar preview de cambios
    console.log("📋 PREVIEW de cambios que se van a hacer:\n");
    eventsToFix.slice(0, 10).forEach((event, index) => {
      const newSlug = generateSlug(event.name);
      console.log(`${index + 1}. ID ${event.id}: "${event.name}"`);
      console.log(`   ANTES: ${event.slug}`);
      console.log(`   DESPUÉS: ${newSlug}\n`);
    });

    if (eventsToFix.length > 10) {
      console.log(`   ... y ${eventsToFix.length - 10} eventos más\n`);
    }

    console.log("⚠️  ATENCIÓN: Esta operación va a modificar la base de datos");
    console.log(
      "⚠️  Asegúrate de estar ejecutando esto en el servidor correcto"
    );
    console.log("\n🚀 Iniciando corrección en 5 segundos...\n");

    // Countdown
    for (let i = 5; i > 0; i--) {
      process.stdout.write(`⏰ ${i}... `);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log("\n\n🔧 INICIANDO CORRECCIÓN...\n");

    let fixed = 0;
    let errors = 0;
    let skipped = 0;

    for (const event of eventsToFix) {
      try {
        const baseSlug = generateSlug(event.name);
        const newSlug = await ensureUniqueSlug(baseSlug, event.id);

        if (newSlug === event.slug) {
          console.log(`⏭️  ID ${event.id}: Slug ya correcto - ${event.slug}`);
          skipped++;
          continue;
        }

        await prisma.event.update({
          where: { id: event.id },
          data: { slug: newSlug },
        });

        console.log(`✅ ID ${event.id}: ${event.slug} → ${newSlug}`);
        console.log(`   "${event.name}"`);
        fixed++;
      } catch (error) {
        console.error(`❌ Error en evento ID ${event.id}:`, error.message);
        errors++;
      }
    }

    console.log("\n🎉 ¡CORRECCIÓN COMPLETADA!\n");
    console.log(`📊 RESUMEN:`);
    console.log(`   ✅ Eventos corregidos: ${fixed}`);
    console.log(`   ⏭️  Eventos omitidos: ${skipped}`);
    console.log(`   ❌ Errores: ${errors}`);
    console.log(`   📋 Total procesados: ${eventsToFix.length}`);

    if (fixed > 0) {
      console.log(
        "\n🔄 IMPORTANTE: Reinicia tu aplicación para que los cambios surtan efecto"
      );
      console.log("   En el servidor: pm2 restart ecosystem.config.js");
    }
  } catch (error) {
    console.error("❌ Error fatal en el proceso:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  fixAllSlugs();
}

module.exports = { fixAllSlugs, generateSlug };
