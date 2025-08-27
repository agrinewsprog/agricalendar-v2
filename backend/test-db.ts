import dotenv from 'dotenv';

// Cargar variables de entorno antes que todo
dotenv.config();

console.log('🔧 Environment Variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

import { PrismaClient } from '@prisma/client';

// Test de conexión
const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    const languageCount = await prisma.language.count();
    console.log(`📊 Languages in database: ${languageCount}`);
    
    const eventCount = await prisma.event.count();
    console.log(`📊 Events in database: ${eventCount}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
