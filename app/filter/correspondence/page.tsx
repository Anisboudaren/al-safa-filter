"use client"

import { useState, useEffect } from "react"
import { RefreshCw, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { supabase, type Product } from "@/lib/supabase"
import MobileHeader from "@/components/mobile-header"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"

const ITEMS_PER_PAGE = 12

export default function CorrespondenceFilterPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [competitorRef, setCompetitorRef] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  const fetchProducts = async () => {
    if (!competitorRef.trim()) {
      return
    }

    setLoading(true)
    setHasSearched(true)

    let query = supabase.from("products").select("*", { count: "exact" })

    // Search for correspondence in various fields
    query = query.or(
      `ALSAFA.ilike.%${competitorRef}%,SAFI.ilike.%${competitorRef}%,SARL_F.ilike.%${competitorRef}%,FLEETG.ilike.%${competitorRef}%,ASAS.ilike.%${competitorRef}%,MECA_F.ilike.%${competitorRef}%,REF_ORG.ilike.%${competitorRef}%,MANN.ilike.%${competitorRef}%,UFI.ilike.%${competitorRef}%,HIFI.ilike.%${competitorRef}%,WIX.ilike.%${competitorRef}%`,
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
    setCompetitorRef("")
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
        icon={<RefreshCw className="h-6 w-6 text-purple-600" />}
        title="Recherche par Correspondance"
        description="Trouvez l'équivalent Alsafa d'une référence concurrente"
      />

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Correspondence Search Form */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Référence concurrente</label>
                  <div className="flex gap-4">
                    <Input
                      placeholder="Ex: MANN HU925/4X, BOSCH F026407006, MAHLE OX183D..."
                      value={competitorRef}
                      onChange={(e) => setCompetitorRef(e.target.value)}
                      className="h-12 text-sm"
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Entrez une référence d'une autre marque pour trouver l'équivalent Alsafa
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Marques supportées :</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-blue-700">
                    <span className="bg-blue-100 px-2 py-1 rounded">MANN</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">BOSCH</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">MAHLE</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">FRAM</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">PURFLUX</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">FEBI</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-4">
                  <Button onClick={handleSearch} size="lg" className="bg-purple-500 hover:bg-purple-600 px-8">
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Trouver la Correspondance
                  </Button>
                  <Button onClick={clearFilters} variant="outline" size="lg" className="px-8 bg-transparent">
                    Effacer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        {!hasSearched ? (
          <div className="text-center py-20">
            <RefreshCw className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-4">Recherche par Correspondance</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Entrez une référence d'une marque concurrente pour trouver l'équivalent dans notre gamme Alsafa. Notre
              système recherchera dans toutes les correspondances disponibles.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {loading ? "Recherche en cours..." : `${totalCount} correspondances trouvées`}
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-gray-500">
                  Page {currentPage} sur {totalPages}
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
                <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune correspondance trouvée</h3>
                <p className="text-gray-600 mb-4">
                  Vérifiez la référence ou contactez notre service technique pour assistance.
                </p>
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
                          <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                            Équivalent trouvé
                          </Badge>
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
                            <RefreshCw className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          {/* Show all reference correspondences */}
                          <div>
                            <span className="text-gray-600 font-medium block mb-1">Références:</span>
                            <div className="flex flex-wrap gap-1 text-xs">
                              {product.SAFI && (
                                <Badge variant="outline" className="bg-gray-50">
                                  SAFI: {product.SAFI}
                                </Badge>
                              )}
                              {product.FLEETG && (
                                <Badge variant="outline" className="bg-gray-50">
                                  FLEETG: {product.FLEETG}
                                </Badge>
                              )}
                              {product.ASAS && (
                                <Badge variant="outline" className="bg-gray-50">
                                  ASAS: {product.ASAS}
                                </Badge>
                              )}
                            </div>
                          </div>

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
