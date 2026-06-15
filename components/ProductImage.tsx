"use client"

import { Package } from 'lucide-react'
import { getProductImageSrc } from '@/lib/image-utils'
import { cn } from '@/lib/utils'

type ProductImageProps = {
  alsafa?: string | null
  imageUrl?: string | null
  alt?: string
  className?: string
  containerClassName?: string
  fallbackClassName?: string
  showFallbackIcon?: boolean
}

export function ProductImage({
  alsafa,
  imageUrl,
  alt = 'Product image',
  className,
  containerClassName,
  fallbackClassName,
  showFallbackIcon = true,
}: ProductImageProps) {
  const src = getProductImageSrc(alsafa, imageUrl)

  return (
    <div className={cn('relative overflow-hidden bg-white', containerClassName)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn('w-full h-full object-contain', className)}
        onError={(event) => {
          const target = event.target as HTMLImageElement
          target.style.display = 'none'
          const fallback = target.nextElementSibling as HTMLElement | null
          if (fallback) fallback.style.display = 'flex'
        }}
      />
      <div
        className={cn(
          'absolute inset-0 hidden items-center justify-center bg-white',
          fallbackClassName,
        )}
      >
        {showFallbackIcon && <Package className="h-8 w-8 text-gray-400" />}
      </div>
    </div>
  )
}
