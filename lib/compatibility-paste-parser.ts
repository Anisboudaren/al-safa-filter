/** Tokens that belong to an engine string (not a new model name). Longer first for matching. */
const ENGINE_TOKENS = [
  "ECO-DYNAMICS +",
  "ECO-DYNAMICS",
  "TRACTION INTEGRALE",
  "FLEXFUEL",
  "SPORTSWAGON",
  "HATCHBACK",
  "DECAPOTABLE",
  "GRANDTOUR",
  "GRAND TOUR",
  "FASTBACK",
  "E-POWER",
  "E-TECH",
  "DIG-T",
  "DIG-S",
  "T-GDI",
  "T-GDi",
  "TGDI",
  "PICK-UP",
  "NISMO",
  "HYBRID",
  "BERLINE",
  "ACTIVE",
  "TROPHY",
  "BREAK",
  "COUPE",
  "COMBI",
  "CVVT",
  "ROADSTER",
  "STEPWAY",
  "EXPRESS",
  "VAN",
  "MPI",
  "GDI",
  "GTI",
  "LPG",
  "SCE",
  "CVT",
  "AWD",
  "4X4",
  "4WD",
  "RS",
  "GT",
  "V6",
  "16V",
  "24V",
  "ECO2",
]

/** Tokens used only for unglue (must not include model Roman numerals like II/III). */
const UNGLUE_END_TOKENS = ENGINE_TOKENS.filter(
  (t) => !["II", "III", "IV", "V"].includes(t.toUpperCase()),
)

const SECTION_SUFFIXES = ["VU/LT/LW", "4X4", "4WD"] as const

const BODY_STYLE_TOKENS = [
  "SPORTSWAGON",
  "HATCHBACK",
  "DECAPOTABLE",
  "GRANDTOUR",
  "GRAND TOUR",
  "FASTBACK",
  "PICK-UP",
  "BERLINE",
  "BREAK",
  "COUPE",
  "COMBI",
  "ROADSTER",
  "STEPWAY",
  "VAN",
  "MPV",
]

const DRIVE_TOKENS = ["TRACTION INTEGRALE", "4X4", "4WD", "AWD"]

const DISPLACEMENT_RE = /\d+[.,]\d+/

export type ParseStatus = "ok" | "warning" | "error"

export type CompatibilityPasteRow = {
  id: string
  brand_display_name: string
  brand_slug: string
  section_tag: string
  model_name: string
  engine_name: string
  displacement: string | null
  fuel_type: string | null
  technology: string | null
  power_output: string | null
  variant: string
  body_style: string
  drive_type: string
  parseStatus: ParseStatus
  warning: string | null
  included: boolean
}

export type CompatibilityPasteParseResult = {
  rows: CompatibilityPasteRow[]
  brandCount: number
  warningCount: number
  errorCount: number
  softWarning: string | null
}

