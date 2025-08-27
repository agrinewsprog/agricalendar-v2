"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "es" | "en" | "pt" | "vi" | "th" | "id";

interface Translations {
  [key: string]: any;
}

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export interface LanguageProviderProps {
  children: ReactNode;
}

const loadTranslations = async (language: Language): Promise<Translations> => {
  try {
    const response = await fetch(`/locales/${language}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${language}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading translations:", error);
    // Fallback to Spanish if loading fails
    if (language !== "es") {
      try {
        const fallbackResponse = await fetch("/locales/es.json");
        if (fallbackResponse.ok) {
          return await fallbackResponse.json();
        }
      } catch (fallbackError) {
        console.error("Error loading fallback translations:", fallbackError);
      }
    }
    return {};
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("es");
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  // Load language from localStorage on initial render (only on client)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language;
      if (
        savedLanguage &&
        ["es", "en", "pt", "vi", "th", "id"].includes(savedLanguage)
      ) {
        setLanguageState(savedLanguage);
      }
    }
  }, []);

  // Load translations when language changes
  useEffect(() => {
    const loadLanguageTranslations = async () => {
      setLoading(true);
      try {
        const newTranslations = await loadTranslations(language);
        setTranslations(newTranslations);
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLanguageTranslations();
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage);
    }
  };

  // Function to get nested translation values
  const t = (key: string): string => {
    try {
      const keys = key.split(".");
      let value: any = translations;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return key; // Return key if translation not found
        }
      }

      return typeof value === "string" ? value : key;
    } catch (error) {
      console.error("Translation error:", error);
      return key;
    }
  };

  const contextValue: LanguageContextType = {
    language,
    translations,
    setLanguage,
    t,
    loading,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
