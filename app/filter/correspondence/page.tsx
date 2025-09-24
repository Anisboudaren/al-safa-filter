"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, Package, ArrowRight, RefreshCw, Grid, List, ChevronLeft, ChevronRight, X, CheckCircle, Zap, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { supabase, type Product } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import MobileHeader from "@/components/mobile-header"
import { SharedFooter } from "@/components/shared-footer"

const ITEMS_PER_PAGE = 12

export default function CorrespondenceFilterPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [competitorRef, setCompetitorRef] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Handle URL parameters on page load
  useEffect(() => {
    const correspondenceParam = searchParams.get("correspondence")
    
    if (correspondenceParam) {
      setCompetitorRef(correspondenceParam)
    }
  }, [searchParams])

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

  // Auto-search when URL parameters are present
  useEffect(() => {
    if (competitorRef && !hasSearched) {
      fetchProducts()
    }
  }, [competitorRef])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <MobileHeader />
      
      {/* Hero Search Section */}
      <section className="py-12 bg-gradient-to-r from-orange-500 to-orange-600 pt-24 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Recherche par Correspondance
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Trouvez les filtres équivalents à partir d'une référence concurrente
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Référence du concurrent</label>
                    <Input
                      placeholder="Ex: MANN-FILTER HU7008Z, UFI 23.155.00..."
                      value={competitorRef}
                      onChange={(e) => setCompetitorRef(e.target.value)}
                      className="h-12 text-lg rounded-xl border-2 focus:border-orange-500 focus:ring-orange-500"
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setShowFilters(!showFilters)}
                      variant="outline"
                      className="h-12 px-6 rounded-xl border-2 border-orange-200 hover:border-orange-300"
                    >
                      <Filter className="h-5 w-5 mr-2" />
                      Filtres Avancés
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleSearch}
                      className="h-12 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={loading}
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RefreshCw className="h-5 w-5 mr-2" />
                        </motion.div>
                      ) : (
                        <>
                          <Search className="h-5 w-5 mr-2" />
                          Rechercher
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>

                <p className="text-sm text-gray-500 text-center mt-4">
                  Entrez la référence du filtre concurrent pour trouver les équivalents Al Safa.
                </p>

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-gray-200"
                    >
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="rounded-xl border-2 border-gray-300 hover:border-gray-400"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Effacer les filtres
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasSearched ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mx-auto mb-8"
            >
              <RefreshCw className="h-12 w-12 text-orange-600" />
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Recherche par Correspondance</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Entrez la référence d'une marque concurrente pour trouver l'équivalent dans notre gamme Alsafa.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSearch}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Zap className="h-5 w-5 mr-2" />
                Commencer la Recherche
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <>
            {/* Results Summary and Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-500" />
                  <p className="text-lg font-medium text-gray-900">
                    {loading ? "Recherche en cours..." : `${totalCount} correspondances trouvées`}
                  </p>
                </div>
                {totalPages > 1 && (
                  <Badge variant="outline" className="text-sm">
                    Page {currentPage} sur {totalPages}
                  </Badge>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-lg"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-lg"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Products Grid */}
            {loading ? (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <Card className="h-64 bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                      <CardHeader className="pb-3">
                        <Skeleton className="h-4 w-3/4 rounded-lg" />
                        <Skeleton className="h-3 w-1/2 rounded-lg" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-32 w-full mb-4 rounded-xl" />
                        <Skeleton className="h-3 w-full mb-2 rounded-lg" />
                        <Skeleton className="h-3 w-2/3 rounded-lg" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6"
                >
                  <RefreshCw className="h-10 w-10 text-gray-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucune correspondance trouvée</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Vérifiez la référence ou contactez notre service technique pour assistance.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="rounded-xl border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Nouvelle recherche
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.div
                      key={`${product.ALSAFA}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group"
                    >
                      <Link href={`/product/${encodeURIComponent(product.ALSAFA || "unknown")}`}>
                        <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white group-hover:bg-gradient-to-br group-hover:from-orange-50 group-hover:to-orange-100 rounded-2xl overflow-hidden">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                              {product.ALSAFA || "Produit Inconnu"}
                            </CardTitle>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {product.REF_ORG && (
                                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                                  {product.REF_ORG}
                                </Badge>
                              )}
                              {product.SAFI && (
                                <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                                  SAFI: {product.SAFI}
                                </Badge>
                              )}
                              {product.filtration_system && (
                                <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                                  {product.filtration_system}
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 overflow-hidden group-hover:from-orange-100 group-hover:to-orange-200 transition-all duration-300">
                              <img
                                src={product.image_url || `https://devlly.net/alsafa/${(product.ALSAFA || "").replace("-", "")}.avif`}
                                alt={product.ALSAFA || "Image produit"}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = "none"
                                  const fallback = target.nextElementSibling as HTMLElement
                                  if (fallback) fallback.style.display = "flex"
                                }}
                              />
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl hidden items-center justify-center group-hover:from-orange-100 group-hover:to-orange-200">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            </div>

                            <div className="space-y-3 text-sm">
                              {(product.Ext || product.Int || product.H) && (
                                <div>
                                  <span className="text-gray-600 font-semibold block mb-2">Dimensions:</span>
                                  <div className="flex flex-wrap gap-2 text-xs">
                                    {product.Ext && (
                                      <Badge variant="outline" className="border-orange-200 text-orange-700">
                                        Ext: {product.Ext}
                                      </Badge>
                                    )}
                                    {product.Int && (
                                      <Badge variant="outline" className="border-orange-200 text-orange-700">
                                        Int: {product.Int}
                                      </Badge>
                                    )}
                                    {product.H && (
                                      <Badge variant="outline" className="border-orange-200 text-orange-700">
                                        H: {product.H}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}

                              {product.divers_vehicules && (
                                <div>
                                  <span className="text-gray-600 font-semibold block mb-1">Compatible:</span>
                                  <p className="text-xs text-gray-700 line-clamp-2">{product.divers_vehicules}</p>
                                </div>
                              )}

                              {/* Show correspondence info */}
                              <div className="space-y-1">
                                <span className="text-gray-600 font-semibold block text-xs">Correspondances:</span>
                                <div className="flex flex-wrap gap-1 text-xs">
                                  {product.MANN && (
                                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                      MANN: {product.MANN}
                                    </Badge>
                                  )}
                                  {product.UFI && (
                                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                      UFI: {product.UFI}
                                    </Badge>
                                  )}
                                  {product.REF_ORG && (
                                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                                      REF: {product.REF_ORG}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center items-center gap-3 mt-12"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="rounded-xl border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Précédent
                  </Button>
                </motion.div>

                <div className="flex gap-2">
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
                      <motion.div
                        key={pageNum}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`rounded-xl ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
                              : "border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      </motion.div>
                    )
                  })}
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="rounded-xl border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 disabled:opacity-50"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </main>
      
      <SharedFooter />
    </div>
  )
}