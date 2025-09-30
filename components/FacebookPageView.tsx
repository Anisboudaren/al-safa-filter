"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { trackFacebookEvent } from "@/lib/pixel"

export function FacebookPageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    trackFacebookEvent('PageView')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}


