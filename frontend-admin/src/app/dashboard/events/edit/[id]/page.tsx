"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { eventsService, type Event } from "@/lib/api";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  createAdminRoute,
  createAdminRouteWithBasePath,
  ADMIN_ROUTES,
} from "@/lib/adminRoutes";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsService.getById(parseInt(eventId));

      if (response.success && response.data) {
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
  };

  const handleSave = async () => {
    if (!event) return;

    try {
      setSaving(true);
      const response = await eventsService.update(event.id, {
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        address: event.address,
        tipo: event.tipo,
        region: event.region,
        website: event.website,
        organizerName: event.organizerName,
        organizerEmail: event.organizerEmail,
        organizerPhone: event.organizerPhone,
        maxAttendees: event.maxAttendees,
        registrationRequired: event.registrationRequired,
        registrationDeadline: event.registrationDeadline,
        status: event.status,
      });

      if (response.success) {
        alert("Evento actualizado exitosamente");
        window.location.href = createAdminRouteWithBasePath(
          ADMIN_ROUTES.EVENTS
        );
      } else {
        setError("Error al actualizar el evento");
      }
    } catch (err) {
      console.error("Error updating event:", err);
      setError("Error al actualizar el evento");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error || !event) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">
              {error || "Evento no encontrado"}
            </p>
            <Link
              href={createAdminRouteWithBasePath(ADMIN_ROUTES.EVENTS)}
              className="mt-3 inline-flex items-center text-sm text-red-800 hover:text-red-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver a eventos
            </Link>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={createAdminRouteWithBasePath(ADMIN_ROUTES.EVENTS)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Editar: {event.name}
              </h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>

          {/* Formulario */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Información del Evento
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del evento *
                  </label>
                  <input
                    type="text"
                    value={event.name}
                    onChange={(e) =>
                      setEvent({ ...event, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={event.status}
                    onChange={(e) =>
                      setEvent({
                        ...event,
                        status: e.target.value as Event["status"],
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="DRAFT">Borrador</option>
                    <option value="PUBLISHED">Publicado</option>
                    <option value="ARCHIVED">Archivado</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={event.description || ""}
                  onChange={(e) =>
                    setEvent({ ...event, description: e.target.value })
                  }
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de inicio *
                  </label>
                  <input
                    type="date"
                    value={
                      event.startDate
                        ? new Date(event.startDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEvent({ ...event, startDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de fin
                  </label>
                  <input
                    type="date"
                    value={
                      event.endDate
                        ? new Date(event.endDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEvent({ ...event, endDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Horarios */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de inicio
                  </label>
                  <input
                    type="time"
                    value={event.startTime || ""}
                    onChange={(e) =>
                      setEvent({ ...event, startTime: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de fin
                  </label>
                  <input
                    type="time"
                    value={event.endTime || ""}
                    onChange={(e) =>
                      setEvent({ ...event, endTime: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Ubicación */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={event.location || ""}
                    onChange={(e) =>
                      setEvent({ ...event, location: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={event.address || ""}
                    onChange={(e) =>
                      setEvent({ ...event, address: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Tipo y Región */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de evento
                  </label>
                  <select
                    value={event.tipo || ""}
                    onChange={(e) =>
                      setEvent({ ...event, tipo: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="conferencia">Conferencia</option>
                    <option value="taller">Taller</option>
                    <option value="seminario">Seminario</option>
                    <option value="webinar">Webinar</option>
                    <option value="feria">Feria</option>
                    <option value="exposicion">Exposición</option>
                    <option value="curso">Curso</option>
                    <option value="congreso">Congreso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Región
                  </label>
                  <select
                    value={event.region || ""}
                    onChange={(e) =>
                      setEvent({ ...event, region: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar región</option>
                    <option value="nacional">Nacional</option>
                    <option value="internacional">Internacional</option>
                    <option value="europa">Europa</option>
                    <option value="america">América</option>
                    <option value="asia">Asia</option>
                    <option value="africa">África</option>
                    <option value="oceania">Oceanía</option>
                  </select>
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sitio web
                </label>
                <input
                  type="url"
                  value={event.website || ""}
                  onChange={(e) =>
                    setEvent({ ...event, website: e.target.value })
                  }
                  placeholder="https://ejemplo.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
