import {
  eventsService,
  languagesService,
  type Event,
  type Language,
} from "@/lib/api";
import { formatDateRange } from "@/lib/utils";
import { Calendar, MapPin, Clock, ExternalLink, Globe } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  let events: Event[] = [];
  let languages: Language[] = [];
  let error: string | null = null;

  try {
    const [eventsResponse, languagesResponse] = await Promise.all([
      eventsService.getAll({ limit: 50 }),
      languagesService.getAll(),
    ]);

    if (eventsResponse.success) {
      events = eventsResponse.data;
    }

    if (languagesResponse.success) {
      languages = languagesResponse.data;
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    error = "Error al cargar los eventos";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="text-green-600" />
                AgriCalendar
              </h1>
              <p className="text-gray-600 mt-1">
                Calendario de eventos del sector avícola
              </p>
            </div>

            {/* Selector de idiomas */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select className="border rounded-md px-3 py-1 text-sm">
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900">
                  Total Eventos
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {events.length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900">
                  Próximos Eventos
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {
                    events.filter(
                      (event) => new Date(event.startDate) > new Date()
                    ).length
                  }
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900">Países</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {new Set(events.map((e) => e.region)).size}
                </p>
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Próximos Eventos
                </h2>
                <div className="flex gap-2">
                  <select className="border rounded-md px-3 py-2 text-sm">
                    <option value="">Todos los tipos</option>
                    <option value="Feria">Ferias</option>
                    <option value="Congreso">Congresos</option>
                    <option value="Workshop">Workshops</option>
                  </select>
                  <select className="border rounded-md px-3 py-2 text-sm">
                    <option value="">Todas las regiones</option>
                    <option value="Europa">Europa</option>
                    <option value="América">América</option>
                    <option value="Asia">Asia</option>
                  </select>
                </div>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay eventos disponibles
                  </h3>
                  <p className="text-gray-500">
                    Vuelve pronto para ver los próximos eventos del sector
                    avícola
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 AgriCalendar. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const isUpcoming = new Date(event.startDate) > new Date();

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: event.color || "#10B981" }}
              />
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {event.tipo}
              </span>
              {isUpcoming && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  Próximamente
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              <Link
                href={`/eventos/${event.slug}`}
                className="hover:text-green-600 transition-colors"
              >
                {event.name}
              </Link>
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDateRange(event.startDate, event.endDate)}
              </div>

              {event.startTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {event.startTime}
                  {event.endTime && ` - ${event.endTime}`}
                </div>
              )}

              {event.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <Link
              href={`/eventos/${event.slug}`}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Ver Detalles
            </Link>

            {event.website && (
              <a
                href={event.website}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                Sitio Web
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
