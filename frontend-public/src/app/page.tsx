"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/useLanguage";

export default function HomePage() {
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    // Redirigir automáticamente a la versión con idioma
    router.replace(`/${language}`);
  }, [language, router]);

  // Mostrar un loader mientras redirige
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
}
