export const REFERENCE_SEARCH_FIELDS = [
  "ALSAFA",
  "SAFI",
  "SARL_F",
  "FLEETG",
  "ASAS",
  "MECA_F",
  "REF_ORG",
  "MANN",
  "UFI",
  "HIFI",
  "WIX",
  "filtration_system",
] as const

export const ALSAFA_REFERENCE_FIELDS = [
  "ALSAFA",
  "SAFI",
  "FLEETG",
  "ASAS",
  "SARL_F",
  "MECA_F",
] as const

const DELIMITER_PATTERN = /[\s\-_/.]+/g

/** Canonical key: lowercase, strip spaces/hyphens/slashes/underscores/dots. */
export function normalizeReference(value: string): string {
  return value.trim().toLowerCase().replace(DELIMITER_PATTERN, "")
}

export function referencesMatch(a: string, b: string): boolean {
  return normalizeReference(a) === normalizeReference(b)
}

/** Escape special characters for PostgREST ilike patterns and OR filter strings. */
export function escapeIlike(value: string): string {
  return value.replace(/[%_,\\]/g, "\\$&")
}

/** Normalize spacing/hyphens/slashes so OBS100, OBS-100, OBS 100, OBS/100 are interchangeable. */
export function buildReferenceVariants(value: string): string[] {
  const base = value.trim()
  if (!base) return []

  const noDelims = base.replace(DELIMITER_PATTERN, "")
  const withHyphen = noDelims.replace(/([A-Za-z])(?=\d)|(?<=\d)(?=[A-Za-z])/g, "$&-")
  const withSpace = noDelims.replace(/([A-Za-z])(?=\d)|(?<=\d)(?=[A-Za-z])/g, "$& ")
  const withSlash = noDelims.replace(/([A-Za-z])(?=\d)|(?<=\d)(?=[A-Za-z])/g, "$&/")
  const swapToSpace = base.replace(/[-_/]+/g, " ")
  const swapToHyphen = base.replace(/[\s_/]+/g, "-")
  const swapToSlash = base.replace(/[\s\-_]+/g, "/")

  return Array.from(
    new Set(
      [base, noDelims, withHyphen, withSpace, withSlash, swapToSpace, swapToHyphen, swapToSlash].filter(Boolean),
    ),
  )
}

export function tokenizeSearchTerm(value: string): string[] {
  return value
    .trim()
    .split(DELIMITER_PATTERN)
    .map((token) => token.trim())
    .filter(Boolean)
}

function isDigitsOnly(value: string): boolean {
  return /^\d+$/.test(value.trim())
}

/**
 * Build ilike pre-filter patterns for DB candidate lookup.
 * Uses full-term variants only — no loose numeric partials.
 */
export function buildPrefilterPatterns(searchTerm: string): string[] {
  const base = searchTerm.trim()
  if (!base) return []

  return Array.from(new Set(buildReferenceVariants(base).map((v) => escapeIlike(v))))
}

export function buildReferenceSearchConditions(
  searchTerm: string,
  fields: readonly string[] = REFERENCE_SEARCH_FIELDS,
): string[] {
  const conditions: string[] = []

  for (const value of buildPrefilterPatterns(searchTerm)) {
    const pattern = `%${value}%`
    for (const field of fields) {
      conditions.push(`${field}.ilike.${pattern}`)
    }
  }

  return conditions
}

export function buildExtraReferenceSearchConditions(searchTerm: string): string[] {
  return buildPrefilterPatterns(searchTerm).map((value) => `ref_value.ilike.%${value}%`)
}

export function matchesReferenceValue(fieldValue: string | null | undefined, searchTerm: string): boolean {
  if (!fieldValue) return false
  return referencesMatch(fieldValue, searchTerm)
}

export function productMatchesReference(
  product: Record<string, unknown>,
  searchTerm: string,
  fields: readonly string[] = REFERENCE_SEARCH_FIELDS,
): { field: string; value: string } | null {
  for (const field of fields) {
    const value = product[field]
    if (typeof value === "string" && referencesMatch(value, searchTerm)) {
      return { field, value }
    }
  }
  return null
}

export function findMatchingReferenceField(
  product: Record<string, unknown>,
  searchTerm: string,
  fields: readonly string[] = REFERENCE_SEARCH_FIELDS,
): { field: string; value: string } | null {
  return productMatchesReference(product, searchTerm, fields)
}

export function buildReferenceSearchSuggestions(searchTerm: string): string[] {
  const trimmed = searchTerm.trim()
  if (!trimmed) return []

  const suggestions: string[] = []
  const variants = buildReferenceVariants(trimmed).filter((v) => v !== trimmed)

  if (isDigitsOnly(trimmed)) {
    suggestions.push(`OBS-${trimmed}`)
    suggestions.push(`OBS ${trimmed}`)
    suggestions.push(`OBS/${trimmed}`)
  } else if (tokenizeSearchTerm(trimmed).length >= 2) {
    const [prefix, ...rest] = tokenizeSearchTerm(trimmed)
    if (prefix && rest.length > 0) {
      suggestions.push(`${prefix}-${rest.join("-")}`)
      suggestions.push(`${prefix}${rest.join("")}`)
    }
  }

  for (const variant of variants.slice(0, 4)) {
    if (!suggestions.includes(variant)) {
      suggestions.push(variant)
    }
  }

  return suggestions.slice(0, 5)
}
