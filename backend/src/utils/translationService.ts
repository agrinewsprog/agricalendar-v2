import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuración de idiomas disponibles
export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'th', name: 'ไทย' },
  { code: 'id', name: 'Bahasa Indonesia' }
];

// Mapeo de traducciones básicas para diferentes campos
const FIELD_TRANSLATIONS: Record<string, Record<string, string>> = {
  // Tipos de eventos
  eventTypes: {
    es: 'conferencia,taller,seminario,webinar,feria,exposicion,curso,congreso',
    en: 'conference,workshop,seminar,webinar,fair,exhibition,course,congress',
    pt: 'conferência,oficina,seminário,webinar,feira,exposição,curso,congresso',
    vi: 'hội nghị,hội thảo,hội thảo chuyên đề,webinar,hội chợ,triển lãm,khóa học,đại hội',
    th: 'การประชุม,การอบรม,การสัมมนา,เว็บบินาร์,งานแสดงสินค้า,นิทรรศการ,หลักสูตร,การประชุมใหญ่',
    id: 'konferensi,workshop,seminar,webinar,pameran,eksibisi,kursus,kongres'
  },
  // Regiones
  regions: {
    es: 'nacional,internacional,europa,america,asia,africa,oceania',
    en: 'national,international,europe,america,asia,africa,oceania',
    pt: 'nacional,internacional,europa,américa,ásia,áfrica,oceania',
    vi: 'quốc gia,quốc tế,châu âu,châu mỹ,châu á,châu phi,châu đại dương',
    th: 'ประเทศ,นานาชาติ,ยุโรป,อเมริกา,เอเชีย,แอฟริกา,โอเชียเนีย',
    id: 'nasional,internasional,eropa,amerika,asia,afrika,oseania'
  }
};

// Traducciones simples para palabras comunes
const SIMPLE_TRANSLATIONS: Record<string, Record<string, string>> = {
  'evento': {
    en: 'event',
    pt: 'evento',
    vi: 'sự kiện',
    th: 'กิจกรรม',
    id: 'acara'
  },
  'conferencia': {
    en: 'conference',
    pt: 'conferência',
    vi: 'hội nghị',
    th: 'การประชุม',
    id: 'konferensi'
  },
  'internacional': {
    en: 'international',
    pt: 'internacional',
    vi: 'quốc tế',
    th: 'นานาชาติ',
    id: 'internasional'
  },
  'avicola': {
    en: 'poultry',
    pt: 'avícola',
    vi: 'gia cầm',
    th: 'สัตว์ปีก',
    id: 'unggas'
  },
  'agricultura': {
    en: 'agriculture',
    pt: 'agricultura',
    vi: 'nông nghiệp',
    th: 'เกษตรกรรม',
    id: 'pertanian'
  }
};

/**
 * Función simple para traducir texto básico
 */
function translateSimpleText(text: string, fromLang: string, toLang: string): string {
  if (!text || fromLang === toLang) return text;
  
  let translatedText = text.toLowerCase();
  
  // Buscar traducciones simples
  Object.entries(SIMPLE_TRANSLATIONS).forEach(([originalWord, translations]) => {
    if (translatedText.includes(originalWord) && translations[toLang]) {
      translatedText = translatedText.replace(
        new RegExp(originalWord, 'gi'),
        translations[toLang]
      );
    }
  });
  
  // Capitalizar primera letra
  return translatedText.charAt(0).toUpperCase() + translatedText.slice(1);
}

/**
 * Generar slug para un idioma específico
 */
function generateSlugForLanguage(originalSlug: string, name: string, language: string): string {
  // Traducir el nombre y generar slug
  const translatedName = translateSimpleText(name, 'es', language);
  
  const baseSlug = translatedName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
    
  return baseSlug || originalSlug;
}

/**
 * Crear traducciones automáticas para un evento
 */
