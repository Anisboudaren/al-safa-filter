"use client"

import { useState, useEffect } from "react"
import { Search, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"
import Link from "next/link"
import { supabase, type Product } from "@/lib/supabase"
import MobileHeader from "@/components/mobile-header"

const ITEMS_PER_PAGE = 12

export default function VehicleFilterPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  const brands = ["Audi", "Toyota", "Volkswagen", "Ford", "Mercedes", "BMW", "Peugeot", "Renault"]
  const models = ["A3", "A4", "A6", "Corolla", "Camry", "Golf", "Passat", "Focus", "C-Class", "E-Class"]
  const years = ["2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"]

  const fetchProducts = async () => {
    if (!brand && !model && !year) {
      return
    }

    setLoading(true)
    setHasSearched(true)

    let query = supabase.from("products").select("*", { count: "exact" })

    // Build search query based on vehicle info
    const searchTerms = []
    if (brand) searchTerms.push(brand)
    if (model) searchTerms.push(model)
    if (year) searchTerms.push(year)

    if (searchTerms.length > 0) {
      const searchString = searchTerms.join(" ")
      query = query.or(
        `divers_vehicules.ilike.%${searchString}%,ORIGINE.ilike.%${searchString}%,ALSAFA.ilike.%${searchString}%`,
      )
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
    setBrand("")
    setModel("")
    setYear("")
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
      <MobileHeader />
      <SharedHeader
        title="Recherche par Véhicule"
        description="Trouvez les filtres compatibles avec votre véhicule"
        icon={<Car className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />}
      />

      {/* Vehicle Filter Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Marque</label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="h-10 sm:h-12">
                    <SelectValue placeholder="Sélectionner une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brandOption) => (
                      <SelectItem key={brandOption} value={brandOption}>
                        {brandOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Modèle</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="h-10 sm:h-12">
                    <SelectValue placeholder="Sélectionner un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((modelOption) => (
                      <SelectItem key={modelOption} value={modelOption}>
                        {modelOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Année</label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="h-10 sm:h-12">
                    <SelectValue placeholder="Sélectionner une année" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((yearOption) => (
                      <SelectItem key={yearOption} value={yearOption}>
                        {yearOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button onClick={handleSearch} size="lg" className="bg-orange-500 hover:bg-orange-600 px-6 sm:px-8">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Rechercher les Filtres
              </Button>
              <Button onClick={clearFilters} variant="outline" size="lg" className="px-6 sm:px-8 bg-transparent">
                Effacer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        {!hasSearched ? (
          <div className="text-center py-12 sm:py-20">
            <Car className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-3 sm:mb-4">Recherche par Véhicule</h3>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Sélectionnez la marque, le modèle et l'année de votre véhicule pour trouver les filtres compatibles.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <p className="text-gray-600 text-sm sm:text-base">
                {loading ? "Recherche en cours..." : `${totalCount} filtres compatibles`}
              </p>
              {totalPages > 1 && (
                <p className="text-xs sm:text-sm text-gray-500">
                  Page {currentPage} sur {totalPages}
                </p>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
              <div className="text-center py-8 sm:py-12">
                <Car className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Aucun filtre trouvé</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  Essayez avec d'autres critères de véhicule.
                </p>
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Nouvelle recherche
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product, index) => (
                  <Link
                    key={`${product.ALSAFA}-${index}`}
                    href={`/product/${encodeURIComponent(product.ALSAFA || "unknown")}`}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                          {product.ALSAFA || "Produit Inconnu"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full h-28 sm:h-32 bg-gray-100 rounded-lg mb-3 sm:mb-4 overflow-hidden">
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
                            <Car className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                          {(product.Ext || product.Int || product.H) && (
                            <div>
                              <span className="text-gray-600 font-medium block mb-1">Dimensions:</span>
                              <div className="flex flex-wrap gap-1 sm:gap-2 text-xs">
                                {product.Ext && (
                                  <Badge variant="outline" className="text-xs">
                                    Ext: {product.Ext}
                                  </Badge>
                                )}
                                {product.Int && (
                                  <Badge variant="outline" className="text-xs">
                                    Int: {product.Int}
                                  </Badge>
                                )}
                                {product.H && (
                                  <Badge variant="outline" className="text-xs">
                                    H: {product.H}
                                  </Badge>
                                )}
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
              <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
                <Button
                  variant="outline"
                  size="sm"
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
                        className="w-8 h-8 p-0 text-xs sm:text-sm"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
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
