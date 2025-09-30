"use client"

import { useState, useEffect } from "react"
import { Search, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { supabase, type Product } from "@/lib/supabase"
import MobileHeader from "@/components/mobile-header"
import { Share } from "next/font/google"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"
import { useTranslation } from "@/components/language-provider"

const ITEMS_PER_PAGE = 12

export default function ReferenceFilterPage() {
  const t = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  const fetchProducts = async () => {
    if (!reference.trim()) {
      return
    }

    setLoading(true)
    setHasSearched(true)

    let query = supabase.from("products").select("*", { count: "exact" })

    // Search by reference in multiple fields
    query = query.or(
      `ALSAFA.ilike.%${reference}%,SAFI.ilike.%${reference}%,FLEETG.ilike.%${reference}%,ASAS.ilike.%${reference}%,SARL_F.ilike.%${reference}%,MECA_F.ilike.%${reference}%`,
    )

    const from = (currentPage - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching products:", error)
    } else {
      setProducts(data || [])
      setTotalCount(count || 0)
    }

    setLoading(false)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchProducts()
  }

  const clearFilters = () => {
    setReference("")
    setCurrentPage(1)
    setProducts([])
    setHasSearched(false)
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  useEffect(() => {
    if (hasSearched && currentPage > 1) {
      fetchProducts()
    }
  }, [currentPage])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MobileHeader />
      <SharedHeader
        icon={<Search className="h-6 w-6 text-orange-600" />}
        title={t.searchByReference}
        description="Trouvez un filtre par sa référence exacte"
      />

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Reference Search Form */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.filterReference}</label>
                  <div className="flex gap-4">
                    <Input
                      placeholder={t.referencePlaceholder}
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="h-12 "
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <p className="text-sm text-gray-500">{t.enterCompleteOrPartialReferenceDescription}</p>
                </div>

                <div className="flex flex-col justify-center gap-4">
                  <Button onClick={handleSearch} size="lg" className="bg-primary/90 hover:bg-primary/60 px-8">
                    <Search className="h-5 w-5 mr-2" />
                    {t.searchReferenceButton}
                  </Button>
                  <Button onClick={clearFilters} variant="outline" size="lg" className="px-8 bg-transparent">
                    {t.clearFilters}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        {!hasSearched ? (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-4">{t.searchByReference}</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {t.enterExactOrPartialReferenceDescription}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">{loading ? t.searchingInProgress : `${totalCount} ${t.referencesFound}`}</p>
              {totalPages > 1 && (
                <p className="text-sm text-gray-500">
                  {t.pageOf.replace('{current}', currentPage.toString()).replace('{total}', totalPages.toString())}
                </p>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="h-64">
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-32 w-full mb-4" />
                      <Skeleton className="h-3 w-full mb-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune référence trouvée</h3>
                <p className="text-gray-600 mb-4">Vérifiez l'orthographe ou essayez une référence différente.</p>
                <Button onClick={clearFilters} variant="outline">
                  Nouvelle recherche
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <Link
                    key={`${product.ALSAFA}-${index}`}
                    href={`/product/${encodeURIComponent(product.ALSAFA || "unknown")}`}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {product.ALSAFA || "Produit Inconnu"}
                        </CardTitle>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.REF_ORG && (
                            <Badge variant="secondary" className="text-xs">
                              {product.REF_ORG}
                            </Badge>
                          )}
                          {reference && (
                            <>
                              {product.SAFI && product.SAFI.toLowerCase().includes(reference.toLowerCase()) && (
                                <Badge variant="outline" className="text-xs">
                                  SAFI: {product.SAFI}
                                </Badge>
                              )}
                              {product.FLEETG && product.FLEETG.toLowerCase().includes(reference.toLowerCase()) && (
                                <Badge variant="outline" className="text-xs">
                                  FLEETG: {product.FLEETG}
                                </Badge>
                              )}
                              {product.ASAS && product.ASAS.toLowerCase().includes(reference.toLowerCase()) && (
                                <Badge variant="outline" className="text-xs">
                                  ASAS: {product.ASAS}
                                </Badge>
                              )}
                              {product.SARL_F && product.SARL_F.toLowerCase().includes(reference.toLowerCase()) && (
                                <Badge variant="outline" className="text-xs">
                                  SARL_F: {product.SARL_F}
                                </Badge>
                              )}
                              {product.MECA_F && product.MECA_F.toLowerCase().includes(reference.toLowerCase()) && (
                                <Badge variant="outline" className="text-xs">
                                  MECA_F: {product.MECA_F}
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                          <img
                            src={product.image_url || `https://devlly.net/alsafa/${(product.ALSAFA || "").replace("-", "")}.avif`}
                            alt={product.ALSAFA || "Image produit"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              const fallback = target.nextElementSibling as HTMLElement
                              if (fallback) fallback.style.display = "flex"
                            }}
                          />
                          <div className="w-full h-full bg-gray-100 rounded-lg hidden items-center justify-center">
                            <Search className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          {(product.Ext || product.Int || product.H) && (
                            <div>
                              <span className="text-gray-600 font-medium block mb-1">Dimensions:</span>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {product.Ext && <Badge variant="outline">Ext: {product.Ext}</Badge>}
                                {product.Int && <Badge variant="outline">Int: {product.Int}</Badge>}
                                {product.H && <Badge variant="outline">H: {product.H}</Badge>}
                              </div>
                            </div>
                          )}

                          {product.divers_vehicules && (
                            <div>
                              <span className="text-gray-600 font-medium block mb-1">Compatible:</span>
                              <p className="text-xs text-gray-700 line-clamp-2">{product.divers_vehicules}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <SharedFooter />
    </div>
  )
}
