import { eventsService } from "@/lib/api";
import { getEventImageUrl } from "@/lib/imageUtils";
import type { Metadata } from "next";

interface EventLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

// Función para obtener la URL base del dominio
const getBaseUrl = (): string => {
  // En producción usa el dominio real
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_BASE_URL || "https://agricalendar.net";
  }
  // En desarrollo usa localhost
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const response = await eventsService.getBySlug(resolvedParams.slug);

    if (!response.data) {
      return {
        title: "Evento no encontrado",
        description: "El evento solicitado no existe.",
      };
    }

    const event = response.data;
    const baseUrl = getBaseUrl();
    const eventUrl = `${baseUrl}/eventos/${event.slug}`;
    const imageUrl = event.image ? getEventImageUrl(event.image) : null;

    // Si la imagen es una URL relativa, convertirla a absoluta
    const absoluteImageUrl = imageUrl
      ? imageUrl.startsWith("http")
        ? imageUrl
        : `${baseUrl}${imageUrl}`
      : null;

    return {
      title: event.seoTitle || event.name || "Evento",
      description:
        event.seoDesc || event.description || `Evento: ${event.name}`,
      keywords: event.tags || undefined,
      robots: "index, follow",
      openGraph: {
        title: event.seoTitle || event.name,
        description:
          event.seoDesc || event.description || `Evento: ${event.name}`,
        url: eventUrl,
        type: "website",
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
        siteName: "AgriCalendar",
      },
      twitter: {
        card: "summary_large_image",
        title: event.seoTitle || event.name,
        description:
          event.seoDesc || event.description || `Evento: ${event.name}`,
        images: absoluteImageUrl ? [absoluteImageUrl] : [],
      },
      alternates: {
        canonical: eventUrl,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for event:", error);
    return {
      title: "Error al cargar evento",
      description: "Hubo un error al cargar la información del evento.",
    };
  }
}

export default function EventLayout({ children }: EventLayoutProps) {
  return <>{children}</>;
}
