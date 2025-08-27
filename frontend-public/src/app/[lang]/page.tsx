"use client";

import { useState, useEffect } from "react";
import { Calendar, Globe, Search, Filter, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/useLanguage";
import { eventsService, type Event } from "@/lib/api";
import CalendarComponent from "@/components/Calendar";
import { formatDateRange } from "@/lib/utils";

interface HomePageProps {
  params: Promise<{
    lang: string;
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

export default function HomePage({ params }: HomePageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ lang: string } | null>(
    null
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [view, setView] = useState<"calendar" | "list">("calendar");

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

  // Cargar eventos
  useEffect(() => {
    if (!resolvedParams) return;

    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);
        const response = await eventsService.getAll({
          language: resolvedParams!.lang,
        });
        if (response.success) {
          setEvents(response.data);
        } else {
          setError("Error al cargar los eventos");
        }
      } catch (err) {
        console.error("Error loading events:", err);
        setError("Error al cargar los eventos");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [resolvedParams]);

  // Función para cambiar idioma y redirigir
  const handleLanguageChange = (newLang: string) => {
    if (!resolvedParams) return;
    window.location.href = `/${newLang}`;
  };

  // Filtrar eventos
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.location &&
        event.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = !selectedType || event.tipo === selectedType;
    const matchesCountry = !selectedCountry || event.region === selectedCountry;

    return matchesSearch && matchesType && matchesCountry;
  });

  // Obtener tipos únicos de eventos
  const eventTypes = [
    ...new Set(events.map((event) => event.tipo).filter(Boolean)),
  ];
  const countries = [
    ...new Set(events.map((event) => event.region).filter(Boolean)),
  ];

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

  if (error) {
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
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            {t("error.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Calendar className="text-green-600" />
              {t("header.title")}
            </div>

            {/* Selector de idiomas */}
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

      {/* Search and Filters */}
      <section className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setView("calendar")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  view === "calendar"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t("navigation.calendarView")}
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  view === "list"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t("navigation.listView")}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
                  >
                    <option value="">{t("filters.allTypes")}</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type || ""}>
                        {t(`eventTypes.${type}`) !== `eventTypes.${type}`
                          ? t(`eventTypes.${type}`)
                          : type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
                  >
                    <option value="">{t("filters.allCountries")}</option>
                    {countries.map((country) => (
                      <option key={country} value={country || ""}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {view === "calendar" ? (
          <CalendarComponent events={filteredEvents} />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {t("events.listTitle")} ({filteredEvents.length})
              </h2>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {t("events.noEvents")}
                </h3>
                <p className="text-gray-500">
                  {t("events.noEventsDescription")}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => {
                  const currentRoute = LANGUAGE_ROUTES[language] || "events";
                  return (
                    <Link
                      key={event.id}
                      href={`/${language}/${currentRoute}/${event.slug}`}
                      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: event.color || "#10B981",
                              }}
                            />
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                              {t(`eventTypes.${event.tipo}`) !==
                              `eventTypes.${event.tipo}`
                                ? t(`eventTypes.${event.tipo}`)
                                : event.tipo}
                            </span>
                          </div>
                          {new Date(event.startDate) > new Date() && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                              {t("events.upcomingBadge")}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {event.name}
                        </h3>

                        {event.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {event.description}
                          </p>
                        )}

                        <div className="space-y-2 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDateRange(event.startDate, event.endDate)}
                            </span>
                          </div>

                          {(event.startTime || event.endTime) && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {event.startTime && event.endTime
                                  ? `${event.startTime} - ${event.endTime}`
                                  : event.startTime || event.endTime}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">
                              {event.location}
                              {event.state && `, ${event.state}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
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
