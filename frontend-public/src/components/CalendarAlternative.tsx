"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Event } from "@/lib/api";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useLanguage } from "@/context/useLanguage";

interface CalendarProps {
  events: Event[];
}

export default function CalendarAlternative({ events }: CalendarProps) {
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [forceRerender, setForceRerender] = useState(0);
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
      },
    }));
  }, [events, language, currentRoute]);

  const handleEventClick = (clickInfo: any) => {
    clickInfo.jsEvent.preventDefault();
    if (clickInfo.event.url) {
      window.location.href = clickInfo.event.url;
    }
  };

  // Enfoque alternativo: Forzar re-render completo del calendario
  const handleViewChange = useCallback((view: string) => {
    console.log("Alternative: Changing view to:", view);
    setCurrentView(view);
    // Forzar re-render del componente completo
    setForceRerender((prev) => prev + 1);
  }, []);

  // Configuración del calendario que cambia con la vista
  const calendarConfig = useMemo(
    () => ({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: currentView,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "",
      },
      events: calendarEvents,
      eventClick: handleEventClick,
      height: "auto",
      locale: language,
      firstDay: 1,
      eventDisplay: "block",
      dayMaxEvents: 3,
      moreLinkClick: "popover",
      eventTimeFormat: {
        hour: "2-digit" as const,
        minute: "2-digit" as const,
        hour12: false,
      },
      slotLabelFormat: {
        hour: "2-digit" as const,
        minute: "2-digit" as const,
        hour12: false,
      },
      buttonText: {
        today: t("calendar.today"),
        month: t("calendar.viewMonth"),
        week: t("calendar.viewWeek"),
        day: "Día",
        list: t("calendar.viewList"),
      },
      noEventsText: t("calendar.noEvents"),
      eventContent: (eventInfo: any) => {
        return (
          <div className="p-1 cursor-pointer">
            <div className="font-medium text-xs truncate">
              {eventInfo.event.title}
            </div>
            {eventInfo.event.extendedProps.location && (
              <div className="text-xs opacity-90 truncate">
                📍 {eventInfo.event.extendedProps.location}
              </div>
            )}
            {eventInfo.event.extendedProps.tipo && (
              <div className="text-xs opacity-75 truncate">
                {t(`eventTypes.${eventInfo.event.extendedProps.tipo}`) !==
                `eventTypes.${eventInfo.event.extendedProps.tipo}`
                  ? t(`eventTypes.${eventInfo.event.extendedProps.tipo}`)
                  : eventInfo.event.extendedProps.tipo}
              </div>
            )}
          </div>
        );
      },
      eventClassNames: "hover:opacity-80 transition-opacity",
      viewDidMount: (info: any) => {
        console.log("Alternative: View mounted:", info.view.type);
        setCurrentView(info.view.type);
      },
    }),
    [currentView, calendarEvents, handleEventClick, language, t]
  );

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

      {/* FullCalendar con re-render forzado */}
      <div className="p-4">
        <FullCalendar
          key={`calendar-${forceRerender}`} // Forzar re-render completo
          ref={calendarRef}
          {...calendarConfig}
        />
      </div>
    </div>
  );
}
