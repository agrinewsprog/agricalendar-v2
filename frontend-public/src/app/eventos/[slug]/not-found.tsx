import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Calendar className="w-16 h-16 text-green-600" />
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Evento no encontrado
        </h2>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, el evento que buscas no existe o ha sido movido. Puedes
          volver al calendario para explorar otros eventos.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Calendario
        </Link>
      </div>
    </div>
  );
}
