"use client";

import { eventsService, type Event } from "@/lib/api";
import { formatDateRange } from "@/lib/utils";
import { getEventImageUrl } from "@/lib/imageUtils";
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  ArrowLeft,
  Globe,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/useLanguage";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Función para arreglar texto mal codificado
const fixEncoding = (text: string): string => {
  if (!text) return text;

  try {
    // Intenta decodificar si está mal codificado
    return decodeURIComponent(escape(text));
  } catch {
    // Si falla, aplica correcciones manuales básicas
    return text
      .replace(/Ã¡/g, "á")
      .replace(/Ã©/g, "é")
      .replace(/Ã­/g, "í")
      .replace(/Ã³/g, "ó")
      .replace(/Ãº/g, "ú")
      .replace(/Ã±/g, "ñ")
      .replace(/Ã§/g, "ç")
      .replace(/Âº/g, "º")
      .replace(/Âª/g, "ª")
      .replace(/Â°/g, "°");
  }
};

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

export default function EventPageClient({ params }: EventPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{
    lang: string;
    route: string;
    slug: string;
  } | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    language,
    setLanguage,
    t,
    loading: translationsLoading,
  } = useLanguage();

  // Resolver los params de forma asíncrona
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Sincronizar el idioma de la URL con el contexto
  useEffect(() => {
    if (resolvedParams && resolvedParams.lang !== language) {
      setLanguage(resolvedParams.lang as any);
    }
  }, [resolvedParams, language, setLanguage]);

  useEffect(() => {
    if (!resolvedParams) return;

    async function getEvent() {
      try {
        setLoading(true);
        setError(null);
        const response = await eventsService.getBySlug(
          resolvedParams!.slug,
          resolvedParams!.lang
        );
        if (response.success) {
          setEvent(response.data);
        } else {
          setError(response.error || "Evento no encontrado");
        }
      } catch (err: any) {
        console.error("Error loading event:", err);
        // Solo mostrar error si no es 404
        if (err.response?.status !== 404) {
          setError("Error al cargar el evento");
        } else {
          setError("Evento no encontrado");
        }
      } finally {
        setLoading(false);
      }
    }

    getEvent();
  }, [resolvedParams]);

  // Función para cambiar idioma y redirigir
  const handleLanguageChange = (newLang: string) => {
    if (!resolvedParams) return;
    const newRoute = LANGUAGE_ROUTES[newLang] || "events";
    router.push(`/${newLang}/${newRoute}/${resolvedParams.slug}`);
  };

  if (!resolvedParams || loading || translationsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-green-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("loading.title")}
          </h2>
          <p className="text-gray-600">{t("loading.subtitle")}</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("error.title")}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href={`/${language}`}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            {t("navigation.backToCalendar")}
          </Link>
        </div>
      </div>
    );
  }

  const isUpcoming = new Date(event.startDate) > new Date();
  const isPast = new Date(event.startDate) < new Date();
  const currentRoute = LANGUAGE_ROUTES[language] || "events";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/${language}`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("navigation.backToCalendar")}
              </Link>
              <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                <Calendar className="text-green-600" />
                {t("header.title")}
              </div>
            </div>

            {/* Selector de idiomas con redireccionamiento */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="border rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇺🇸 English</option>
                <option value="pt">🇧🇷 Português</option>
                <option value="vi">🇻🇳 Tiếng Việt</option>
                <option value="th">🇹🇭 ไทย</option>
                <option value="id">🇮🇩 Bahasa Indonesia</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Event Header */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            {/* Event Image - Full width at the top */}
            {event.image && (
              <div className="mb-8 -m-8 mb-8">
                <img
                  src={getEventImageUrl(event.image) || undefined}
                  alt={event.name}
                  className="w-full h-64 md:h-80 object-cover rounded-t-lg"
                  onError={(e) => {
                    // Ocultar imagen si no se puede cargar
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: event.color || "#10B981" }}
                  />
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {t(`eventTypes.${event.tipo}`) !==
                    `eventTypes.${event.tipo}`
                      ? t(`eventTypes.${event.tipo}`)
                      : event.tipo}
                  </span>
                  {isUpcoming && (
                    <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                      {t("events.upcomingBadge")}
                    </span>
                  )}
                  {isPast && (
                    <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                      {t("events.finishedBadge")}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {fixEncoding(event.name)}
                </h1>

                {event.description && (
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {fixEncoding(event.description)}
                  </p>
                )}
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {t("eventDetails.dates")}
                  </h3>
                  <p className="text-gray-600">
                    {formatDateRange(event.startDate, event.endDate)}
                  </p>
                </div>
              </div>

              {(event.startTime || event.endTime) && (
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t("eventDetails.schedule")}
                    </h3>
                    <p className="text-gray-600">
                      {event.startTime && event.endTime
                        ? `${event.startTime} - ${event.endTime}`
                        : event.startTime || event.endTime}
                    </p>
                  </div>
                </div>
              )}

              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t("eventDetails.location")}
                    </h3>
                    <p className="text-gray-600">
                      {fixEncoding(event.location)}
                    </p>
                    {event.state && (
                      <p className="text-sm text-gray-500">
                        {fixEncoding(event.state || "")},{" "}
                        {fixEncoding(event.region || "")}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {event.registro && (
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t("eventDetails.registration")}
                    </h3>
                    <p className="text-gray-600">
                      {fixEncoding(event.registro)}
                    </p>
                  </div>
                </div>
              )}

              {event.language && (
                <div className="flex items-start gap-3">
                  <Globe className="w-6 h-6 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t("eventDetails.language")}
                    </h3>
                    <p className="text-gray-600">{event.language.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {event.website && (
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  {t("eventDetails.officialWebsite")}
                </a>
              )}

              <button className="border border-green-600 text-green-600 px-6 py-3 rounded-md hover:bg-green-50 transition-colors font-medium">
                {t("eventDetails.addToCalendar")}
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("eventDetails.information")}
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {event.description
                      ? fixEncoding(event.description)
                      : t("eventDetails.noAdditionalInfo")}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Organizer Info - Solo mostrar si hay información específica del organizador */}
              {(event.organizerName ||
                event.organizerEmail ||
                event.organizerPhone) && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {t("eventDetails.organizerInfo")}
                  </h3>
                  <div className="space-y-2">
                    {/* Mostrar organizador específico */}
                    {event.organizerName && (
                      <p className="text-gray-600">
                        <span className="font-medium">
                          {t("eventDetails.organizer")}:
                        </span>{" "}
                        {fixEncoding(event.organizerName)}
                      </p>
                    )}

                    {/* Email del organizador si existe */}
                    {event.organizerEmail && (
                      <p className="text-gray-600">
                        <span className="font-medium">
                          {t("eventDetails.email")}:
                        </span>{" "}
                        <a
                          href={`mailto:${event.organizerEmail}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {event.organizerEmail}
                        </a>
                      </p>
                    )}

                    {/* Teléfono del organizador si existe */}
                    {event.organizerPhone && (
                      <p className="text-gray-600">
                        <span className="font-medium">
                          {t("eventDetails.phone")}:
                        </span>{" "}
                        <a
                          href={`tel:${event.organizerPhone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {event.organizerPhone}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Related Events */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {t("eventDetails.relatedEvents")}
                </h3>
                <p className="text-gray-500 text-sm">
                  {t("eventDetails.relatedEventsComingSoon")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; 2025 {t("header.title")}. {t("footer.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}
