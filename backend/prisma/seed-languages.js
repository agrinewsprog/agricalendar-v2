const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedLanguages() {
  console.log("🌱 Seeding languages...");

  const languages = [
    { name: "Español", code: "es", isDefault: true },
    { name: "English", code: "en", isDefault: false },
    { name: "Português", code: "pt", isDefault: false },
    { name: "Tiếng Việt", code: "vi", isDefault: false },
    { name: "ไทย", code: "th", isDefault: false },
    { name: "Bahasa Indonesia", code: "id", isDefault: false },
  ];

  for (const lang of languages) {
    try {
      const existingLang = await prisma.language.findUnique({
        where: { code: lang.code },
      });

      if (!existingLang) {
        await prisma.language.create({
          data: lang,
        });
        console.log(`✅ Created language: ${lang.name} (${lang.code})`);
      } else {
        console.log(`⚠️  Language already exists: ${lang.name} (${lang.code})`);
      }
    } catch (error) {
      console.error(`❌ Error creating language ${lang.code}:`, error);
    }
  }

  console.log("✅ Language seeding completed!");
}

seedLanguages()
  .catch((e) => {
    console.error("❌ Error seeding languages:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
