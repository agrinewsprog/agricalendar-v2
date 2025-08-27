"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import {
  eventsService,
  languagesService,
  type Event,
  type Language,
} from "@/lib/api";
import {
  Calendar,
  TrendingUp,
  Users,
  Globe,
  Clock,
  MapPin,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  formatDate,
  getStatusColor,
  getStatusText,
  truncateText,
} from "@/lib/utils";
import { createAdminRoute, ADMIN_ROUTES } from "@/lib/adminRoutes";

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    draftEvents: 0,
    upcomingEvents: 0,
    totalLanguages: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsResponse, languagesResponse] = await Promise.all([
        eventsService.getAll({ limit: 10 }),
        languagesService.getAll(),
      ]);

      if (eventsResponse.success) {
        setEvents(eventsResponse.data || []);

        // Calcular estadísticas
        const allEvents = eventsResponse.data || [];
        const published = allEvents.filter((e) => e.status === "PUBLISHED");
        const drafts = allEvents.filter((e) => e.status === "DRAFT");
        const upcoming = allEvents.filter(
          (e) => new Date(e.startDate) > new Date()
        );

        setStats({
          totalEvents: allEvents.length,
          publishedEvents: published.length,
          draftEvents: drafts.length,
          upcomingEvents: upcoming.length,
          totalLanguages: languagesResponse.data?.length || 0,
        });
      }

      if (languagesResponse.success) {
        setLanguages(languagesResponse.data || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bienvenido al Dashboard
            </h1>
            <p className="text-gray-600">
              Gestiona eventos del sector avícola desde aquí
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Eventos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? "..." : stats.totalEvents}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Publicados
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? "..." : stats.publishedEvents}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Próximos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? "..." : stats.upcomingEvents}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Idiomas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? "..." : stats.totalLanguages}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent events */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Eventos Recientes
                </h3>
                <a
                  href={createAdminRoute(ADMIN_ROUTES.EVENTS)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Ver todos
                </a>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-gray-200 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No hay eventos
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comienza creando tu primer evento.
                  </p>
                  <div className="mt-6">
                    <a
                      href={createAdminRoute(ADMIN_ROUTES.EVENTS_CREATE)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Calendar className="-ml-1 mr-2 h-5 w-5" />
                      Crear evento
                    </a>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {events.slice(0, 5).map((event) => (
                      <li key={event.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div
                              className="h-10 w-10 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: event.color || "#3B82F6",
                              }}
                            >
                              <Calendar className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {event.name}
                              </p>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  event.status
                                )}`}
                              >
                                {getStatusText(event.status)}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatDate(event.startDate)}
                              </span>
                              {event.location && (
                                <span className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {truncateText(event.location, 30)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <a
                              href={`/dashboard/events/${event.id}`}
                              className="text-gray-400 hover:text-gray-600"
                              title="Ver evento"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                            <a
                              href={`/dashboard/events/${event.id}/edit`}
                              className="text-blue-400 hover:text-blue-600"
                              title="Editar evento"
                            >
                              <Edit className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <a
                  href={createAdminRoute(ADMIN_ROUTES.EVENTS_CREATE)}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
                      <Calendar className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Crear Evento
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Añade un nuevo evento al calendario
                    </p>
                  </div>
                </a>

                <a
                  href={createAdminRoute(ADMIN_ROUTES.LANGUAGES)}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 ring-4 ring-white">
                      <Globe className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Gestionar Idiomas
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Configura idiomas disponibles
                    </p>
                  </div>
                </a>

                <a
                  href={createAdminRoute(ADMIN_ROUTES.STATS)}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
                      <TrendingUp className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Ver Estadísticas
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Analiza el rendimiento del sitio
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
