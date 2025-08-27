import prisma from '../config/dbConfigCalendar';
import fetch from 'node-fetch';

interface TranslationData {
  name: string;
  description: string;
  location: string;
  originalLanguage: string;
}

const SUPPORTED_LANGUAGES = {
  'es': 'Spanish',
  'en': 'English', 
  'pt': 'Portuguese',
  'vi': 'Vietnamese',
  'th': 'Thai',
  'id': 'Indonesian'
};

// API gratuita de traducción (MyMemory)
async function translateText(text: string, fromLang: string, toLang: string): Promise<string> {
  if (!text || text.trim() === '') return text;
  
  try {
    // MyMemory API es gratuita y no requiere API key
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
    
    const response = await fetch(url);
    const data = await response.json() as any;
    
    if (data.responseStatus === 200 && data.responseData) {
      return data.responseData.translatedText;
    } else {
      console.warn(`Translation API warning for ${fromLang}->${toLang}:`, data.responseStatus);
      return text; // Retornar texto original si falla la traducción
    }
  } catch (error) {
    console.error(`Error translating text from ${fromLang} to ${toLang}:`, error);
    return text; // Retornar texto original si hay error
  }
}

// Función de respaldo con traducciones básicas
function simpleTranslate(text: string, toLang: string): string {
  if (!text) return text;
  
  const translations: Record<string, Record<string, string>> = {
    'en': {
      'evento': 'event',
      'eventos': 'events',
      'conferencia': 'conference',
      'seminario': 'seminar',
      'exposición': 'exhibition',
      'feria': 'fair',
      'congreso': 'congress',
      'workshop': 'workshop',
      'curso': 'course',
      'brasil': 'brazil',
      'méxico': 'mexico',
      'españa': 'spain',
      'argentina': 'argentina',
      'colombia': 'colombia',
      'perú': 'peru',
      'chile': 'chile',
      'uruguay': 'uruguay',
      'paraguay': 'paraguay',
      'bolivia': 'bolivia',
      'ecuador': 'ecuador',
      'venezuela': 'venezuela'
    },
    'pt': {
      'evento': 'evento',
      'eventos': 'eventos',
      'conferencia': 'conferência',
      'seminario': 'seminário',
      'exposición': 'exposição',
      'feria': 'feira',
      'congreso': 'congresso',
      'workshop': 'workshop',
      'curso': 'curso',
      'brasil': 'brasil',
      'méxico': 'méxico',
      'españa': 'espanha'
    },
    'vi': {
      'evento': 'sự kiện',
      'eventos': 'các sự kiện',
      'conferencia': 'hội nghị',
      'seminario': 'hội thảo',
      'exposición': 'triển lãm',
      'feria': 'hội chợ',
      'congreso': 'đại hội',
      'workshop': 'workshop',
      'curso': 'khóa học'
    },
    'th': {
      'evento': 'เหตุการณ์',
      'eventos': 'เหตุการณ์ต่างๆ',
      'conferencia': 'การประชุม',
      'seminario': 'การสัมมนา',
      'exposición': 'การแสดงนิทรรศการ',
      'feria': 'งานแสดงสินค้า',
      'congreso': 'การประชุมใหญ่'
    },
    'id': {
      'evento': 'acara',
      'eventos': 'acara-acara',
      'conferencia': 'konferensi',
      'seminario': 'seminar',
      'exposición': 'pameran',
      'feria': 'pameran',
      'congreso': 'kongres'
    }
  };
  
  const langTranslations = translations[toLang];
  if (!langTranslations) return text;
  
  let translatedText = text.toLowerCase();
  
  for (const [spanish, translation] of Object.entries(langTranslations)) {
    const regex = new RegExp(`\\b${spanish}\\b`, 'gi');
    translatedText = translatedText.replace(regex, translation);
  }
  
  return translatedText.charAt(0).toUpperCase() + translatedText.slice(1);
}

