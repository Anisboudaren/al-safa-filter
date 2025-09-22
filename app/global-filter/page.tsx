"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { supabase, type Product } from "@/lib/supabase"
import MobileHeader from "@/components/mobile-header"
import { SharedFooter } from "@/components/shared-footer"

const ITEMS_PER_PAGE = 12

export default function GlobalFilterPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [origineFilter, setOrigineFilter] = useState<string>("")
  const [alsafaFilter, setAlsafaFilter] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [origineOptions, setOrigineOptions] = useState<string[]>([])
  const [alsafaOptions, setAlsafaOptions] = useState<string[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  // Fetch filter options only
  useEffect(() => {
    const fetchFilterOptions = async () => {
      const { data: origineData } = await supabase
        .from("products")
        .select("ORIGINE")
        .not("ORIGINE", "is", null)
        .order("ORIGINE")

      const { data: alsafaData } = await supabase
        .from("products")
        .select("ALSAFA")
        .not("ALSAFA", "is", null)
        .order("ALSAFA")

      if (origineData) {
        const uniqueOrigine = [...new Set(origineData.map((item) => item.ORIGINE).filter(Boolean))]
        setOrigineOptions(uniqueOrigine)
      }

      if (alsafaData) {
        const uniqueAlsafa = [...new Set(alsafaData.map((item) => item.ALSAFA).filter(Boolean))]
        setAlsafaOptions(uniqueAlsafa)
      }
    }

    fetchFilterOptions()
  }, [])

  // Fetch products only when search is triggered
  const fetchProducts = async () => {
    if (!searchTerm && !origineFilter && !alsafaFilter) {
      return
    }

    setLoading(true)
    setHasSearched(true)

    let query = supabase.from("products").select("*", { count: "exact" })

    // Apply search filter
    if (searchTerm) {
      query = query.or(
        `ALSAFA.ilike.%${searchTerm}%,REF_ORG.ilike.%${searchTerm}%,SAFI.ilike.%${searchTerm}%,FLEETG.ilike.%${searchTerm}%,ASAS.ilike.%${searchTerm}%,SARL_F.ilike.%${searchTerm}%,MECA_F.ilike.%${searchTerm}%,Ext.ilike.%${searchTerm}%,Int.ilike.%${searchTerm}%,H.ilike.%${searchTerm}%,divers_vehicules.ilike.%${searchTerm}%,filtration_system.ilike.%${searchTerm}%`,
      )
    }

    // Apply filters
    if (origineFilter) {
      query = query.eq("REF_ORG", origineFilter)
    }
    if (alsafaFilter) {
      query = query.eq("ALSAFA", alsafaFilter)
    }

    // Apply pagination
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

  const handleOrigineFilter = (value: string) => {
    setOrigineFilter(value === "all" ? "" : value)
    setCurrentPage(1)
  }

  const handleAlsafaFilter = (value: string) => {
    setAlsafaFilter(value === "all" ? "" : value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setOrigineFilter("")
    setAlsafaFilter("")
    setCurrentPage(1)
    setProducts([])
    setHasSearched(false)
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  // Trigger search when page changes
  useEffect(() => {
    if (hasSearched && currentPage > 1) {
      fetchProducts()
    }
  }, [currentPage])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MobileHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, origine, ou spécifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus:border-orange-500 focus:ring-orange-500"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={origineFilter || "all"} onValueChange={handleOrigineFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par Origine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les Origines</SelectItem>
                  {origineOptions.map((origine) => (
                    <SelectItem key={origine} value={origine}>
                      {origine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={alsafaFilter || "all"} onValueChange={handleAlsafaFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par ALSAFA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les ALSAFA</SelectItem>
                  {alsafaOptions.map((alsafa) => (
                    <SelectItem key={alsafa} value={alsafa}>
                      {alsafa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>

              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Effacer
              </Button>
            </div>
          </div>
        {!hasSearched ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-4">Recherche Sécurisée</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Utilisez les filtres ci-dessus pour rechercher des produits spécifiques. Notre système de recherche
              sécurisé protège notre base de données contre le scraping automatisé.
            </p>
            <Button onClick={handleSearch} size="lg" className="bg-orange-500 hover:bg-orange-600">
              Commencer la Recherche
            </Button>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">{loading ? "Recherche en cours..." : `${totalCount} produits trouvés`}</p>
              {totalPages > 1 && (
                <p className="text-sm text-gray-500">
                  Page {currentPage} sur {totalPages}
                </p>
              )}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="h-64">
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-32 w-full mb-4" />
                      <Skeleton className="h-3 w-full mb-2" />
                      <Skeleton className="h-3 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600 mb-4">Essayez d'ajuster vos termes de recherche ou vos filtres.</p>
                <Button onClick={clearFilters} variant="outline">
                  Effacer tous les filtres
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => {
                  const getAdditionalColumns = () => {
                    const additionalCols = []

                    // Always show ORIGINE if available
                    if (product.REF_ORG) {
                      additionalCols.push({ label: "ORIGINE", value: product.REF_ORG, type: "origine" })
                    }

                    // If there's a search term, check which columns match and show only those
                    if (searchTerm && searchTerm.length > 0) {
                      const searchLower = searchTerm.toLowerCase()

                      // Check each reference column for matches
                      if (product.SAFI && product.SAFI.toLowerCase().includes(searchLower)) {
                        additionalCols.push({ label: "SAFI", value: product.SAFI, type: "reference" })
                      }
                      if (product.FLEETG && product.FLEETG.toLowerCase().includes(searchLower)) {
                        additionalCols.push({ label: "FLEETG", value: product.FLEETG, type: "reference" })
                      }
                      if (product.ASAS && product.ASAS.toLowerCase().includes(searchLower)) {
                        additionalCols.push({ label: "ASAS", value: product.ASAS, type: "reference" })
                      }
                      if (product.MECA_F && product.MECA_F.toLowerCase().includes(searchLower)) {
                        additionalCols.push({ label: "MECA F", value: product.MECA_F, type: "reference" })
                      }
                      if (product.SARL_F && product.SARL_F.toLowerCase().includes(searchLower)) {
                        additionalCols.push({ label: "SARL F", value: product.SARL_F, type: "reference" })
                      }
                      if (product.Ext && product.Ext.toLowerCase().includes(searchLower)) {
                        additionalCols.push({ label: "Ext", value: product.Ext, type: "reference" })
                      }
                      if (product.Int && product.Int.toLowerCase().includes(searchLower)) {
                        additionalCols.push({ label: "Int", value: product.Int, type: "reference" })
                      }
                      if (product.H && product.H.toLowerCase().includes(searchLower)) {
                        additionalCols.push({ label: "H", value: product.H, type: "reference" })
                      }
                    }

                    return additionalCols
                  }

                  const additionalColumns = getAdditionalColumns()

                  return (
                    <Link
                      key={`${product.ALSAFA}-${index}`}
                      href={`/product/${encodeURIComponent(product.ALSAFA || "unknown")}`}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {product.ALSAFA || "Produit Inconnu"}
                          </CardTitle>
                          {additionalColumns.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {additionalColumns.map((col, idx) => (
                                <Badge
                                  key={idx}
                                  variant={col.type === "origine" ? "secondary" : "outline"}
                                  className="text-xs"
                                >
                                  {col.type === "origine" ? col.value : `${col.label}: ${col.value}`}
                                </Badge>
                              ))}
                            </div>
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
                              <Package className="h-8 w-8 text-gray-400" />
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
                  )
                })}
              </div>
            )}

            {/* Pagination */}
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
