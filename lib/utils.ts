import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Language and direction helpers
export type SupportedLanguage = 'en' | 'fr' | 'ar'

export function getDirForLang(lang: SupportedLanguage): 'ltr' | 'rtl' {
  return lang === 'ar' ? 'rtl' : 'ltr'
}

export function getLocaleLabel(lang: SupportedLanguage): string {
  switch (lang) {
    case 'en':
      return 'English'
    case 'fr':
      return 'Français'
    case 'ar':
      return 'العربية'
    default:
      return 'English'
  }
}