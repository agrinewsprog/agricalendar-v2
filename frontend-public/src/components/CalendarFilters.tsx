"use client";

import { useState } from "react";
import { Calendar, Filter, Globe, MapPin } from "lucide-react";
import { Event, Language } from "@/lib/api";
import { useLanguage } from "@/context/useLanguage";

interface CalendarFiltersProps {
  events: Event[];
  languages: Language[];
  onFilterChange: (filters: CalendarFilters) => void;
}

export interface CalendarFilters {
  language?: string;
  tipo?: string;
  region?: string;
  year?: number;
  search?: string;
}

export default function CalendarFilters({
  events,
  languages,
  onFilterChange,
}: CalendarFiltersProps) {
  const [filters, setFilters] = useState<CalendarFilters>({});
  const { t } = useLanguage();

  // Extraer opciones únicas de los eventos
  const tipos = Array.from(
    new Set(events.map((e) => e.tipo).filter(Boolean))
  ) as string[];
  const regiones = Array.from(
    new Set(events.map((e) => e.region).filter(Boolean))
  ) as string[];
  const años = Array.from(
    new Set(events.map((e) => new Date(e.startDate).getFullYear()))
  ).sort((a, b) => b - a);

  const handleFilterChange = (
    key: keyof CalendarFilters,
    value: string | number | undefined
  ) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {t("filters.title")}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium"
          >
            {t("filters.clear")}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("filters.search")}
          </label>
          <input
            type="text"
            placeholder={t("filters.search")}
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
        </div>

        {/* Año */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            {t("filters.year")}
          </label>
          <select
            value={filters.year || ""}
            onChange={(e) =>
              handleFilterChange(
                "year",
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          >
            <option value="">{t("filters.all")}</option>
            {años.map((año) => (
              <option key={año} value={año}>
                {año}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de evento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("filters.type")}
          </label>
          <select
            value={filters.tipo || ""}
            onChange={(e) => handleFilterChange("tipo", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          >
            <option value="">{t("filters.all")}</option>
            {tipos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {t(`eventTypes.${tipo}`) !== `eventTypes.${tipo}`
                  ? t(`eventTypes.${tipo}`)
                  : tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Región */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            {t("filters.region")}
          </label>
          <select
            value={filters.region || ""}
            onChange={(e) => handleFilterChange("region", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          >
            <option value="">{t("filters.all")}</option>
            {regiones.map((region) => (
              <option key={region} value={region}>
                {t(`regions.${region}`) !== `regions.${region}`
                  ? t(`regions.${region}`)
                  : region}
              </option>
            ))}
          </select>
        </div>

        {/* Idioma */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Globe className="w-4 h-4 inline mr-1" />
            {t("filters.language")}
          </label>
          <select
            value={filters.language || ""}
            onChange={(e) => handleFilterChange("language", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          >
            <option value="">{t("filters.all")}</option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mensaje de no eventos encontrados */}
      {events.length === 0 && hasActiveFilters && (
        <div className="mt-4 text-center py-8">
          <p className="text-gray-500">{t("filters.noEvents")}</p>
        </div>
      )}
    </div>
  );
}
