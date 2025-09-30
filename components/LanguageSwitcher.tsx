"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useLanguage, useTranslation } from './language-provider'
import { cn } from '@/lib/utils'

const FLAG_SRC: Record<string, string> = {
  en: '/flags/gb.svg',
  fr: '/flags/fr.svg',
  ar: '/flags/sa.svg',
}

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage()
  const t = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        aria-label="Change language"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/80 hover:bg-white shadow-sm px-2 py-1 text-xs"
      >
        <span className="inline-block w-4 h-4 relative">
          <Image src={FLAG_SRC[language]} alt={language} fill sizes="16px" className="object-contain" />
        </span>
        <span className="uppercase font-medium">{language}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-28 rounded-md border border-gray-200 bg-white shadow-lg p-1 z-50">
          {(['en', 'fr', 'ar'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                setLanguage(lang)
                setOpen(false)
              }}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-gray-50',
                language === lang && 'bg-gray-50'
              )}
            >
              <span className="inline-block w-4 h-4 relative">
                <Image src={FLAG_SRC[lang]} alt={lang} fill sizes="16px" className="object-contain" />
              </span>
              <span className="uppercase">{lang}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


