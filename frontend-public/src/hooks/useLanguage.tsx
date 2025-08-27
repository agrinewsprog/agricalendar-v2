"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

// Tipos
export type Language = "es" | "en" | "pt" | "vi" | "th" | "id";

// Idiomas disponibles
export const languages = [
  { code: "es" as Language, name: "Español", flag: "🇪🇸" },
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "pt" as Language, name: "Português", flag: "🇧🇷" },
  { code: "vi" as Language, name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th" as Language, name: "ไทย", flag: "🇹🇭" },
  { code: "id" as Language, name: "Bahasa Indonesia", flag: "🇮🇩" },
];

// Contexto de idioma
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Traducciones (las cargaremos dinámicamente)
let translations: Record<Language, any> = {
  es: {},
  en: {},
  pt: {},
  vi: {},
  th: {},
  id: {},
};

// Función para cargar traducciones
async function loadTranslations(lang: Language) {
  try {
    const response = await fetch(`/locales/${lang}.json`);
    const data = await response.json();
    translations[lang] = data;
    return data;
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    return {};
  }
}

// Función helper para obtener texto anidado
function getNestedTranslation(obj: any, path: string): string {
  return path.split(".").reduce((current, key) => {
    return current && current[key] ? current[key] : path;
  }, obj);
}

// Provider del contexto
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar idioma desde localStorage al inicializar
  useEffect(() => {
    async function initializeLanguage() {
      let selectedLang: Language = "es";

      if (typeof window !== "undefined") {
        const savedLanguage = localStorage.getItem(
          "selectedLanguage"
        ) as Language;
        if (
          savedLanguage &&
          ["es", "en", "pt", "vi", "th", "id"].includes(savedLanguage)
        ) {
          selectedLang = savedLanguage;
        } else {
          // Detectar idioma del navegador
          const browserLang = navigator.language.split("-")[0] as Language;
          if (["es", "en", "pt", "vi", "th", "id"].includes(browserLang)) {
            selectedLang = browserLang;
          }
        }
      }

      await loadTranslations(selectedLang);
      setLanguage(selectedLang);
      setIsLoaded(true);
    }

    initializeLanguage();
  }, []);

  // Guardar idioma en localStorage cuando cambie
  const handleSetLanguage = async (lang: Language) => {
    await loadTranslations(lang);
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedLanguage", lang);
    }
  };

  // Función de traducción
  const t = (key: string): string => {
    if (!isLoaded || !translations[language]) {
      return key;
    }

    const currentTranslations = translations[language];
    return getNestedTranslation(currentTranslations, key);
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook para usar el contexto
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Hook simplificado solo para traducciones
export function useTranslation() {
  const { t, language } = useLanguage();
  return { t, language };
}
