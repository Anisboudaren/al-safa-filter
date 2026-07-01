import { describe, expect, it } from "vitest"
import {
  buildReferenceSearchSuggestions,
  buildReferenceVariants,
  normalizeReference,
  referencesMatch,
} from "./search-utils"

describe("normalizeReference", () => {
  it("treats OBS-100, obs 100, obs100, and obs/100 as equivalent", () => {
    expect(normalizeReference("OBS-100")).toBe("obs100")
    expect(normalizeReference("obs 100")).toBe("obs100")
    expect(normalizeReference("obs100")).toBe("obs100")
    expect(normalizeReference("obs/100")).toBe("obs100")
  })

  it("normalizes HU-925/4X variants", () => {
    expect(normalizeReference("HU-925/4X")).toBe("hu9254x")
    expect(normalizeReference("hu9254x")).toBe("hu9254x")
    expect(referencesMatch("HU-925/4X", "hu 925 4x")).toBe(true)
  })

  it("does not match numeric-only input to full references", () => {
    expect(referencesMatch("100", "OBS-100")).toBe(false)
  })
})

describe("buildReferenceVariants", () => {
  it("includes slash variants", () => {
    const variants = buildReferenceVariants("obs/100")
    expect(variants).toContain("obs100")
    expect(variants).toContain("obs-100")
    expect(variants).toContain("obs 100")
  })
})

describe("buildReferenceSearchSuggestions", () => {
  it("suggests prefix formats for digits-only input", () => {
    const suggestions = buildReferenceSearchSuggestions("100")
    expect(suggestions.some((s) => s.includes("OBS"))).toBe(true)
  })
})
