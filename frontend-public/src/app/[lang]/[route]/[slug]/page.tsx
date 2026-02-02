import { eventsService } from "@/lib/api";
import { Metadata } from "next";
import EventPageClient from "./EventPageClient";

interface EventPageProps {
  params: Promise<{
    lang: string;
    route: string;
    slug: string;
  }>;
}

// Mapeo de idiomas a rutas
const LANGUAGE_ROUTES: Record<string, string> = {
  es: "eventos",
  en: "events",
  pt: "eventos",
  vi: "su-kien",
  th: "events",
  id: "acara",
};

// Generar metadatos SEO dinámicos
export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  // Metadatos por defecto en caso de error
  const defaultMetadata: Metadata = {
    title: "Evento | AgriCalendar",
    description: "Calendario de eventos avícolas y agrícolas.",
    robots: {
      index: false, // No indexar páginas con errores
      follow: false,
    },
  };

  try {
    const response = await eventsService.getBySlug(
      resolvedParams.slug,
      resolvedParams.lang,
    );

    if (!response.success || !response.data) {
      return {
        title: "Evento no encontrado | AgriCalendar",
        description:
          "El evento que buscas no fue encontrado en nuestro calendario.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const event = response.data;
    const currentRoute = LANGUAGE_ROUTES[resolvedParams.lang] || "events";

    // Obtener metadatos SEO si existen
    const seoTitle = (event as any).seoTitle || event.name;
    const seoDescription =
      (event as any).seoDesc ||
      event.description ||
      `${event.name} - ${event.location || "Evento"}`;
    const seoKeywords =
      (event as any).keywords ||
      `${event.tipo || "evento"}, ${event.location || ""}, ${event.name}`
        .replace(/,\s*,/g, ",")
        .replace(/^,|,$/g, "");

    // Obtener la URL base del dominio
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://agricalendar.net"
        : "http://localhost:3000");

    // Procesar la imagen para URL absoluta
    const rawImage = (event as any).ogImage || event.image;
    const absoluteImageUrl = rawImage
      ? rawImage.startsWith("http")
        ? rawImage
        : `${baseUrl}/images/eventos/${rawImage}`
      : null;

    const eventUrl = `${baseUrl}/${resolvedParams.lang}/${resolvedParams.route}/${resolvedParams.slug}`;

    return {
      title: `${seoTitle} | AgriCalendar`,
      description: seoDescription,
      keywords: seoKeywords,
      alternates: {
        canonical: eventUrl,
        languages: {
          es: `${baseUrl}/es/eventos/${resolvedParams.slug}`,
          en: `${baseUrl}/en/events/${resolvedParams.slug}`,
          pt: `${baseUrl}/pt/eventos/${resolvedParams.slug}`,
          vi: `${baseUrl}/vi/su-kien/${resolvedParams.slug}`,
          th: `${baseUrl}/th/events/${resolvedParams.slug}`,
          id: `${baseUrl}/id/acara/${resolvedParams.slug}`,
        },
      },
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: eventUrl,
        siteName: "AgriCalendar",
        images: absoluteImageUrl
          ? [
              {
                url: absoluteImageUrl,
                width: 1200,
                height: 630,
                alt: event.name,
              },
            ]
          : [],
        locale: resolvedParams.lang,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: absoluteImageUrl ? [absoluteImageUrl] : [],
      },
      robots: "index, follow",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // En caso de error, retornar metadatos por defecto
    return defaultMetadata;
  }
}

// Generar datos estructurados JSON-LD para SEO
function generateStructuredData(event: any, params: any) {
  const eventUrl = `https://agricalendar.net/${params.lang}/${
    LANGUAGE_ROUTES[params.lang] || "events"
  }/${params.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    url: eventUrl,
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressRegion: event.state,
        addressCountry: event.region,
      },
    },
    organizer: {
      "@type": "Person",
      name: event.user.name,
      url: `https://agricalendar.net/user/${event.user.username}`,
    },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: event.image || "https://agricalendar.net/default-event-image.jpg",
    offers: event.website
      ? {
          "@type": "Offer",
          url: event.website,
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const resolvedParams = await params;

  // Obtener datos del evento para structured data con manejo de errores
  let structuredData = null;
  try {
    const response = await eventsService.getBySlug(
      resolvedParams.slug,
      resolvedParams.lang,
    );
    if (response.success && response.data) {
      structuredData = generateStructuredData(response.data, resolvedParams);
    }
  } catch (error) {
    console.error("Error generating structured data:", error);
    // No hacer nada, continuar sin structured data
  }

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      <EventPageClient params={Promise.resolve(resolvedParams)} />
    </>
  );
}
