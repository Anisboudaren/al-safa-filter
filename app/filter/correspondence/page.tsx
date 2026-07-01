"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, Package, ArrowRight, RefreshCw, Grid, List, ChevronLeft, ChevronRight, X, CheckCircle, Zap, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { supabase, type Product } from "@/lib/supabase"
import { searchProductByReference, type ReferenceSearchResult } from "@/lib/reference-search"
import { ReferenceSearchResultDisplay } from "@/components/reference-search-result"
import { motion, AnimatePresence } from "framer-motion"
import MobileHeader from "@/components/mobile-header"
import { ProductImage } from "@/components/ProductImage"
import { SharedFooter } from "@/components/shared-footer"
import { useTranslation } from "@/components/language-provider"

const ITEMS_PER_PAGE = 12

function CorrespondenceFilterContent() {
  const searchParams = useSearchParams()
  const t = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [competitorRef, setCompetitorRef] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchResult, setSearchResult] = useState<ReferenceSearchResult | null>(null)
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

    const result = await searchProductByReference(supabase, competitorRef)
    setSearchResult(result)
    setProducts(result.status === "found" ? [result.product] : [])
    setTotalCount(result.status === "found" ? 1 : 0)
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
    setSearchResult(null)
    setHasSearched(false)
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  useEffect(() => {
    if (competitorRef && !hasSearched) {
      fetchProducts()
    }
  }, [competitorRef])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 overflow-x-hidden">
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
              {t.searchByCorrespondence}
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              {t.findEquivalentFiltersDescription}
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
                    <label className="text-sm font-medium text-gray-700">{t.competitorReference}</label>
                    <Input
                      placeholder={t.correspondencePlaceholder}
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
                          {t.searchButton}
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>

                <p className="text-sm text-gray-500 text-center mt-4">
                  {t.enterCompetitorReferenceDescription}
                </p>

                {/* {t.advancedFilters} */}
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
                          {t.clearFilters}
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
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t.searchByCorrespondence}</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {t.enterCompetitorReferenceDescription}
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
          <ReferenceSearchResultDisplay
            loading={loading}
            result={searchResult}
            hasSearched={hasSearched}
            onClear={clearFilters}
          />
        )}
      </main>
      
      <SharedFooter />
    </div>
  )
}

export default function CorrespondenceFilterPage() {
  const t = useTranslation()
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 overflow-x-hidden">
        <MobileHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-20">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <RefreshCw className="h-12 w-12 text-orange-600 animate-spin" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Chargement...</h3>
            <p className="text-lg text-gray-600">{t.preparingCorrespondenceSearch}</p>
          </div>
        </div>
        <SharedFooter />
      </div>
    }>
      <CorrespondenceFilterContent />
    </Suspense>
  )
}