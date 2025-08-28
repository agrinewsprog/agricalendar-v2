const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkEventImage() {
  try {
    // Buscar el evento específico por slug
    const event = await prisma.event.findFirst({
      where: {
        slug: "international-fish-congress-fish-expo-brasil",
      },
      select: {
        id: true,
        name: true,
        image: true,
        slug: true,
      },
    });

    if (event) {
      console.log("Event found:");
      console.log("ID:", event.id);
      console.log("Name:", event.name);
      console.log("Slug:", event.slug);
      console.log("Image field:", event.image);
      console.log("Image field type:", typeof event.image);
      console.log("Image is null/undefined:", event.image == null);
    } else {
      console.log(
        "Event not found with slug: international-fish-congress-fish-expo-brasil"
      );
    }

    // También ver algunos eventos con imagen
    const eventsWithImages = await prisma.event.findMany({
      where: {
        image: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        slug: true,
      },
      take: 5,
    });

    console.log("\nEvents with images:");
    eventsWithImages.forEach((event) => {
      console.log(`- ${event.name}: ${event.image}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEventImage();
