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
import {
  applyReferenceSearchFilters,
  searchProductByReference,
  type ReferenceSearchResult,
} from "@/lib/reference-search"
import { ReferenceSearchResultDisplay } from "@/components/reference-search-result"
import MobileHeader from "@/components/mobile-header"
import { ProductImage } from "@/components/ProductImage"
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
  const [searchResult, setSearchResult] = useState<ReferenceSearchResult | null>(null)

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const { data: origineData } = await supabase
        .from("products")
        .select("REF_ORG")
        .not("REF_ORG", "is", null)
        .order("REF_ORG")

      const { data: alsafaData } = await supabase
        .from("products")
        .select("ALSAFA")
        .not("ALSAFA", "is", null)
        .order("ALSAFA")

      if (origineData) {
        const uniqueOrigine = [...new Set(origineData.map((item) => item.REF_ORG).filter(Boolean))]
        setOrigineOptions(uniqueOrigine as string[])
      }

      if (alsafaData) {
        const uniqueAlsafa = [...new Set(alsafaData.map((item) => item.ALSAFA).filter(Boolean))]
        setAlsafaOptions(uniqueAlsafa as string[])
      }
    }

    fetchFilterOptions()
  }, [])

  const fetchProducts = async () => {
    if (!searchTerm && !origineFilter && !alsafaFilter) {
      return
    }

    setLoading(true)
    setHasSearched(true)

    if (searchTerm.trim()) {
      const rawResult = await searchProductByReference(supabase, searchTerm)
      const result = applyReferenceSearchFilters(rawResult, {
        origine: origineFilter,
        alsafa: alsafaFilter,
      }, searchTerm)

      setSearchResult(result)
      setProducts(result.status === "found" ? [result.product] : [])
      setTotalCount(result.status === "found" ? 1 : 0)
      setLoading(false)
      return
    }

    setSearchResult(null)

    let query = supabase.from("products").select("*", { count: "exact" })

    if (origineFilter) {
      query = query.eq("REF_ORG", origineFilter)
    }
    if (alsafaFilter) {
      query = query.eq("ALSAFA", alsafaFilter)
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
    setSearchResult(null)
    setHasSearched(false)
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const isReferenceSearch = Boolean(searchTerm.trim())

  useEffect(() => {
    if (hasSearched && currentPage > 1 && !isReferenceSearch) {
      fetchProducts()
    }
  }, [currentPage])

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <MobileHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 sm:pt-20">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par référence (ALSAFA, MANN, WIX, etc.)..."
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
            <h3 className="text-2xl font-medium text-gray-900 mb-4">Recherche par référence</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Entrez une référence pour trouver le filtre Al Safa correspondant.
            </p>
            <Button onClick={handleSearch} size="lg" className="bg-orange-500 hover:bg-orange-600">
              Commencer la Recherche
            </Button>
          </div>
        ) : isReferenceSearch ? (
          <ReferenceSearchResultDisplay
            loading={loading}
            result={searchResult}
            hasSearched={hasSearched}
            onClear={clearFilters}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">{loading ? "Recherche en cours..." : `${totalCount} produits trouvés`}</p>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                <Button onClick={clearFilters} variant="outline" className="mt-4">
                  Effacer tous les filtres
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <Link key={`${product.ALSAFA}-${index}`} href={`/product/${encodeURIComponent(product.ALSAFA || "unknown")}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {product.ALSAFA || "Produit Inconnu"}
                        </CardTitle>
                        {product.REF_ORG && (
                          <Badge variant="secondary" className="text-xs mt-2">
                            {product.REF_ORG}
                          </Badge>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="w-full h-40 bg-white rounded-lg mb-4 overflow-hidden border border-gray-100">
                          <ProductImage
                            alsafa={product.ALSAFA}
                            imageUrl={product.image_url}
                            alt={product.ALSAFA || "Image produit"}
                            containerClassName="w-full h-full"
                            className="p-2"
                            fallbackClassName="bg-gray-100"
                          />
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
