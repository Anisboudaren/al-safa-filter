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

type SearchPattern = { value: string; partial: boolean }

/** Normalize spacing/hyphens so OBS100, OBS-100, and OBS 100 are interchangeable. */
export function buildReferenceVariants(value: string): string[] {
  const base = value.trim()
  if (!base) return []

  const noDelims = base.replace(/[\s-_]+/g, "")
  const withHyphen = noDelims.replace(/([A-Za-z])(?=\d)|(?<=\d)(?=[A-Za-z])/g, "$&-")
  const withSpace = noDelims.replace(/([A-Za-z])(?=\d)|(?<=\d)(?=[A-Za-z])/g, "$& ")
  const swapToSpace = base.replace(/-/g, " ")
  const swapToHyphen = base.replace(/\s+/g, "-")

  return Array.from(
    new Set([base, noDelims, withHyphen, withSpace, swapToSpace, swapToHyphen].filter(Boolean)),
  )
}

export function tokenizeSearchTerm(value: string): string[] {
  return value
    .trim()
    .split(/[\s\-_/]+/)
    .map((token) => token.trim())
    .filter(Boolean)
}

function isNumericToken(token: string): boolean {
  return /^\d+$/.test(token)
}

function isShortAlphaToken(token: string): boolean {
  return /^[a-zA-Z]+$/.test(token) && token.length <= 3
}

function addPattern(patterns: Map<string, boolean>, value: string, partial: boolean) {
  const normalized = value.trim()
  if (!normalized) return

  const existing = patterns.get(normalized)
  if (existing === undefined) {
    patterns.set(normalized, partial)
    return
  }

  if (partial && !existing) {
    patterns.set(normalized, true)
  }
}

/**
 * Build search patterns for reference lookups.
 * - "100" matches "OBS 100" via partial numeric token search
 * - "obs 100" matches formatting variants and still finds via "100"
 * - "obs" alone stays exact to avoid matching unrelated refs like "OBS-123"
 */
export function buildSearchPatterns(searchTerm: string): SearchPattern[] {
  const base = searchTerm.trim()
  if (!base) return []

  const patterns = new Map<string, boolean>()
  const tokens = tokenizeSearchTerm(base)

  if (tokens.length === 1) {
    const token = tokens[0]

    if (isShortAlphaToken(token)) {
      for (const variant of buildReferenceVariants(base)) {
        addPattern(patterns, variant, false)
      }
      return Array.from(patterns.entries()).map(([value, partial]) => ({ value, partial }))
    }

    for (const variant of buildReferenceVariants(base)) {
      addPattern(patterns, variant, true)
    }
    return Array.from(patterns.entries()).map(([value, partial]) => ({ value, partial }))
  }

  for (const variant of buildReferenceVariants(base)) {
    addPattern(patterns, variant, true)
  }

  for (const token of tokens) {
    if (isNumericToken(token) || (/\d/.test(token) && token.length >= 2)) {
      for (const variant of buildReferenceVariants(token)) {
        addPattern(patterns, variant, true)
      }
    } else if (!isShortAlphaToken(token)) {
      for (const variant of buildReferenceVariants(token)) {
        addPattern(patterns, variant, true)
      }
    }
  }

  return Array.from(patterns.entries()).map(([value, partial]) => ({ value, partial }))
}

function formatPostgrestPattern(value: string, partial: boolean): string {
  return partial ? `%${value}%` : value
}

export function buildReferenceSearchConditions(
  searchTerm: string,
  fields: readonly string[] = REFERENCE_SEARCH_FIELDS,
): string[] {
  const conditions: string[] = []

  for (const { value, partial } of buildSearchPatterns(searchTerm)) {
    const pattern = formatPostgrestPattern(value, partial)
    for (const field of fields) {
      conditions.push(`${field}.ilike.${pattern}`)
    }
  }

  return conditions
}

export function matchesReferenceValue(fieldValue: string | null | undefined, searchTerm: string): boolean {
  if (!fieldValue) return false

  const normalizedField = fieldValue.toLowerCase()
  return buildSearchPatterns(searchTerm).some(({ value, partial }) => {
    const normalizedValue = value.toLowerCase()
    return partial ? normalizedField.includes(normalizedValue) : normalizedField === normalizedValue
  })
}

export function findMatchingReferenceField(
  product: Record<string, unknown>,
  searchTerm: string,
  fields: readonly string[] = REFERENCE_SEARCH_FIELDS,
): { field: string; value: string } | null {
  for (const field of fields) {
    const value = product[field]
    if (typeof value === "string" && matchesReferenceValue(value, searchTerm)) {
      return { field, value }
    }
  }

  return null
}
