import type { SupabaseClient } from "@supabase/supabase-js"
import type { Product, ProductExtraReference } from "@/lib/supabase"
import {
  REFERENCE_SEARCH_FIELDS,
  buildExtraReferenceSearchConditions,
  buildReferenceSearchConditions,
  buildReferenceSearchSuggestions,
  productMatchesReference,
  referencesMatch,
} from "@/lib/search-utils"

export type ReferenceMatchVia = {
  source: "column" | "extra"
  field: string
  value: string
}

export type ReferenceSearchResult =
  | { status: "found"; product: Product; matchedVia: ReferenceMatchVia }
  | {
      status: "not_found"
      reason: "no_match" | "ambiguous" | "empty"
      matchCount?: number
      suggestions: string[]
    }

type MatchCandidate = {
  product: Product
  matchedVia: ReferenceMatchVia
}

export async function searchProductByReference(
  supabase: SupabaseClient,
  searchTerm: string,
  options?: { fields?: readonly string[] },
): Promise<ReferenceSearchResult> {
  const trimmed = searchTerm.trim()
  if (!trimmed) {
    return { status: "not_found", reason: "empty", suggestions: [] }
  }

  const fields = options?.fields ?? REFERENCE_SEARCH_FIELDS
  const suggestions = buildReferenceSearchSuggestions(trimmed)
  const candidates = new Map<number, MatchCandidate>()

  const productConditions = buildReferenceSearchConditions(trimmed, fields)
  const extraConditions = buildExtraReferenceSearchConditions(trimmed)

  const [productsResult, extraRefsResult] = await Promise.all([
    productConditions.length > 0
      ? supabase.from("products").select("*").or(productConditions.join(",")).limit(50)
      : Promise.resolve({ data: [] as Product[], error: null }),
    extraConditions.length > 0
      ? supabase.from("product_extra_references").select("*").or(extraConditions.join(",")).limit(50)
      : Promise.resolve({ data: [] as ProductExtraReference[], error: null }),
  ])

  if (productsResult.error) {
    console.error("Reference search products error:", productsResult.error)
  }
  if (extraRefsResult.error) {
    console.error("Reference search extra refs error:", extraRefsResult.error)
  }

  for (const product of productsResult.data ?? []) {
    if (!product.id) continue
    const match = productMatchesReference(product, trimmed, fields)
    if (match) {
      candidates.set(product.id, {
        product,
        matchedVia: { source: "column", field: match.field, value: match.value },
      })
    }
  }

  const matchingExtraRefs = (extraRefsResult.data ?? []).filter(
    (ref) => ref.ref_value && referencesMatch(ref.ref_value, trimmed),
  )

  const extraProductIds = [
    ...new Set(
      matchingExtraRefs
        .map((ref) => ref.product_id)
        .filter((id) => !candidates.has(id)),
    ),
  ]

  if (extraProductIds.length > 0) {
    const { data: extraProducts, error } = await supabase
      .from("products")
      .select("*")
      .in("id", extraProductIds)

    if (error) {
      console.error("Reference search extra products error:", error)
    } else {
      for (const product of extraProducts ?? []) {
        if (!product.id || candidates.has(product.id)) continue
        const extraRef = matchingExtraRefs.find((ref) => ref.product_id === product.id)
        if (extraRef?.ref_value) {
          candidates.set(product.id, {
            product,
            matchedVia: {
              source: "extra",
              field: extraRef.ref_name || "extra",
              value: extraRef.ref_value,
            },
          })
        }
      }
    }
  }

  const uniqueMatches = Array.from(candidates.values())

  if (uniqueMatches.length === 1) {
    const { product, matchedVia } = uniqueMatches[0]
    return { status: "found", product, matchedVia }
  }

  if (uniqueMatches.length > 1) {
    return {
      status: "not_found",
      reason: "ambiguous",
      matchCount: uniqueMatches.length,
      suggestions,
    }
  }

  return { status: "not_found", reason: "no_match", suggestions }
}

export type ReferenceSearchFilters = {
  origine?: string
  alsafa?: string
  filtration?: string
}

export function applyReferenceSearchFilters(
  result: ReferenceSearchResult,
  filters: ReferenceSearchFilters,
  searchTerm: string,
): ReferenceSearchResult {
  if (result.status !== "found") return result

  const { product } = result
  const suggestions = buildReferenceSearchSuggestions(searchTerm)

  if (filters.origine && filters.origine !== "all" && product.REF_ORG !== filters.origine) {
    return { status: "not_found", reason: "no_match", suggestions }
  }
  if (filters.alsafa && filters.alsafa !== "all" && product.ALSAFA !== filters.alsafa) {
    return { status: "not_found", reason: "no_match", suggestions }
  }
  if (filters.filtration && filters.filtration !== "all" && product.filtration_system !== filters.filtration) {
    return { status: "not_found", reason: "no_match", suggestions }
  }

  return result
}
