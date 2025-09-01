import { useState, useEffect } from "react";
import { speciesService, type Especie } from "@/lib/api";

interface SpeciesSelectorProps {
  value?: number | string;
  onChange: (especieId: number | undefined, color?: string) => void;
  error?: string;
  className?: string;
}

export default function SpeciesSelector({
  value,
  onChange,
  error,
  className = "",
}: SpeciesSelectorProps) {
  const [species, setSpecies] = useState<Especie[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSpecies();
  }, []);

  const fetchSpecies = async () => {
    try {
      setLoading(true);
      const response = await speciesService.getAll();
      if (response.success && response.data) {
        setSpecies(response.data);
      } else {
        setErrorMessage("Error al cargar las especies");
      }
    } catch (error) {
      console.error("Error fetching species:", error);
      setErrorMessage("Error al cargar las especies");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (!selectedValue) {
      onChange(undefined, undefined);
      return;
    }

    const selectedSpecies = species.find(
      (s) => s.id === parseInt(selectedValue)
    );
    if (selectedSpecies) {
      onChange(selectedSpecies.id, selectedSpecies.color);
    }
  };

  const selectedSpecies = species.find(
    (s) => s.id === parseInt(value as string)
  );

  if (loading) {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700">
          Especie
        </label>
        <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700">
          Especie
        </label>
        <div className="mt-1 block w-full border border-red-300 rounded-md shadow-sm py-2 px-3 bg-red-50">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700">Especie</label>
      <div className="mt-1 flex items-center space-x-3">
        <select
          value={value || ""}
          onChange={handleSpeciesChange}
          className="flex-1 block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Selecciona una especie</option>
          {species.map((especie) => (
            <option key={especie.id} value={especie.id}>
              {especie.nombre}
            </option>
          ))}
        </select>

        {/* Color preview */}
        {selectedSpecies && (
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: selectedSpecies.color }}
              title={`Color para ${selectedSpecies.nombre}`}
            />
            <span className="text-sm text-gray-600 font-medium">
              {selectedSpecies.color}
            </span>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {selectedSpecies && (
        <p className="mt-1 text-sm text-gray-500">
          El color del evento se asignará automáticamente:{" "}
          <strong>{selectedSpecies.color}</strong>
        </p>
      )}
    </div>
  );
}
