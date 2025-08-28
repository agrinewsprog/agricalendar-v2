"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { eventsService, type Event } from "@/lib/api";
import {
  Plus,
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MapPin,
  User,
  Clock,
  Languages,
} from "lucide-react";
import Link from "next/link";
import TranslationModal from "@/components/TranslationModal";
import {
  createAdminRoute,
  createAdminRouteWithBasePath,
  ADMIN_ROUTES,
} from "@/lib/adminRoutes";
import { getEventImageUrl } from "@/lib/imageUtils";

// Opciones para filtros
const STATUS_OPTIONS = [
  { value: "ALL", label: "Todos los estados" },
  { value: "DRAFT", label: "Borrador" },
  { value: "PUBLISHED", label: "Publicado" },
  { value: "ARCHIVED", label: "Archivado" },
  { value: "CANCELLED", label: "Cancelado" },
];

const TIPO_OPTIONS = [
  { value: "ALL", label: "Todos los tipos" },
  { value: "conferencia", label: "Conferencia" },
  { value: "taller", label: "Taller" },
  { value: "seminario", label: "Seminario" },
  { value: "webinar", label: "Webinar" },
  { value: "feria", label: "Feria" },
  { value: "exposicion", label: "Exposición" },
  { value: "curso", label: "Curso" },
  { value: "congreso", label: "Congreso" },
];

const REGION_OPTIONS = [
  { value: "ALL", label: "Todas las regiones" },
  { value: "nacional", label: "Nacional" },
  { value: "internacional", label: "Internacional" },
  { value: "europa", label: "Europa" },
  { value: "america", label: "América" },
  { value: "asia", label: "Asia" },
  { value: "africa", label: "África" },
  { value: "oceania", label: "Oceanía" },
];