export async function createAutoTranslations(eventId: string, data: TranslationData) {
  console.log(`🔄 Starting auto-translation for event ${eventId}`);
  
  try {
    const { name, description, location, originalLanguage } = data;
    
    // Crear traducciones para todos los idiomas soportados
    for (const [langCode, langName] of Object.entries(SUPPORTED_LANGUAGES)) {
      if (langCode === originalLanguage) {
        // Para el idioma original, solo guardamos los datos tal como están
        await saveTranslation(eventId, langCode, {
          name,
          description,
          location
        });
        console.log(`✅ Saved original content for language: ${langCode}`);
      } else {
        // Para otros idiomas, SOLO traducir la descripción
        console.log(`🔄 Translating description to ${langName} (${langCode}) using API...`);
        
        try {
          // SOLO traducir la descripción, mantener nombre y ubicación originales
          const translatedDescription = await translateText(description, originalLanguage, langCode);
          
          await saveTranslation(eventId, langCode, {
            name: name, // ← Mantener nombre original (no traducir)
            description: translatedDescription, // ← Solo traducir descripción
            location: location // ← Mantener ubicación original (no traducir)
          });
          
          console.log(`✅ API translation saved for language: ${langCode} (only description translated)`);
          
          // Pequeña pausa para no saturar la API gratuita
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (apiError) {
          console.warn(`⚠️ API translation failed for ${langCode}, using fallback:`, apiError);
          
          // Usar traducción de respaldo solo para la descripción
          const translatedDescription = simpleTranslate(description, langCode);
          
          await saveTranslation(eventId, langCode, {
            name: name, // ← Mantener nombre original
            description: translatedDescription, // ← Solo traducir descripción con fallback
            location: location // ← Mantener ubicación original
          });
          
          console.log(`✅ Fallback translation saved for language: ${langCode} (only description translated)`);
        }
      }
    }
    
    console.log(`✅ All translations completed for event ${eventId}`);
  } catch (error) {
    console.error(`❌ Error in createAutoTranslations for event ${eventId}:`, error);
    throw error;
  }
}

async function saveTranslation(eventId: string, language: string, content: any) {
  try {
    // Primero obtenemos el ID del idioma basado en el código
    const languageRecord = await prisma.language.findUnique({
      where: { code: language }
    });

    if (!languageRecord) {
      console.error(`❌ Language ${language} not found in database`);
      return;
    }

    await prisma.eventTranslation.upsert({
      where: {
        eventId_languageId: {
          eventId: parseInt(eventId),
          languageId: languageRecord.id
        }
      },
      update: {
        name: content.name,
        description: content.description,
        location: content.location,
        slug: generateSlug(content.name),
        isAuto: true,
        updatedAt: new Date()
      },
      create: {
        eventId: parseInt(eventId),
        languageId: languageRecord.id,
        name: content.name,
        description: content.description,
        location: content.location,
        slug: generateSlug(content.name),
        isAuto: true
      }
    });
  } catch (error) {
    console.error(`❌ Error saving translation for ${language}:`, error);
    throw error;
  }
}

export async function getEventTranslation(eventId: string, language: string) {
  try {
    const languageRecord = await prisma.language.findUnique({
      where: { code: language }
    });

    if (!languageRecord) {
      return null;
    }

    const translation = await prisma.eventTranslation.findUnique({
      where: {
        eventId_languageId: {
          eventId: parseInt(eventId),
          languageId: languageRecord.id
        }
      }
    });
    
    return translation;
  } catch (error) {
    console.error(`❌ Error getting translation for ${language}:`, error);
    return null;
  }
}

export async function updateTranslation(eventId: string, language: string, content: any) {
  try {
    const languageRecord = await prisma.language.findUnique({
      where: { code: language }
    });

    if (!languageRecord) {
      console.error(`❌ Language ${language} not found in database`);
      return null;
    }

    const translation = await prisma.eventTranslation.update({
      where: {
        eventId_languageId: {
          eventId: parseInt(eventId),
          languageId: languageRecord.id
        }
      },
      data: {
        name: content.name,
        description: content.description,
        location: content.location,
        slug: generateSlug(content.name),
        isAuto: false, // Manual edit
        updatedAt: new Date()
      }
    });
    
    return translation;
  } catch (error) {
    console.error(`❌ Error updating translation for ${language}:`, error);
    throw error;
  }
}

// Función auxiliar para generar slugs
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim() // Remove leading/trailing spaces
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
