import { describe, expect, it } from "vitest"
import {
  parseCompatibilityPaste,
  unglueCompatibilityText,
} from "./compatibility-paste-parser"

describe("unglueCompatibilityText", () => {
  it("splits glued model+engine rows", () => {
    const { text, gluedSplits } = unglueCompatibilityText(
      "DOKKER 1,6 LPGDOKKER II 1,6 LPGDOKKER II 1,6 PICK-UP",
    )
    expect(gluedSplits).toBeGreaterThan(0)
    expect(text).toContain("LPG\nDOKKER II")
    expect(text).toContain("LPG\nDOKKER II 1,6 PICK-UP")
  })

  it("splits T-GDI glued to next model", () => {
    const { text } = unglueCompatibilityText("I 10 1,0 T-GDIi20 II 1,0 T-GDi")
    expect(text).toMatch(/T-GDI\ni20/i)
  })
})

describe("parseCompatibilityPaste", () => {
  it("parses clean newline-separated brand section", () => {
    const raw = `DACIA
DOKKER 1,6 LPG
DOKKER II 1,6 LPG
DUSTER II 1,6 SCE 115 4X4`

    const result = parseCompatibilityPaste(raw)
    expect(result.brandCount).toBe(1)
    expect(result.errorCount).toBe(0)
    expect(result.rows).toHaveLength(3)

    expect(result.rows[0]).toMatchObject({
      brand_display_name: "DACIA",
      brand_slug: "dacia",
      model_name: "DOKKER",
      engine_name: "1,6 LPG",
      displacement: "1,6",
      fuel_type: "LPG",
    })

    expect(result.rows[2]).toMatchObject({
      model_name: "DUSTER II",
      engine_name: "1,6 SCE 115",
      drive_type: "4X4",
      technology: "SCE",
      power_output: "115",
    })
  })

  it("handles brand section tags VU/LT/LW and 4X4", () => {
    const raw = `DACIA VU/LT/LW
DOKKER EXPRESS II 1,6 LPG
KIA 4X4
SPORTAGE 1,6 GDI`

    const result = parseCompatibilityPaste(raw)
    expect(result.brandCount).toBe(2)

    const dacia = result.rows.find((r) => r.model_name.includes("DOKKER"))
    expect(dacia?.brand_slug).toBe("dacia")
    expect(dacia?.section_tag).toBe("VU/LT/LW")
    expect(dacia?.body_style).toBe("VU/LT/LW")

    const kia = result.rows.find((r) => r.model_name === "SPORTAGE")
    expect(kia?.brand_slug).toBe("kia")
    expect(kia?.drive_type).toBe("4X4")
  })

  it("parses glued multi-row paste with warnings", () => {
    const raw = `HYUNDAI
I 10 1,0 T-GDIi20 II 1,0 T-GDiI 20 II 1,4`

    const result = parseCompatibilityPaste(raw)
    expect(result.rows.length).toBeGreaterThanOrEqual(2)
    expect(result.warningCount).toBeGreaterThan(0)
    expect(result.rows.every((r) => r.brand_display_name === "HYUNDAI")).toBe(true)
  })

  it("marks lines without brand as errors", () => {
    const result = parseCompatibilityPaste("DOKKER 1,6 LPG")
    expect(result.errorCount).toBe(1)
    expect(result.rows[0].parseStatus).toBe("error")
  })

  it("extracts body style from engine trailer", () => {
    const result = parseCompatibilityPaste(`HYUNDAI
I 30 1,4 BREAK`)
    expect(result.rows[0].engine_name).toBe("1,4")
    expect(result.rows[0].body_style).toBe("BREAK")
  })
})
