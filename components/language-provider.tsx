"use client"

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { SupportedLanguage, Translations } from '@/lib/translations'
import { getDirForLang } from '@/lib/utils'
import { getTranslations } from '@/lib/translations'

type LanguageContextValue = {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en')

  // Load persisted language
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('lang') as SupportedLanguage | null) : null
    if (stored === 'en' || stored === 'fr' || stored === 'ar') {
      setLanguageState(stored)
    }
  }, [])

  // Persist and update html direction
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
      document.documentElement.dir = getDirForLang(language)
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', language)
    }
  }, [language])

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang)
  }

  const value = useMemo(() => ({ 
    language, 
    setLanguage, 
    t: getTranslations(language) 
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

// Convenience hook for translations
export function useTranslation() {
  const { t } = useLanguage()
  return t
}