interface Filters {
  search: string;
  status: string;
  tipo: string;
  region: string;
  startDate: string;
  endDate: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "ALL",
    tipo: "ALL",
    region: "ALL",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [totalEvents, setTotalEvents] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    event: Event | null;
  }>({
    show: false,
    event: null,
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [translationModal, setTranslationModal] = useState<{
    show: boolean;
    event: Event | null;
  }>({
    show: false,
    event: null,
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        limit: 50,
        offset: 0,
      };

      // Agregar filtros solo si no son 'ALL' o están vacíos
      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }
      if (filters.status && filters.status !== "ALL") {
        params.status = filters.status;
      }
      if (filters.tipo && filters.tipo !== "ALL") {
        params.tipo = filters.tipo;
      }
      if (filters.region && filters.region !== "ALL") {
        params.region = filters.region;
      }
      if (filters.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      const response = await eventsService.getAdminEvents(params);

      if (response.success && response.data) {
        setEvents(response.data);
        setTotalEvents(response.data.length);
      } else {
        setError("Error al cargar eventos");
      }
    } catch (err) {
      console.error("Error loading events:", err);
      setError("Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "ALL",
      tipo: "ALL",
      region: "ALL",
      startDate: "",
      endDate: "",
    });
  };

  const getStatusBadge = (status: Event["status"]) => {
    const styles = {
      DRAFT: "bg-gray-100 text-gray-800",
      PUBLISHED: "bg-green-100 text-green-800",
      ARCHIVED: "bg-yellow-100 text-yellow-800",
      CANCELLED: "bg-red-100 text-red-800",
    };

    const labels = {
      DRAFT: "Borrador",
      PUBLISHED: "Publicado",
      ARCHIVED: "Archivado",
      CANCELLED: "Cancelado",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Función para ver evento (navegar a página de detalle)
  const handleViewEvent = (event: Event) => {
    // Por ahora abrimos en nueva pestaña el calendario público
    window.open(`http://localhost:3000/events/${event.slug}`, "_blank");
  };

  // Función para editar evento
  const handleEditEvent = (event: Event) => {
    // Navegar a página de edición
    window.location.href = `/dashboard/events/edit/${event.id}`;
  };

  // Función para confirmar eliminación
  const handleDeleteConfirm = (event: Event) => {
    setDeleteModal({ show: true, event });
  };

  // Función para eliminar evento
  const handleDeleteEvent = async () => {
    if (!deleteModal.event) return;

    try {
      setActionLoading(deleteModal.event.id);
      const response = await eventsService.delete(deleteModal.event.id);

      if (response.success) {
        // Actualizar lista de eventos
        setEvents(events.filter((e) => e.id !== deleteModal.event!.id));
        setTotalEvents((prev) => prev - 1);
        setDeleteModal({ show: false, event: null });

        // Mostrar mensaje de éxito (aquí podrías usar un toast)
        alert("Evento eliminado exitosamente");
      } else {
        alert("Error al eliminar evento");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error al eliminar evento");
    } finally {
      setActionLoading(null);
    }
  };

  // Función para cambiar estado rápidamente
  const handleChangeStatus = async (
    event: Event,
    newStatus: Event["status"]
  ) => {
    try {
      setActionLoading(event.id);
      const response = await eventsService.updateStatus(event.id, newStatus);

      if (response.success) {
        // Actualizar el evento en la lista
        setEvents(
          events.map((e) =>
            e.id === event.id ? { ...e, status: newStatus } : e
          )
        );

        // Mostrar mensaje de éxito
        alert("Estado actualizado exitosamente");
      } else {
        alert("Error al actualizar estado");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error al actualizar estado");
    } finally {
      setActionLoading(null);
    }
  };

  // Función para abrir modal de traducciones
  const handleTranslateEvent = (event: Event) => {
    setTranslationModal({ show: true, event });
  };

  // Función para cerrar modal de traducciones
  const handleCloseTranslationModal = () => {
    setTranslationModal({ show: false, event: null });
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
              <p className="text-gray-600">
                Gestiona todos los eventos del calendario ({totalEvents}{" "}
                eventos)
              </p>
            </div>
            <Link
              href={createAdminRoute(ADMIN_ROUTES.EVENTS_CREATE)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nuevo Evento
            </Link>
          </div>

          {/* Filtros */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Búsqueda */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar eventos..."
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    />
                  </div>

                  {/* Botón de filtros */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                      showFilters
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                    Filtros
                    {Object.values(filters).some((f) => f && f !== "ALL") && (
                      <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-1">
                        {
                          Object.values(filters).filter((f) => f && f !== "ALL")
                            .length
                        }
                      </span>
                    )}
                  </button>
                </div>

                {/* Botón limpiar filtros */}
                {Object.values(filters).some((f) => f && f !== "ALL") && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 ml-4"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              {/* Panel de filtros expandible */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Estado */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tipo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <select
                        value={filters.tipo}
                        onChange={(e) =>
                          handleFilterChange("tipo", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {TIPO_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Región */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Región
                      </label>
                      <select
                        value={filters.region}
                        onChange={(e) =>
                          handleFilterChange("region", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {REGION_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Fecha desde */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha desde
                      </label>
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) =>
                          handleFilterChange("startDate", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Fecha hasta */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha hasta
                      </label>
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) =>
                          handleFilterChange("endDate", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lista de eventos */}
          <div className="bg-white shadow rounded-lg">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error al cargar eventos
                    </h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                    <button
                      onClick={loadEvents}
                      className="mt-2 text-sm text-red-800 hover:text-red-900 font-medium"
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay eventos
                </h3>
                <p className="text-gray-600 mb-4">
                  {Object.values(filters).some((f) => f && f !== "ALL")
                    ? "No se encontraron eventos con los filtros aplicados."
                    : "Aún no has creado ningún evento."}
                </p>
                <Link
                  href={createAdminRoute(ADMIN_ROUTES.EVENTS_CREATE)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Crear primer evento
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Imagen del evento */}
                          {event.image && (
                            <div className="flex-shrink-0">
                              <img
                                src={getEventImageUrl(event.image) || ""}
                                alt={event.name}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  // Ocultar imagen si no se puede cargar
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            </div>
                          )}

                          {/* Información del evento */}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {event.name}
                            </h3>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(event.startDate)}
                                {event.endDate &&
                                  ` - ${formatDate(event.endDate)}`}
                              </div>

                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </div>
                              )}

                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {event.user.name}
                              </div>

                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDate(event.createdAt)}
                              </div>
                            </div>

                            {event.description && (
                              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                {event.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2">
                              {getStatusBadge(event.status)}

                              {event.tipo && (
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  {event.tipo}
                                </span>
                              )}

                              {event.region && (
                                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                  {event.region}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Ver evento"
                          disabled={actionLoading === event.id}
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                          title="Editar evento"
                          disabled={actionLoading === event.id}
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleTranslateEvent(event)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Gestionar traducciones"
                          disabled={actionLoading === event.id}
                        >
                          <Languages className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteConfirm(event)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Eliminar evento"
                          disabled={actionLoading === event.id}
                        >
                          {actionLoading === event.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>

                        {/* Dropdown para cambiar estado */}
                        <div className="relative">
                          <select
                            value={event.status}
                            onChange={(e) =>
                              handleChangeStatus(
                                event,
                                e.target.value as Event["status"]
                              )
                            }
                            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                            disabled={actionLoading === event.id}
                          >
                            <option value="DRAFT">Borrador</option>
                            <option value="PUBLISHED">Publicado</option>
                            <option value="ARCHIVED">Archivado</option>
                            <option value="CANCELLED">Cancelado</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal de confirmación de eliminación */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-2">
                  Eliminar evento
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    ¿Estás seguro de que quieres eliminar el evento "
                    {deleteModal.event?.name}"? Esta acción no se puede
                    deshacer.
                  </p>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => setDeleteModal({ show: false, event: null })}
                    className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteEvent}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === deleteModal.event?.id ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Eliminando...
                      </div>
                    ) : (
                      "Eliminar"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de gestión de traducciones */}
        {translationModal.show && translationModal.event && (
          <TranslationModal
            event={translationModal.event as any}
            isOpen={translationModal.show}
            onClose={handleCloseTranslationModal}
            onSave={async () => {
              // Recargar eventos para reflejar cambios
              await loadEvents();
              handleCloseTranslationModal();
            }}
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
