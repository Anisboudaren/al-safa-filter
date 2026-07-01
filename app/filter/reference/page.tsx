"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { searchProductByReference, type ReferenceSearchResult } from "@/lib/reference-search"
import { ReferenceSearchResultDisplay } from "@/components/reference-search-result"
import MobileHeader from "@/components/mobile-header"
import { SharedFooter } from "@/components/shared-footer"
import { useTranslation } from "@/components/language-provider"

export default function ReferenceFilterPage() {
  const t = useTranslation()
  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState("")
  const [searchResult, setSearchResult] = useState<ReferenceSearchResult | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const fetchProducts = async () => {
    if (!reference.trim()) {
      return
    }

    setLoading(true)
    setHasSearched(true)

    const result = await searchProductByReference(supabase, reference)
    setSearchResult(result)
    setLoading(false)
  }

  const handleSearch = () => {
    fetchProducts()
  }

  const clearFilters = () => {
    setReference("")
    setSearchResult(null)
    setHasSearched(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <MobileHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 sm:pt-20">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t.filterReference}</label>
                <Input
                  placeholder={t.referencePlaceholder}
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="h-12"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
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
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{t.enterExactOrPartialReferenceDescription}</p>
          </div>
        ) : (
          <div className="mt-8">
            <ReferenceSearchResultDisplay
              loading={loading}
              result={searchResult}
              hasSearched={hasSearched}
              onClear={clearFilters}
            />
          </div>
        )}
      </main>
      <SharedFooter />
    </div>
  )
}
