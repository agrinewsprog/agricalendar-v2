import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedLanguages() {
  console.log('🌍 Seeding languages...');

  const languages = [
    { name: 'Español', code: 'es', isActive: true, isDefault: true },
    { name: 'English', code: 'en', isActive: true, isDefault: false },
    { name: 'Português', code: 'pt', isActive: true, isDefault: false },
    { name: 'Tiếng Việt', code: 'vi', isActive: true, isDefault: false },
    { name: 'ไทย', code: 'th', isActive: true, isDefault: false },
    { name: 'Bahasa Indonesia', code: 'id', isActive: true, isDefault: false }
  ];

  for (const language of languages) {
    await prisma.language.upsert({
      where: { code: language.code },
      update: {
        name: language.name,
        isActive: language.isActive,
        isDefault: language.isDefault
      },
      create: language
    });
    console.log(`✅ Language ${language.name} (${language.code}) created/updated`);
  }

  console.log('🎉 Languages seeded successfully!');
}

export { seedLanguages };

// Si este archivo se ejecuta directamente
if (require.main === module) {
  seedLanguages()
    .catch((e) => {
      console.error('❌ Error seeding languages:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
