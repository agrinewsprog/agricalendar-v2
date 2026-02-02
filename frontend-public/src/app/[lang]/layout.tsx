import type { Metadata } from "next";
import { ReactNode } from "react";

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

// Traducciones para metadata
const METADATA_TRANSLATIONS: Record<
  string,
  { title: string; description: string; keywords: string }
> = {
  es: {
    title: "AgriCalendar - Calendario de Eventos del Sector Avícola",
    description:
      "Descubre los próximos eventos, ferias y congresos del sector avícola mundial. Tu calendario completo de eventos para profesionales de la industria avícola.",
    keywords:
      "eventos avícolas, ferias avicultura, congresos pollo, sector avícola, calendario eventos",
  },
  en: {
    title: "AgriCalendar - Poultry Industry Events Calendar",
    description:
      "Discover upcoming events, fairs and congresses in the global poultry sector. Your complete events calendar for poultry industry professionals.",
    keywords:
      "poultry events, poultry fairs, chicken congresses, poultry sector, events calendar",
  },
  pt: {
    title: "AgriCalendar - Calendário de Eventos do Setor Avícola",
    description:
      "Descubra os próximos eventos, feiras e congressos do setor avícola mundial. Seu calendário completo de eventos para profissionais da indústria avícola.",
    keywords:
      "eventos avícolas, feiras avicultura, congressos frango, setor avícola, calendário eventos",
  },
  vi: {
    title: "AgriCalendar - Lịch Sự Kiện Ngành Gia Cầm",
    description:
      "Khám phá các sự kiện, hội chợ và hội nghị sắp tới trong ngành gia cầm toàn cầu. Lịch sự kiện hoàn chỉnh cho các chuyên gia ngành gia cầm.",
    keywords:
      "sự kiện gia cầm, hội chợ gia cầm, hội nghị gà, ngành gia cầm, lịch sự kiện",
  },
  th: {
    title: "AgriCalendar - ปฏิทินกิจกรรมอุตสาหกรรมสัตว์ปีก",
    description:
      "ค้นพบกิจกรรม งานแสดงสินค้า และการประชุมที่จะเกิดขึ้นในภาคอุตสาหกรรมสัตว์ปีกระดับโลก ปฏิทินกิจกรรมที่สมบูรณ์สำหรับผู้เชี่ยวชาญในอุตสาหกรรมสัตว์ปีก",
    keywords:
      "กิจกรรมสัตว์ปีก, งานแสดงสินค้าสัตว์ปีก, การประชุมไก่, ภาคสัตว์ปีก, ปฏิทินกิจกรรม",
  },
  id: {
    title: "AgriCalendar - Kalender Acara Industri Unggas",
    description:
      "Temukan acara, pameran, dan kongres mendatang di sektor unggas global. Kalender acara lengkap Anda untuk profesional industri unggas.",
    keywords:
      "acara unggas, pameran unggas, kongres ayam, sektor unggas, kalender acara",
  },
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://agricalendar.net";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const translations = METADATA_TRANSLATIONS[lang] || METADATA_TRANSLATIONS.es;

  return {
    title: translations.title,
    description: translations.description,
    keywords: translations.keywords,
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages: {
        es: `${BASE_URL}/es`,
        en: `${BASE_URL}/en`,
        pt: `${BASE_URL}/pt`,
        vi: `${BASE_URL}/vi`,
        th: `${BASE_URL}/th`,
        id: `${BASE_URL}/id`,
      },
    },
    openGraph: {
      title: translations.title,
      description: translations.description,
      url: `${BASE_URL}/${lang}`,
      siteName: "AgriCalendar",
      locale:
        lang === "es"
          ? "es_ES"
          : lang === "en"
            ? "en_US"
            : lang === "pt"
              ? "pt_BR"
              : lang === "vi"
                ? "vi_VN"
                : lang === "th"
                  ? "th_TH"
                  : "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: translations.title,
      description: translations.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function LangLayout({ children }: LangLayoutProps) {
  return <>{children}</>;
}