export async function createAutoTranslations(eventId: number, originalData: {
  name: string;
  description?: string;
  location?: string;
  originalLanguage: string;
}) {
  try {
    // Obtener todos los idiomas disponibles
    const languages = await prisma.language.findMany({
      where: { isActive: true }
    });
    
    const originalLang = originalData.originalLanguage || 'es';
    
    // Crear traducciones para cada idioma (excepto el original)
    for (const language of languages) {
      if (language.code === originalLang) continue;
      
      // Verificar si ya existe traducción
      const existingTranslation = await prisma.eventTranslation.findUnique({
        where: {
          eventId_languageId: {
            eventId,
            languageId: language.id
          }
        }
      });
      
      if (existingTranslation) continue;
      
      // Generar traducciones básicas
      const translatedName = translateSimpleText(originalData.name, originalLang, language.code);
      const translatedDescription = originalData.description 
        ? translateSimpleText(originalData.description, originalLang, language.code)
        : undefined;
      const translatedLocation = originalData.location 
        ? translateSimpleText(originalData.location, originalLang, language.code)
        : undefined;
      
      // Generar slug único para este idioma
      let baseSlug = generateSlugForLanguage(
        originalData.name,
        translatedName,
        language.code
      );
      
      let slug = baseSlug;
      let counter = 1;
      
      // Verificar que el slug sea único en las traducciones
      while (await prisma.eventTranslation.findFirst({ 
        where: { slug, languageId: language.id } 
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      // Crear la traducción
      await prisma.eventTranslation.create({
        data: {
          eventId,
          languageId: language.id,
          name: translatedName,
          description: translatedDescription,
          location: translatedLocation,
          slug,
          isAuto: true
        }
      });

      // Crear metadatos SEO básicos
      await prisma.seoMetadata.create({
        data: {
          eventId,
          languageId: language.id,
          title: translatedName.length > 60 
            ? translatedName.substring(0, 57) + '...' 
            : translatedName,
          description: translatedDescription
            ? (translatedDescription.length > 160 
                ? translatedDescription.substring(0, 157) + '...' 
                : translatedDescription)
            : translatedName,
          keywords: `${translatedName}, evento, agricultura, avicultura`
        }
      });
    }
    
    console.log(`✅ Auto-translations created for event ${eventId}`);
    return true;
    
  } catch (error) {
    console.error('❌ Error creating auto-translations:', error);
    throw error;
  }
}

/**
 * Actualizar traducción específica (para edición manual del admin)
 */
export async function updateEventTranslation(
  eventId: number,
  languageCode: string,
  data: {
    name?: string;
    description?: string;
    location?: string;
    slug?: string;
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string;
  }
) {
  try {
    // Obtener el idioma
    const language = await prisma.language.findUnique({
      where: { code: languageCode }
    });
    
    if (!language) {
      throw new Error(`Language ${languageCode} not found`);
    }
    
    // Actualizar traducción
    if (data.name || data.description || data.location || data.slug) {
      await prisma.eventTranslation.upsert({
        where: {
          eventId_languageId: {
            eventId,
            languageId: language.id
          }
        },
        update: {
          ...(data.name && { name: data.name }),
          ...(data.description && { description: data.description }),
          ...(data.location && { location: data.location }),
          ...(data.slug && { slug: data.slug }),
          isAuto: false // Marcar como traducción manual
        },
        create: {
          eventId,
          languageId: language.id,
          name: data.name || '',
          description: data.description,
          location: data.location,
          slug: data.slug || '',
          isAuto: false
        }
      });
    }
    
    // Actualizar metadatos SEO
    if (data.seoTitle || data.seoDescription || data.keywords) {
      await prisma.seoMetadata.upsert({
        where: {
          eventId_languageId: {
            eventId,
            languageId: language.id
          }
        },
        update: {
          ...(data.seoTitle && { title: data.seoTitle }),
          ...(data.seoDescription && { description: data.seoDescription }),
          ...(data.keywords && { keywords: data.keywords })
        },
        create: {
          eventId,
          languageId: language.id,
          title: data.seoTitle || '',
          description: data.seoDescription || '',
          keywords: data.keywords
        }
      });
    }
    
    console.log(`✅ Translation updated for event ${eventId} in ${languageCode}`);
    return true;
    
  } catch (error) {
    console.error('❌ Error updating translation:', error);
    throw error;
  }
}
