import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Datos del administrador por defecto
    const adminData = {
      name: "Administrador",
      username: "admin",
      email: "admin@agricalendar.com",
      password: "admin123", // Cambiar en producción
      role: "SUPER_ADMIN",
      state: "ACTIVE",
    };

    // Verificar si ya existe un usuario con ese email
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingUser) {
      console.log("❌ El usuario administrador ya existe:", adminData.email);
      return;
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(adminData.password, 12);

    // Crear usuario administrador
    const admin = await prisma.user.create({
      data: {
        ...adminData,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        state: true,
        createdAt: true,
      },
    });

    console.log("✅ Usuario administrador creado exitosamente:");
    console.log("📧 Email:", adminData.email);
    console.log("🔑 Contraseña temporal:", adminData.password);
    console.log("👤 Datos del usuario:");
    console.table(admin);
    console.log("");
    console.log(
      "⚠️  IMPORTANTE: Cambia la contraseña después del primer login!"
    );
  } catch (error) {
    console.error("❌ Error creando usuario administrador:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar directamente
createAdminUser();
