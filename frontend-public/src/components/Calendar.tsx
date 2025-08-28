"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Event } from "@/lib/api";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useLanguage } from "@/context/useLanguage";
import { getEventImageUrl } from "@/lib/imageUtils";

interface CalendarProps {
  events: Event[];
}

export default function Calendar({ events }: CalendarProps) {
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [isCalendarReady, setIsCalendarReady] = useState(false);
  const { t, language } = useLanguage();
  const calendarRef = useRef<FullCalendar>(null);

  // Mapeo de idiomas a rutas
  const LANGUAGE_ROUTES: Record<string, string> = {
    es: "eventos",
    en: "events",
    pt: "eventos",
    vi: "su-kien",
    th: "events",
    id: "acara",
  };

  const currentRoute = LANGUAGE_ROUTES[language] || "events";

  // Convertir eventos al formato de FullCalendar
  const calendarEvents = useMemo(() => {
    return events.map((event) => ({
      id: event.id.toString(),
      title: event.name,
      start: event.startDate,
      end: event.endDate || undefined,
      url: `/${language}/${currentRoute}/${event.slug}`,
      backgroundColor: event.color || "#10B981",
      borderColor: event.color || "#10B981",
      textColor: "#ffffff",
      extendedProps: {
        description: event.description,
        location: event.location,
        tipo: event.tipo,
        website: event.website,
        registro: event.registro,
        state: event.state,
        region: event.region,
        startTime: event.startTime,
        endTime: event.endTime,
        image: event.image,
      },
    }));
  }, [events, language, currentRoute]);

  const handleEventClick = (clickInfo: any) => {
    // Prevenir navegación automática para manejarla manualmente
    clickInfo.jsEvent.preventDefault();

    // Navegar en la misma ventana
    if (clickInfo.event.url) {
      window.location.href = clickInfo.event.url;
    }
  };

  const handleViewChange = useCallback(
    (view: string) => {
      console.log("Changing view to:", view); // Debug log

      setCurrentView(view);

      // Cambiar la vista del calendario usando la referencia
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi && isCalendarReady) {
        console.log("Calendar API available, changing view"); // Debug log
        try {
          calendarApi.changeView(view);
        } catch (error) {
          console.error("Error changing calendar view:", error);
        }
      } else {
        console.error("Calendar API not available or not ready"); // Debug log
      }
    },
    [isCalendarReady]
  );

  // Efecto para asegurar que el calendario esté listo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCalendarReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Controles del calendario */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {t("calendar.title")}
          </h2>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleViewChange("dayGridMonth")}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === "dayGridMonth"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {t("calendar.viewMonth")}
            </button>
            <button
              onClick={() => handleViewChange("timeGridWeek")}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === "timeGridWeek"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {t("calendar.viewWeek")}
            </button>
            <button
              onClick={() => handleViewChange("listMonth")}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === "listMonth"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {t("calendar.viewList")}
            </button>
          </div>
        </div>
      </div>

      {/* FullCalendar */}
      <div className="p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          initialView={currentView}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          eventContent={(eventInfo) => {
            const event = eventInfo.event;
            const image = event.extendedProps.image;
            const imageUrl = getEventImageUrl(image);

            return (
              <div className="p-1 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={event.title}
                      className="w-5 h-5 rounded object-cover flex-shrink-0"
                      onError={(e) => {
                        // Ocultar imagen si no se puede cargar
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <div className="font-medium text-xs truncate">
                    {event.title}
                  </div>
                </div>
                {event.extendedProps.location && (
                  <div className="text-xs opacity-90 truncate">
                    📍 {event.extendedProps.location}
                  </div>
                )}
                {event.extendedProps.tipo && (
                  <div className="text-xs opacity-75 truncate">
                    {t(`eventTypes.${event.extendedProps.tipo}`) !==
                    `eventTypes.${event.extendedProps.tipo}`
                      ? t(`eventTypes.${event.extendedProps.tipo}`)
                      : event.extendedProps.tipo}
                  </div>
                )}
              </div>
            );
          }}
          eventClassNames="hover:opacity-80 transition-opacity"
          viewDidMount={(info) => {
            console.log("View mounted:", info.view.type); // Debug log
            setCurrentView(info.view.type);
            setIsCalendarReady(true);
          }}
          viewWillUnmount={(info) => {
            console.log("View will unmount:", info.view.type); // Debug log
          }}
          datesSet={(info) => {
            console.log("Dates set for view:", info.view.type); // Debug log
            setCurrentView(info.view.type);
          }}
        />
      </div>
    </div>
  );
}
