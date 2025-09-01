"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import SpeciesSelector from "@/components/SpeciesSelector";
import { eventsService, languagesService, type Event } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  createAdminRoute,
  createAdminRouteWithBasePath,
  ADMIN_ROUTES,
} from "@/lib/adminRoutes";

const eventSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  region: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  color: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "CANCELLED"]),
  languageId: z.string().min(1, "El idioma es requerido"),
  especieId: z.string().optional(),
  tipo: z.string().optional(),
  organizerName: z.string().optional(),
  organizerEmail: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  organizerPhone: z.string().optional(),
  maxAttendees: z.string().optional(),
  registrationRequired: z.boolean().optional(),
  registrationDeadline: z.string().optional(),
  tags: z.string().optional(),
  registro: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

const eventTypes = [
  "Conferencia",
  "Seminario",
  "Taller",
  "Congreso",
  "Exposición",
  "Webinar",
  "Feria",
  "Curso",
];

const eventColors = [
  "#3B82F6", // blue
  "#10B981", // green
  "#8B5CF6", // purple
  "#F59E0B", // amber
  "#EF4444", // red
  "#06B6D4", // cyan
];

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [autoColor, setAutoColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const watchColor = watch("color");
  const watchName = watch("name");
  const watchDescription = watch("description");
  const watchRegistrationRequired = watch("registrationRequired");

  useEffect(() => {
    if (eventId) {
      loadEvent();
      fetchLanguages();
    }
  }, [eventId]);

  // Auto-rellenar campos SEO basado en nombre y descripción
  useEffect(() => {
    if (watchName && !watch("seoTitle")) {
      setValue("seoTitle", watchName);
    }
  }, [watchName, setValue, watch]);

  useEffect(() => {
    if (watchDescription && !watch("seoDesc")) {
      // Limitar descripción SEO a 160 caracteres
      const truncatedDesc =
        watchDescription.length > 160
          ? watchDescription.substring(0, 157) + "..."
          : watchDescription;
      setValue("seoDesc", truncatedDesc);
    }
  }, [watchDescription, setValue, watch]);

  const fetchLanguages = async () => {
    try {
      const response = await languagesService.getAll();
      if (response.success && response.data) {
        setLanguages(response.data);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar que el ID sea un número válido
      const eventIdNum = parseInt(eventId);
      if (isNaN(eventIdNum) || eventIdNum <= 0) {
        setError("ID de evento inválido");
        return;
      }

      // Intentar primero el endpoint admin, si falla usar el público
      let response;
      try {
        response = await eventsService.getAdminEventById(eventIdNum);
      } catch (adminError) {
        console.log("Admin endpoint not available, trying public endpoint");
        try {
          response = await eventsService.getById(eventIdNum);
        } catch (publicError) {
          // Ambos endpoints fallaron - el evento no existe
          setError(
            `El evento con ID ${eventIdNum} no fue encontrado. Puede que haya sido eliminado.`
          );
          return;
        }
      }

      if (response.success && response.data) {
        const eventData = response.data;
        setEvent(eventData);

        // Formatear fechas para los inputs
        const startDate = eventData.startDate
          ? new Date(eventData.startDate).toISOString().split("T")[0]
          : "";
        const endDate = eventData.endDate
          ? new Date(eventData.endDate).toISOString().split("T")[0]
          : "";
        const registrationDeadline = eventData.registrationDeadline
          ? new Date(eventData.registrationDeadline).toISOString().split("T")[0]
          : "";

        // Convertir tags array a string si existe
        const tagsString = Array.isArray(eventData.tags)
          ? eventData.tags.join(", ")
          : eventData.tags || "";

        // Resetear el formulario con los datos del evento
        reset({
          name: eventData.name || "",
          description: eventData.description || "",
          startDate,
          endDate,
          startTime: eventData.startTime || "",
          endTime: eventData.endTime || "",
          location: eventData.location || "",
          address: eventData.address || "",
          state: eventData.state || "",
          region: eventData.region || "",
          website: eventData.website || "",
          color: eventData.color || eventColors[0],
          status: eventData.status || "DRAFT",
          languageId: eventData.languageId?.toString() || "",
          especieId: eventData.especieId?.toString() || "",
          tipo: eventData.tipo || "",
          organizerName: eventData.organizerName || "",
          organizerEmail: eventData.organizerEmail || "",
          organizerPhone: eventData.organizerPhone || "",
          maxAttendees: eventData.maxAttendees?.toString() || "",
          registrationRequired: eventData.registrationRequired || false,
          registrationDeadline,
          tags: tagsString,
          registro: eventData.registro || "",
          seoTitle: eventData.seoTitle || "",
          seoDesc: eventData.seoDesc || "",
        });

        // Set the auto color if species is selected
        if (eventData.especie?.color) {
          setAutoColor(eventData.especie.color);
        }
      } else {
        setError(`El evento con ID ${eventIdNum} no fue encontrado.`);
      }
    } catch (err) {
      console.error("Error loading event:", err);
      setError("Error inesperado al cargar el evento");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Validaciones de imagen
      if (file.size > 5 * 1024 * 1024) {
        // 5MB límite
        setMessage({
          type: "error",
          text: "La imagen no puede superar los 5MB",
        });
        e.target.value = "";
        setSelectedImage(null);
        return;
      }
      if (!file.type.startsWith("image/")) {
        setMessage({
          type: "error",
          text: "Solo se permiten archivos de imagen",
        });
        e.target.value = "";
        setSelectedImage(null);
        return;
      }
    }
  };

  const handleSpeciesChange = (
    especieId: number | undefined,
    color?: string
  ) => {
    if (especieId) {
      setValue("especieId", especieId.toString());
    } else {
      setValue("especieId", "");
    }

    if (color) {
      setValue("color", color);
      setAutoColor(color);
    } else {
      setValue("color", eventColors[0]);
      setAutoColor(null);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    if (!event) return;

    try {
      setSaving(true);
      setMessage(null);

      // Preparar los datos para enviar
      const updateData: any = {
        name: data.name,
        description: data.description || null,
        startDate: data.startDate,
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        location: data.location || null,
        address: data.address || null,
        state: data.state || null,
        region: data.region || null,
        website: data.website || null,
        color: data.color,
        status: data.status,
        languageId: parseInt(data.languageId),
        tipo: data.tipo || null,
        organizerName: data.organizerName || null,
        organizerEmail: data.organizerEmail || null,
        organizerPhone: data.organizerPhone || null,
        registrationRequired: data.registrationRequired,
        registro: data.registro || null,
        seoTitle: data.seoTitle || null,
        seoDesc: data.seoDesc || null,
      };

      // Manejar especieId - solo si tiene valor
      if (data.especieId && data.especieId.trim() !== "") {
        updateData.especieId = parseInt(data.especieId);
      } else {
        updateData.especieId = null;
      }

      // Manejar endDate - solo si tiene valor
      if (data.endDate && data.endDate.trim() !== "") {
        updateData.endDate = data.endDate;
      } else {
        updateData.endDate = null;
      }

      // Manejar maxAttendees - solo si tiene valor
      if (data.maxAttendees && data.maxAttendees.trim() !== "") {
        updateData.maxAttendees = parseInt(data.maxAttendees);
      } else {
        updateData.maxAttendees = null;
      }

      // Manejar registrationDeadline - solo si tiene valor válido
      if (
        data.registrationDeadline &&
        data.registrationDeadline.trim() !== ""
      ) {
        updateData.registrationDeadline = data.registrationDeadline;
      } else {
        updateData.registrationDeadline = null;
      }

      // Convertir tags string a array si hay tags
      if (data.tags && data.tags.trim()) {
        updateData.tags = data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      } else {
        updateData.tags = [];
      }

      const response = await eventsService.update(event.id, updateData);

      if (response.success) {
        setMessage({
          type: "success",
          text: "Evento actualizado exitosamente",
        });
        setTimeout(() => {
          router.push(createAdminRoute(ADMIN_ROUTES.EVENTS));
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: response.message || "Error al actualizar evento",
        });
      }
    } catch (err) {
      console.error("Error updating event:", err);
      setMessage({
        type: "error",
        text: "Error inesperado al actualizar evento",
      });
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
          <div className="flex items-center space-x-4">
            <Link
              href={createAdminRoute(ADMIN_ROUTES.EVENTS)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Editar Evento
              </h1>
              <p className="text-gray-600">Modificar: {event.name}</p>
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`rounded-md p-4 ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex">
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      message.type === "success"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información Básica */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Información Básica
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre del evento *
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Congreso Avícola Internacional 2024"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Descripción
                    </label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe el evento..."
                    />
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Idioma *
                    </label>
                    <select
                      {...register("languageId")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecciona un idioma</option>
                      {languages.map((language) => (
                        <option key={language.id} value={language.id}>
                          {language.name} ({language.code})
                        </option>
                      ))}
                    </select>
                    {errors.languageId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.languageId.message}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo de evento
                    </label>
                    <select
                      {...register("tipo")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecciona un tipo</option>
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Estado *
                    </label>
                    <select
                      {...register("status")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="DRAFT">Borrador</option>
                      <option value="PUBLISHED">Publicado</option>
                      <option value="ARCHIVED">Archivado</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </div>

                  {/* Species Selector */}
                  <div className="sm:col-span-2">
                    <SpeciesSelector
                      value={watch("especieId")}
                      onChange={handleSpeciesChange}
                      error={errors.especieId?.message}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Fechas y Horarios */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Fechas y Horarios
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha de inicio *
                    </label>
                    <input
                      type="date"
                      {...register("startDate")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha de finalización
                    </label>
                    <input
                      type="date"
                      {...register("endDate")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hora de inicio
                    </label>
                    <input
                      type="time"
                      {...register("startTime")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hora de finalización
                    </label>
                    <input
                      type="time"
                      {...register("endTime")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Ubicación
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Lugar/Venue
                    </label>
                    <input
                      type="text"
                      {...register("location")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Centro de Convenciones"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Dirección
                    </label>
                    <input
                      type="text"
                      {...register("address")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Av. Principal 123"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Estado/Provincia
                    </label>
                    <input
                      type="text"
                      {...register("state")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Madrid"
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      País/Región
                    </label>
                    <input
                      type="text"
                      {...register("region")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: España"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Organizador */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Información del Organizador
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Organizer Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre del organizador
                    </label>
                    <input
                      type="text"
                      {...register("organizerName")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>

                  {/* Organizer Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email del organizador
                    </label>
                    <input
                      type="email"
                      {...register("organizerEmail")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: juan@ejemplo.com"
                    />
                    {errors.organizerEmail && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.organizerEmail.message}
                      </p>
                    )}
                  </div>

                  {/* Organizer Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Teléfono del organizador
                    </label>
                    <input
                      type="tel"
                      {...register("organizerPhone")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: +34 123 456 789"
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sitio web del evento
                    </label>
                    <input
                      type="url"
                      {...register("website")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://ejemplo.com"
                    />
                    {errors.website && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.website.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Registro */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Información de Registro
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Registration Required */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register("registrationRequired")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Se requiere registro previo para este evento
                      </label>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Activa esta opción si los asistentes deben registrarse
                      antes del evento
                    </p>
                  </div>

                  {/* Campos condicionales que aparecen solo si se requiere registro */}
                  {watchRegistrationRequired && (
                    <>
                      {/* Max Attendees */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Máximo de asistentes
                        </label>
                        <input
                          type="number"
                          {...register("maxAttendees")}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ej: 500"
                          min="1"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Deja vacío si no hay límite
                        </p>
                      </div>

                      {/* Registration Deadline */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Fecha límite de registro
                        </label>
                        <input
                          type="date"
                          {...register("registrationDeadline")}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Fecha hasta la cual se pueden registrar asistentes
                        </p>
                      </div>

                      {/* Registro */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Información adicional de registro
                        </label>
                        <textarea
                          {...register("registro")}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Instrucciones adicionales sobre el proceso de registro, requisitos, documentos necesarios, etc."
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Información adicional que los asistentes deben conocer
                          sobre el registro
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* SEO y Contenido */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  SEO y Contenido
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Current Image */}
                  {event.image && (
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagen actual
                      </label>
                      <div className="relative">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    </div>
                  )}

                  {/* New Image */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {event.image
                        ? "Cambiar imagen del evento"
                        : "Imagen del evento"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {selectedImage && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600">
                          Nueva imagen seleccionada: {selectedImage.name} (
                          {(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Imagen principal del evento (recomendado: 1200x630px para
                      redes sociales, máximo 5MB)
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Etiquetas/Keywords
                    </label>
                    <input
                      type="text"
                      {...register("tags")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: avicultura, ganadería, agricultura, congreso, conferencia"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Separa las etiquetas con comas. Estas ayudan a categorizar
                      el evento y mejorar el SEO.
                    </p>
                  </div>

                  {/* SEO Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Título SEO
                    </label>
                    <input
                      type="text"
                      {...register("seoTitle")}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Título optimizado para motores de búsqueda"
                      maxLength={60}
                    />
                    <div className="mt-1 flex justify-between">
                      <p className="text-sm text-gray-500">
                        Título que aparecerá en los resultados de búsqueda
                      </p>
                      <p className="text-sm text-gray-400">
                        {watch("seoTitle")?.length || 0}/60
                      </p>
                    </div>
                  </div>

                  {/* SEO Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Descripción SEO
                    </label>
                    <textarea
                      {...register("seoDesc")}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Descripción optimizada para motores de búsqueda"
                      maxLength={160}
                    />
                    <div className="mt-1 flex justify-between">
                      <p className="text-sm text-gray-500">
                        Descripción que aparecerá en los resultados de búsqueda
                      </p>
                      <p className="text-sm text-gray-400">
                        {watch("seoDesc")?.length || 0}/160
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Link
                href={createAdminRoute(ADMIN_ROUTES.EVENTS)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Save className="-ml-1 mr-2 h-5 w-5" />
                    Actualizar evento
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
