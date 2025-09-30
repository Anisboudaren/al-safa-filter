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
      interClass, // Always apply Inter as base
      language === 'ar' && 'font-cairo' // Add Cairo class when Arabic is selected
    )}>
      {children}
    </div>
  )
}
