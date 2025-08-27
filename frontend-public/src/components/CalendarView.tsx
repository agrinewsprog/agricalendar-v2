"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Event } from "@/lib/api";
import { formatDateRange } from "@/lib/utils";

interface CalendarViewProps {
  events: Event[];
  language: string;
  languageRoutes: Record<string, string>;
}

interface CalendarDay {
  date: Date;
  events: Event[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function CalendarView({
  events,
  language,
  languageRoutes,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Obtener el primer día del mes
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Obtener el primer día de la semana del calendario (puede ser del mes anterior)
  const firstDayOfCalendar = new Date(firstDayOfMonth);
  firstDayOfCalendar.setDate(
    firstDayOfCalendar.getDate() - firstDayOfCalendar.getDay()
  );

  // Obtener el último día de la semana del calendario (puede ser del mes siguiente)
  const lastDayOfCalendar = new Date(lastDayOfMonth);
  lastDayOfCalendar.setDate(
    lastDayOfCalendar.getDate() + (6 - lastDayOfCalendar.getDay())
  );

  // Generar array de días para el calendario
  const calendarDays: CalendarDay[] = [];
  const currentDateIter = new Date(firstDayOfCalendar);

  while (currentDateIter <= lastDayOfCalendar) {
    const dayEvents = events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
      return currentDateIter >= eventStart && currentDateIter <= eventEnd;
    });

    calendarDays.push({
      date: new Date(currentDateIter),
      events: dayEvents,
      isCurrentMonth: currentDateIter.getMonth() === currentDate.getMonth(),
      isToday: currentDateIter.toDateString() === new Date().toDateString(),
    });

    currentDateIter.setDate(currentDateIter.getDate() + 1);
  }

  // Navegar meses
  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header del calendario */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid del calendario */}
      <div className="p-6">
        {/* Nombres de los días */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[120px] p-2 border rounded-lg ${
                day.isCurrentMonth
                  ? "bg-white border-gray-200"
                  : "bg-gray-50 border-gray-100"
              } ${day.isToday ? "ring-2 ring-green-500 bg-green-50" : ""}`}
            >
              {/* Número del día */}
              <div
                className={`text-sm font-medium mb-1 ${
                  day.isCurrentMonth
                    ? day.isToday
                      ? "text-green-700"
                      : "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {day.date.getDate()}
              </div>

              {/* Eventos del día */}
              <div className="space-y-1">
                {day.events.slice(0, 3).map((event) => {
                  const currentRoute = languageRoutes[language] || "events";
                  return (
                    <Link
                      key={event.id}
                      href={`/${language}/${currentRoute}/${event.slug}`}
                      className="block"
                    >
                      <div
                        className="text-xs p-1 rounded text-white truncate hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: event.color || "#10B981" }}
                        title={event.name}
                      >
                        {event.name}
                      </div>
                    </Link>
                  );
                })}

                {/* Indicador de más eventos */}
                {day.events.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{day.events.length - 3} más
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de eventos del mes actual */}
      <div className="border-t p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Eventos de {monthNames[currentDate.getMonth()]}
        </h3>

        {events.filter((event) => {
          const eventDate = new Date(event.startDate);
          return (
            eventDate.getMonth() === currentDate.getMonth() &&
            eventDate.getFullYear() === currentDate.getFullYear()
          );
        }).length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No hay eventos este mes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events
              .filter((event) => {
                const eventDate = new Date(event.startDate);
                return (
                  eventDate.getMonth() === currentDate.getMonth() &&
                  eventDate.getFullYear() === currentDate.getFullYear()
                );
              })
              .sort(
                (a, b) =>
                  new Date(a.startDate).getTime() -
                  new Date(b.startDate).getTime()
              )
              .map((event) => {
                const currentRoute = languageRoutes[language] || "events";
                return (
                  <Link
                    key={event.id}
                    href={`/${language}/${currentRoute}/${event.slug}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: event.color || "#10B981" }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {event.name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDateRange(event.startDate, event.endDate)}
                          </span>
                        </div>
                        {(event.startTime || event.endTime) && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {event.startTime && event.endTime
                                ? `${event.startTime} - ${event.endTime}`
                                : event.startTime || event.endTime}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
