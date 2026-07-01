"use client"

import { Search, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/components/language-provider"
import type { ReferenceSearchResult } from "@/lib/reference-search"

interface ReferenceSearchHelpProps {
  result: Extract<ReferenceSearchResult, { status: "not_found" }>
  onClear?: () => void
}

export function ReferenceSearchHelp({ result, onClear }: ReferenceSearchHelpProps) {
  const t = useTranslation()

  const title =
    result.reason === "ambiguous"
      ? t.referenceSearchAmbiguous.replace("{count}", String(result.matchCount ?? 0))
      : t.referenceSearchNoMatch

  const description =
    result.reason === "ambiguous" ? t.referenceSearchAmbiguousHint : t.referenceSearchNoMatchHint

  return (
    <div className="text-center py-12 max-w-2xl mx-auto">
      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      <Card className="text-left mb-6 border-orange-100 bg-orange-50/50">
        <CardContent className="p-5">
          <h4 className="font-semibold text-gray-900 mb-2">{t.referenceSearchRulesTitle}</h4>
          <p className="text-sm text-gray-700 whitespace-pre-line">{t.referenceSearchRulesBody}</p>
        </CardContent>
      </Card>

      {result.suggestions.length > 0 && (
        <Card className="text-left mb-6 border-blue-100 bg-blue-50/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-gray-900">{t.referenceSearchSuggestionsTitle}</h4>
            </div>
            <ul className="space-y-1">
              {result.suggestions.map((suggestion) => (
                <li key={suggestion} className="text-sm text-gray-700 font-mono">
                  {suggestion}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {onClear && (
        <Button onClick={onClear} variant="outline">
          {t.clearFilters}
        </Button>
      )}
    </div>
  )
}
