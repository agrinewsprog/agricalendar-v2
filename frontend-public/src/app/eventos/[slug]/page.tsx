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
import { notFound } from "next/navigation";
import { useLanguage } from "@/context/useLanguage";
import { useState, useEffect } from "react";

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function EventPage({ params }: EventPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(
    null
  );
  const {
    language,
    setLanguage,
    t,
    loading: translationsLoading,
  } = useLanguage();

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setResolvedParams(resolved);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    async function getEvent() {
      if (!resolvedParams) return;

      try {
        setLoading(true);
        setError(null);
        const response = await eventsService.getBySlug(
          resolvedParams.slug,
          language
        );
        if (response.success) {
          setEvent(response.data);
        } else {
          setError("Evento no encontrado");
        }
      } catch (err) {
        console.error("Error loading event:", err);
        setError("Error al cargar el evento");
      } finally {
        setLoading(false);
      }
    }

    getEvent();
  }, [resolvedParams, language]);

  if (loading || translationsLoading) {
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
            href="/"
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
  const imageUrl = getEventImageUrl(event.image);

  // Debug temporal
  console.log("Event image field:", event.image);
  console.log("Generated imageUrl:", imageUrl);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
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

              {/* Selector de idiomas */}
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
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
              <div className="flex flex-col lg:flex-row gap-8 mb-6">
                {/* Event Image */}
                <div className="lg:w-1/3">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={event.name}
                      className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        console.log("Error loading image:", imageUrl);
                        // Reemplazar con placeholder en caso de error
                        const target = e.target as HTMLImageElement;
                        const parent = target.parentElement!;
                        parent.innerHTML = `
                          <div class="w-full h-64 lg:h-80 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg shadow-md flex items-center justify-center">
                            <div class="text-center text-white">
                              <div class="w-16 h-16 mx-auto mb-4 opacity-70 flex items-center justify-center">
                                <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                </svg>
                              </div>
                              <p class="text-lg font-medium opacity-90">${
                                event.tipo || "Evento"
                              }</p>
                            </div>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 lg:h-80 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg shadow-md flex items-center justify-center">
                      <div className="text-center text-white">
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-70" />
                        <p className="text-lg font-medium opacity-90">
                          {event.tipo || "Evento"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Event Info */}
                <div className="flex-1 lg:w-2/3">
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
                    {event.name}
                  </h1>

                  {event.description && (
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {event.description}
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
                      <p className="text-gray-600">{event.location}</p>
                      {event.address && (
                        <p className="text-sm text-gray-500">{event.address}</p>
                      )}
                      {event.state && (
                        <p className="text-sm text-gray-500">
                          {event.state}
                          {event.region && `, ${event.region}`}
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
                      <p className="text-gray-600">{event.registro}</p>
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

                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium">
                  {t("eventDetails.shareEvent")}
                </button>

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
                      {event.description || t("eventDetails.noAdditionalInfo")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Organizer Info */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {t("eventDetails.organizerInfo")}
                  </h3>
                  <div className="space-y-3">
                    {event.organizerName && (
                      <p className="text-gray-600">
                        <span className="font-medium">
                          {t("eventDetails.organizerName")}:
                        </span>{" "}
                        {event.organizerName}
                      </p>
                    )}
                    {event.organizerEmail && (
                      <p className="text-gray-600">
                        <span className="font-medium">
                          {t("eventDetails.organizerEmail")}:
                        </span>{" "}
                        <a
                          href={`mailto:${event.organizerEmail}`}
                          className="text-blue-600 hover:underline"
                        >
                          {event.organizerEmail}
                        </a>
                      </p>
                    )}
                    {event.organizerPhone && (
                      <p className="text-gray-600">
                        <span className="font-medium">
                          {t("eventDetails.organizerPhone")}:
                        </span>{" "}
                        <a
                          href={`tel:${event.organizerPhone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {event.organizerPhone}
                        </a>
                      </p>
                    )}
                    {!event.organizerName &&
                      !event.organizerEmail &&
                      !event.organizerPhone && (
                        <div>
                          <p className="text-gray-600">
                            <span className="font-medium">
                              {t("eventDetails.createdBy")}:
                            </span>{" "}
                            {event.user.name}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">
                              {t("eventDetails.username")}:
                            </span>{" "}
                            @{event.user.username}
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {/* Registration Info */}
                {event.registrationRequired && (
                  <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-4">
                      {t("eventDetails.registrationInfo")}
                    </h3>
                    <div className="space-y-3">
                      <p className="text-blue-800">
                        <span className="font-medium">
                          ✓ {t("eventDetails.registrationRequired")}
                        </span>
                      </p>
                      {event.maxAttendees && (
                        <p className="text-blue-700">
                          <span className="font-medium">
                            {t("eventDetails.maxAttendees")}:
                          </span>{" "}
                          {event.maxAttendees} {t("eventDetails.people")}
                        </p>
                      )}
                      {event.registrationDeadline && (
                        <p className="text-blue-700">
                          <span className="font-medium">
                            {t("eventDetails.registrationDeadline")}:
                          </span>{" "}
                          {new Date(
                            event.registrationDeadline
                          ).toLocaleDateString()}
                        </p>
                      )}
                      {event.registro && (
                        <div className="mt-4 p-3 bg-blue-100 rounded-md">
                          <p className="text-blue-800 text-sm">
                            {event.registro}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Event Tags */}
                {event.tags && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {t("eventDetails.eventTags")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.split(",").map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
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
    </>
  );
}
