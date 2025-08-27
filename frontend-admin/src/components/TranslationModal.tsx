"use client";

import { useState, useEffect } from "react";
import { X, Globe, Save, Eye, RotateCcw } from "lucide-react";

interface EventTranslation {
  id: number;
  eventId: number;
  languageId: number;
  name: string;
  description?: string;
  location?: string;
  slug: string;
  isAuto: boolean;
  language: {
    id: number;
    name: string;
    code: string;
  };
}

interface SeoMetadata {
  id: number;
  eventId: number;
  languageId: number;
  title: string;
  description: string;
  keywords?: string;
  language: {
    id: number;
    name: string;
    code: string;
  };
}

interface Event {
  id: number;
  name: string;
  description?: string;
  location?: string;
  slug: string;
  language: {
    id: number;
    name: string;
    code: string;
  };
  translations: EventTranslation[];
  seoMetadata: SeoMetadata[];
}

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onSave: (eventId: number, languageCode: string, data: any) => Promise<void>;
}

const SUPPORTED_LANGUAGES = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
];

export default function TranslationModal({
  isOpen,
  onClose,
  event,
  onSave,
}: TranslationModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    slug: "",
    seoTitle: "",
    seoDescription: "",
    keywords: "",
  });
  const [isLoading, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Resetear cuando se abre/cierra el modal o cambia el evento
  useEffect(() => {
    if (isOpen && event) {
      setSelectedLanguage("es");
      loadTranslationData("es");
    }
  }, [isOpen, event]);

  // Cargar datos de traducción para el idioma seleccionado
  const loadTranslationData = (languageCode: string) => {
    if (!event) return;

    // Buscar traducción existente
    const translation = event.translations.find(
      (t) => t.language.code === languageCode
    );

    // Buscar metadatos SEO existentes
    const seoData = event.seoMetadata.find(
      (s) => s.language.code === languageCode
    );

    if (translation) {
      // Usar datos de la traducción
      setFormData({
        name: translation.name || "",
        description: translation.description || "",
        location: translation.location || "",
        slug: translation.slug || "",
        seoTitle: seoData?.title || "",
        seoDescription: seoData?.description || "",
        keywords: seoData?.keywords || "",
      });
    } else if (languageCode === event.language.code) {
      // Usar datos originales del evento
      setFormData({
        name: event.name || "",
        description: event.description || "",
        location: event.location || "",
        slug: event.slug || "",
        seoTitle: "",
        seoDescription: "",
        keywords: "",
      });
    } else {
      // Limpiar formulario para nuevo idioma
      setFormData({
        name: "",
        description: "",
        location: "",
        slug: "",
        seoTitle: "",
        seoDescription: "",
        keywords: "",
      });
    }

    setHasChanges(false);
  };

  // Manejar cambio de idioma
  const handleLanguageChange = (languageCode: string) => {
    if (hasChanges) {
      if (
        !confirm(
          "Tienes cambios sin guardar. ¿Estás seguro de cambiar de idioma?"
        )
      ) {
        return;
      }
    }
    setSelectedLanguage(languageCode);
    loadTranslationData(languageCode);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  // Guardar traducción
  const handleSave = async () => {
    if (!event || !formData.name.trim()) {
      alert("El nombre del evento es requerido");
      return;
    }

    setSaving(true);
    try {
      await onSave(event.id, selectedLanguage, formData);
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving translation:", error);
      alert("Error al guardar la traducción");
    } finally {
      setSaving(false);
    }
  };

  // Generar slug automáticamente
  const generateSlug = () => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      handleInputChange("slug", slug);
    }
  };

  if (!isOpen || !event) return null;

  const currentTranslation = event.translations.find(
    (t) => t.language.code === selectedLanguage
  );
  const isOriginalLanguage = selectedLanguage === event.language.code;
  const isAutoTranslated = currentTranslation?.isAuto || false;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Gestionar Traducciones
              </h2>
              <p className="text-sm text-gray-600">{event.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar - Selector de idiomas */}
          <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Seleccionar Idioma
            </h3>
            <div className="space-y-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const translation = event.translations.find(
                  (t) => t.language.code === lang.code
                );
                const isOriginal = lang.code === event.language.code;
                const hasTranslation = !!translation || isOriginal;

                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      selectedLanguage === lang.code
                        ? "bg-blue-100 text-blue-900 border-2 border-blue-200"
                        : "bg-white hover:bg-gray-100 border-2 border-gray-200"
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{lang.name}</div>
                      <div className="text-xs text-gray-500">
                        {isOriginal && "(Original)"}
                        {!isOriginal && hasTranslation && (
                          <span
                            className={
                              translation?.isAuto
                                ? "text-orange-600"
                                : "text-green-600"
                            }
                          >
                            {translation?.isAuto ? "Auto" : "Manual"}
                          </span>
                        )}
                        {!isOriginal && !hasTranslation && (
                          <span className="text-gray-400">Sin traducir</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Header de idioma seleccionado */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {
                      SUPPORTED_LANGUAGES.find(
                        (l) => l.code === selectedLanguage
                      )?.flag
                    }
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {
                        SUPPORTED_LANGUAGES.find(
                          (l) => l.code === selectedLanguage
                        )?.name
                      }
                    </h3>
                    {isOriginalLanguage && (
                      <p className="text-sm text-blue-600">
                        Idioma original del evento
                      </p>
                    )}
                    {!isOriginalLanguage && isAutoTranslated && (
                      <p className="text-sm text-orange-600">
                        Traducción automática - Puedes editarla manualmente
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <span className="text-sm text-orange-600 font-medium">
                      Cambios sin guardar
                    </span>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={isLoading || !hasChanges}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Guardar
                  </button>
                </div>
              </div>

              {/* Formulario */}
              <div className="space-y-6">
                {/* Información básica */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Información del Evento
                  </h4>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del evento *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nombre del evento..."
                        disabled={isOriginalLanguage}
                      />
                      {isOriginalLanguage && (
                        <p className="text-xs text-gray-500 mt-1">
                          Para editar el idioma original, usa el formulario
                          principal
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Descripción del evento..."
                        disabled={isOriginalLanguage}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ubicación del evento..."
                        disabled={isOriginalLanguage}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) =>
                            handleInputChange("slug", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="slug-del-evento"
                          disabled={isOriginalLanguage}
                        />
                        {!isOriginalLanguage && (
                          <button
                            onClick={generateSlug}
                            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            title="Generar slug automáticamente"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Metadatos SEO
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título SEO
                      </label>
                      <input
                        type="text"
                        value={formData.seoTitle}
                        onChange={(e) =>
                          handleInputChange("seoTitle", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Título para motores de búsqueda..."
                        maxLength={60}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.seoTitle.length}/60 caracteres
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción SEO
                      </label>
                      <textarea
                        value={formData.seoDescription}
                        onChange={(e) =>
                          handleInputChange("seoDescription", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Descripción para motores de búsqueda..."
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.seoDescription.length}/160 caracteres
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Palabras clave
                      </label>
                      <input
                        type="text"
                        value={formData.keywords}
                        onChange={(e) =>
                          handleInputChange("keywords", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="palabra1, palabra2, palabra3..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separar con comas
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vista previa URL */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Vista previa URL
                  </h4>
                  <p className="text-sm text-blue-600 font-mono">
                    /{selectedLanguage}/eventos/
                    {formData.slug || "slug-del-evento"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
