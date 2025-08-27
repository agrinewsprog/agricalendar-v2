const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Crear idiomas
  const languages = [
    { name: "Español", code: "es", isDefault: true },
    { name: "English", code: "en", isDefault: false },
    { name: "Português", code: "pt", isDefault: false },
    { name: "Tiếng Việt", code: "vi", isDefault: false },
    { name: "ไทย", code: "th", isDefault: false },
    { name: "Bahasa Indonesia", code: "id", isDefault: false },
  ];

  console.log("📝 Creating languages...");
  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: {},
      create: lang,
    });
  }

  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash("admin123", 12);

  console.log("👤 Creating admin user...");
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@agricalendar.com" },
    update: {},
    create: {
      name: "Administrator",
      username: "admin",
      email: "admin@agricalendar.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      state: "ACTIVE",
    },
  });

  // Obtener idioma español para eventos de ejemplo
  const spanishLang = await prisma.language.findFirst({
    where: { code: "es" },
  });

  if (spanishLang) {
    console.log("🎪 Creating sample events...");

    // Crear eventos de ejemplo
    const sampleEvents = [
      {
        name: "Feria Avícola Internacional 2025",
        image: "https://example.com/feria-avicola.jpg",
        startDate: new Date("2025-09-15"),
        endDate: new Date("2025-09-17"),
        startTime: "09:00",
        endTime: "18:00",
        color: "#FF6B35",
        location: "IFEMA Madrid, España",
        description:
          "La mayor feria avícola de Europa. Exposición de las últimas tecnologías, conferencias magistrales y networking profesional.",
        state: "Madrid",
        region: "Europa",
        tipo: "Feria",
        website: "https://feria-avicola-madrid.com",
        slug: "feria-avicola-internacional-2025-madrid",
        status: "PUBLISHED",
        languageId: spanishLang.id,
        userId: adminUser.id,
        registro: "Registro gratuito en línea",
        seoTitle: "Feria Avícola Internacional 2025 - Madrid | AgriCalendar",
        seoDesc:
          "Participa en la mayor feria avícola de Europa. Del 15 al 17 de septiembre en IFEMA Madrid.",
      },
      {
        name: "Congreso Mundial de Avicultura 2025",
        image: "https://example.com/congreso-mundial.jpg",
        startDate: new Date("2025-10-20"),
        endDate: new Date("2025-10-22"),
        startTime: "08:30",
        endTime: "17:00",
        color: "#4ECDC4",
        location: "Centro de Convenciones, Barcelona",
        description:
          "Congreso científico internacional sobre avances en genética avícola, nutrición y bienestar animal.",
        state: "Cataluña",
        region: "Europa",
        tipo: "Congreso",
        website: "https://congreso-mundial-avicultura.com",
        slug: "congreso-mundial-avicultura-2025-barcelona",
        status: "PUBLISHED",
        languageId: spanishLang.id,
        userId: adminUser.id,
        registro: "Inscripción: 299€ (profesionales), 149€ (estudiantes)",
        seoTitle:
          "Congreso Mundial de Avicultura 2025 - Barcelona | AgriCalendar",
        seoDesc:
          "Congreso científico internacional en Barcelona. Avances en genética, nutrición y bienestar avícola.",
      },
      {
        name: "Workshop: Bioseguridad en Granjas Avícolas",
        image: "https://example.com/workshop-bioseguridad.jpg",
        startDate: new Date("2025-11-05"),
        startTime: "10:00",
        endTime: "16:00",
        color: "#95E1D3",
        location: "Online & Valencia, España",
        description:
          "Taller práctico sobre implementación de protocolos de bioseguridad en instalaciones avícolas modernas.",
        state: "Valencia",
        region: "Europa",
        tipo: "Workshop",
        website: "https://workshop-bioseguridad.com",
        slug: "workshop-bioseguridad-granjas-avicolas-valencia",
        status: "PUBLISHED",
        languageId: spanishLang.id,
        userId: adminUser.id,
        registro: "Plazas limitadas - Registro obligatorio",
        seoTitle:
          "Workshop Bioseguridad Granjas Avícolas - Valencia | AgriCalendar",
        seoDesc:
          "Taller práctico sobre protocolos de bioseguridad en instalaciones avícolas. Valencia, 5 noviembre.",
      },
    ];

    for (const event of sampleEvents) {
      await prisma.event.create({
        data: event,
      });
    }
  }

  console.log("✅ Database seeded successfully!");
  console.log("📊 Summary:");
  console.log(`- Languages: ${languages.length}`);
  console.log(`- Users: 1 (admin)`);
  console.log(`- Events: 3 (sample events)`);
  console.log("");
  console.log("🔑 Admin credentials:");
  console.log("Email: admin@agricalendar.com");
  console.log("Password: admin123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