function slugifyBrand(displayName: string): string {
  return displayName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function isEngineToken(word: string): boolean {
  const upper = word.toUpperCase()
  return ENGINE_TOKENS.some((t) => t.toUpperCase() === upper)
}

/** Insert newlines before glued model starts after engine-ending tokens. */
export function unglueCompatibilityText(raw: string): { text: string; gluedSplits: number } {
  let text = raw.replace(/\r\n/g, "\n")
  let gluedSplits = 0

  // Engine token immediately followed by a model-like capital letter (no space)
  const sorted = [...UNGLUE_END_TOKENS].sort((a, b) => b.length - a.length)
  for (const token of sorted) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    // After token: optional spaces, then a letter that starts a new model (not another engine token start)
    const re = new RegExp(`(${escaped})(?=[A-Za-z])`, "gi")
    text = text.replace(re, (match, _tok, offset, full) => {
      const after = full.slice(offset + match.length)
      // Don't split if following text starts with an engine token
      const nextWord = after.match(/^[A-Za-z0-9'+\-/]+/)?.[0] ?? ""
      if (isEngineToken(nextWord)) return match
      // Need a displacement ahead to consider this a new model
      if (!DISPLACEMENT_RE.test(after.slice(0, 80))) return match
      gluedSplits += 1
      return `${match}\n`
    })
  }

  return { text, gluedSplits }
}

type SectionHeader = {
  brandDisplay: string
  brandSlug: string
  sectionTag: string
  bodyStyleFromSection: string
  driveFromSection: string
}

function parseSectionHeader(line: string): SectionHeader | null {
  const trimmed = line.trim()
  if (!trimmed) return null
  if (DISPLACEMENT_RE.test(trimmed)) return null

  // Must be mostly uppercase letters / digits / punctuation (brand header style)
  const letters = trimmed.replace(/[^A-Za-z]/g, "")
  if (letters.length < 2) return null
  const upperRatio = letters.replace(/[^A-Z]/g, "").length / letters.length
  if (upperRatio < 0.7) return null

  let sectionTag = ""
  let brandDisplay = trimmed
  let bodyStyleFromSection = ""
  let driveFromSection = ""

  for (const suffix of SECTION_SUFFIXES) {
    const re = new RegExp(`\\s+${suffix.replace(/\//g, "\\/")}$`, "i")
    if (re.test(trimmed)) {
      sectionTag = suffix
      brandDisplay = trimmed.replace(re, "").trim()
      if (suffix === "VU/LT/LW") bodyStyleFromSection = "VU/LT/LW"
      if (suffix === "4X4" || suffix === "4WD") driveFromSection = suffix
      break
    }
  }

  if (!brandDisplay) return null

  return {
    brandDisplay: brandDisplay.toUpperCase(),
    brandSlug: slugifyBrand(brandDisplay),
    sectionTag,
    bodyStyleFromSection,
    driveFromSection,
  }
}

function guessFuel(engine: string): string | null {
  const u = engine.toUpperCase()
  if (/\bLPG\b/.test(u)) return "LPG"
  if (/\bHYBRID\b/.test(u) || /\bE-TECH\b/.test(u) || /\bE-POWER\b/.test(u)) return "Hybrid"
  if (/\bFLEXFUEL\b/.test(u)) return "Flexfuel"
  return "Gasoline"
}

function guessTechnology(engine: string): string | null {
  const patterns = [
    "T-GDI",
    "T-GDi",
    "TGDI",
    "DIG-T",
    "DIG-S",
    "SCE",
    "MPI",
    "CVVT",
    "GDI",
    "GTI",
    "E-TECH",
    "E-POWER",
    "HYBRID 48V",
    "HYBRID",
  ]
  const u = engine
  for (const p of patterns) {
    if (u.toUpperCase().includes(p.toUpperCase())) return p
  }
  return null
}

function guessPower(engine: string): string | null {
  // Prefer trailing standalone power numbers (not displacement)
  const matches = [...engine.matchAll(/\b(\d{2,3})\b/g)].map((m) => m[1])
  const displacement = engine.match(DISPLACEMENT_RE)?.[0]
  const filtered = matches.filter((n) => {
    if (!displacement) return true
    const dispInt = displacement.replace(",", ".").split(".")[0]
    // skip the integer part of displacement if it appears alone oddly
    return n !== dispInt || Number(n) >= 80
  })
  // Typical power range
  const powers = filtered.filter((n) => {
    const v = Number(n)
    return v >= 80 && v <= 500
  })
  return powers.length ? powers[powers.length - 1] : null
}

function extractTrailingTags(engineRaw: string): {
  engine_name: string
  body_style: string
  drive_type: string
  variant: string
} {
  let engine = engineRaw.trim()
  let body_style = ""
  let drive_type = ""
  let variant = ""

  const tryStrip = (tokens: string[], assign: (t: string) => void) => {
    let changed = true
    while (changed) {
      changed = false
      for (const token of [...tokens].sort((a, b) => b.length - a.length)) {
        const re = new RegExp(`(?:^|\\s+)${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i")
        if (re.test(engine)) {
          engine = engine.replace(re, "").trim()
          assign(token)
          changed = true
          break
        }
      }
    }
  }

  tryStrip(DRIVE_TOKENS, (t) => {
    drive_type = drive_type || t
  })
  tryStrip(BODY_STYLE_TOKENS, (t) => {
    body_style = body_style || t
  })

  // Remaining trailing alphanumeric extras as variant (e.g. NISMO) only if not core engine tech
  const nismoRe = /\s+NISMO(?:\s+RS)?$/i
  if (nismoRe.test(engine)) {
    const m = engine.match(nismoRe)
    variant = (m?.[0] ?? "").trim()
    engine = engine.replace(nismoRe, "").trim()
  }

  return { engine_name: engine, body_style, drive_type, variant }
}

function parseVehicleLine(
  line: string,
  section: SectionHeader,
  fromGlued: boolean,
  id: string,
): CompatibilityPasteRow {
  const trimmed = line.trim()
  const dispMatch = trimmed.match(DISPLACEMENT_RE)

  if (!dispMatch || dispMatch.index === undefined) {
    return {
      id,
      brand_display_name: section.brandDisplay,
      brand_slug: section.brandSlug,
      section_tag: section.sectionTag,
      model_name: trimmed,
      engine_name: "",
      displacement: null,
      fuel_type: null,
      technology: null,
      power_output: null,
      variant: "",
      body_style: section.bodyStyleFromSection,
      drive_type: section.driveFromSection,
      parseStatus: "error",
      warning: "No engine displacement found — fix model/engine split",
      included: false,
    }
  }

  let model_name = trimmed.slice(0, dispMatch.index).trim()
  let engineRaw = trimmed.slice(dispMatch.index).trim()

  // Strip Roman numerals / II stuck to model incorrectly stay in model
  if (!model_name) {
    return {
      id,
      brand_display_name: section.brandDisplay,
      brand_slug: section.brandSlug,
      section_tag: section.sectionTag,
      model_name: "",
      engine_name: engineRaw,
      displacement: dispMatch[0],
      fuel_type: guessFuel(engineRaw),
      technology: guessTechnology(engineRaw),
      power_output: guessPower(engineRaw),
      variant: "",
      body_style: section.bodyStyleFromSection,
      drive_type: section.driveFromSection,
      parseStatus: "error",
      warning: "Missing model name",
      included: false,
    }
  }

  const extracted = extractTrailingTags(engineRaw)
  let body_style = section.bodyStyleFromSection || extracted.body_style
  let drive_type = section.driveFromSection || extracted.drive_type
  let variant = extracted.variant

  // If model ends with body/drive tokens somehow, leave as-is (admin can edit)

  const warnings: string[] = []
  if (fromGlued) warnings.push("Split from glued text — verify model/engine")

  return {
    id,
    brand_display_name: section.brandDisplay,
    brand_slug: section.brandSlug,
    section_tag: section.sectionTag,
    model_name,
    engine_name: extracted.engine_name,
    displacement: dispMatch[0],
    fuel_type: guessFuel(extracted.engine_name),
    technology: guessTechnology(extracted.engine_name),
    power_output: guessPower(extracted.engine_name),
    variant,
    body_style,
    drive_type,
    parseStatus: warnings.length ? "warning" : "ok",
    warning: warnings.length ? warnings.join("; ") : null,
    included: true,
  }
}

let rowIdCounter = 0
function nextId(): string {
  rowIdCounter += 1
  return `row-${rowIdCounter}`
}

export function parseCompatibilityPaste(raw: string): CompatibilityPasteParseResult {
  rowIdCounter = 0
  const { text, gluedSplits } = unglueCompatibilityText(raw)
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  const rows: CompatibilityPasteRow[] = []
  let current: SectionHeader | null = null
  const brands = new Set<string>()
  let lineWasGluedContext = gluedSplits > 0

  for (const line of lines) {
    const header = parseSectionHeader(line)
    if (header) {
      current = header
      brands.add(header.brandSlug)
      continue
    }

    if (!current) {
      rows.push({
        id: nextId(),
        brand_display_name: "",
        brand_slug: "",
        section_tag: "",
        model_name: line,
        engine_name: "",
        displacement: null,
        fuel_type: null,
        technology: null,
        power_output: null,
        variant: "",
        body_style: "",
        drive_type: "",
        parseStatus: "error",
        warning: "No brand header above this line",
        included: false,
      })
      continue
    }

    // Detect if this line itself looks like it was produced by unglue (heuristic: from original glued)
    const fromGlued = lineWasGluedContext && !line.includes("\n")
    rows.push(parseVehicleLine(line, current, fromGlued && gluedSplits > 0, nextId()))
  }

  // Refine glued warnings: only mark warning if original had no newline between rows
  // For simplicity, if unglue inserted splits, mark warnings on all non-error rows that came after split
  if (gluedSplits > 0) {
    for (const row of rows) {
      if (row.parseStatus === "ok") {
        row.parseStatus = "warning"
        row.warning = row.warning ?? "Split from glued text — verify model/engine"
      }
    }
  }

  const warningCount = rows.filter((r) => r.parseStatus === "warning").length
  const errorCount = rows.filter((r) => r.parseStatus === "error").length
  const brandCount = brands.size

  let softWarning: string | null = null
  if (brandCount > 3 || (rows.length > 0 && warningCount / rows.length > 0.2)) {
    softWarning =
      "Results look messy — try pasting one brand (or one brand section) at a time for better quality."
  }

  return { rows, brandCount, warningCount, errorCount, softWarning }
}

export function brandSlugFromDisplay(displayName: string): string {
  return slugifyBrand(displayName)
}
