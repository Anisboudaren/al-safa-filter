"use client"

import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

interface FontWrapperProps {
  children: React.ReactNode
  interClass: string
  cairoClass: string
}

export function FontWrapper({ children, interClass, cairoClass }: FontWrapperProps) {
  const { language } = useLanguage()
  
  return (
    <div className={cn(
      'overflow-x-hidden max-w-full',
      interClass,
      language === 'ar' && 'font-cairo'
    )}>
      {children}
    </div>
  )
}
