"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductImage } from "@/components/ProductImage"
import { ReferenceSearchHelp } from "@/components/reference-search-help"
import { useTranslation } from "@/components/language-provider"
import type { ReferenceSearchResult } from "@/lib/reference-search"

interface ReferenceSearchResultDisplayProps {
  loading: boolean
  result: ReferenceSearchResult | null
  hasSearched: boolean
  onClear?: () => void
}

export function ReferenceSearchResultDisplay({
  loading,
  result,
  hasSearched,
  onClear,
}: ReferenceSearchResultDisplayProps) {
  const t = useTranslation()

  if (!hasSearched) {
    return null
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="h-64">
          <CardHeader>
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-3 w-full mb-2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!result || result.status === "not_found") {
    if (result?.status === "not_found") {
      return <ReferenceSearchHelp result={result} onClear={onClear} />
    }
    return null
  }

  const { product, matchedVia } = result
  const matchedLabel =
    matchedVia.source === "extra"
      ? `${matchedVia.field}: ${matchedVia.value}`
      : `${matchedVia.field}: ${matchedVia.value}`

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-center gap-2 mb-4 text-green-700">
        <CheckCircle className="h-5 w-5" />
        <p className="text-sm font-medium">
          {t.referenceSearchMatchedVia.replace("{reference}", matchedLabel)}
        </p>
      </div>

      <Link href={`/product/${encodeURIComponent(product.ALSAFA || "unknown")}`}>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {product.ALSAFA || t.catalogUnknownProduct}
            </CardTitle>
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                {matchedLabel}
              </Badge>
              {product.REF_ORG && (
                <Badge variant="secondary" className="text-xs">
                  {product.REF_ORG}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-40 bg-white rounded-lg mb-4 overflow-hidden border border-gray-100">
              <ProductImage
                alsafa={product.ALSAFA}
                imageUrl={product.image_url}
                alt={product.ALSAFA || t.catalogProductImage}
                containerClassName="w-full h-full"
                className="p-2"
                fallbackClassName="bg-gray-100"
                showFallbackIcon={false}
              />
            </div>

            {(product.Ext || product.Int || product.H) && (
              <div className="space-y-2 text-sm">
                <span className="text-gray-600 font-medium block">{t.catalogDimensions}:</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {product.Ext && <Badge variant="outline">Ext: {product.Ext}</Badge>}
                  {product.Int && <Badge variant="outline">Int: {product.Int}</Badge>}
                  {product.H && <Badge variant="outline">H: {product.H}</Badge>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
