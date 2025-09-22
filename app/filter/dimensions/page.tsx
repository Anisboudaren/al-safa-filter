"use client"

import { useState, useEffect } from "react"
import { Search, Ruler, ArrowLeft } from "lucide-react"
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

const ITEMS_PER_PAGE = 12

export default function DimensionsFilterPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [external, setExternal] = useState("")
  const [internal, setInternal] = useState("")
  const [height, setHeight] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  const fetchProducts = async () => {
    if (!external && !internal && !height) {
      return
    }

    setLoading(true)
    setHasSearched(true)

    let query = supabase.from("products").select("*", { count: "exact" })

    // Build dimension filters
    const conditions = []
    if (external) conditions.push(`Ext.ilike.%${external}%`)
    if (internal) conditions.push(`Int.ilike.%${internal}%`)
    if (height) conditions.push(`H.ilike.%${height}%`)

    if (conditions.length > 0) {
      query = query.or(conditions.join(","))
    }

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
    setExternal("")
    setInternal("")
    setHeight("")
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
        icon={<Ruler className="h-6 w-6 text-green-600/50" />}
        title="Recherche par Dimensions"
        description="Trouvez un filtre selon ses dimensions exactes"
      />

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           {/* Dimensions Search Form */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Diamètre externe (mm)</label>
                    <Input
                      placeholder="Ex: 65"
                      value={external}
                      onChange={(e) => setExternal(e.target.value)}
                      className="h-12"
                      type="number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Diamètre interne (mm)</label>
                    <Input
                      placeholder="Ex: 30"
                      value={internal}
                      onChange={(e) => setInternal(e.target.value)}
                      className="h-12"
                      type="number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Hauteur (mm)</label>
                    <Input
                      placeholder="Ex: 85"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="h-12"
                      type="number"
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Entrez au moins une dimension pour effectuer la recherche
                </p>

                <div className="flex flex-col justify-center gap-4">
                  <Button onClick={handleSearch} size="lg" className="bg-green-500 hover:bg-green-600 px-8">
                    <Search className="h-5 w-5 mr-2" />
                    Rechercher par Dimensions
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
            <Ruler className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-4">Recherche par Dimensions</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Entrez les dimensions exactes du filtre recherché. Vous pouvez spécifier une ou plusieurs dimensions pour
              affiner votre recherche.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {loading ? "Recherche en cours..." : `${totalCount} filtres avec ces dimensions`}
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
                <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun filtre trouvé</h3>
                <p className="text-gray-600 mb-4">Essayez avec des dimensions différentes ou moins précises.</p>
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
                        {product.REF_ORG && (
                          <Badge variant="secondary" className="text-xs w-fit">
                            {product.REF_ORG}
                          </Badge>
                        )}
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
                            <Ruler className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-gray-600 font-medium block mb-1">Dimensions:</span>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {product.Ext && (
                                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                                  Ext: {product.Ext}
                                </Badge>
                              )}
                              {product.Int && (
                                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                                  Int: {product.Int}
                                </Badge>
                              )}
                              {product.H && (
                                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                                  H: {product.H}
                                </Badge>
                              )}
                            </div>
                          </div>

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
