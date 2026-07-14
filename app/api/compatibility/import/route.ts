import { NextRequest, NextResponse } from "next/server"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import {
  getServerSupabaseConfig,
  supabaseMisconfiguredResponse,
} from "@/lib/supabase-server"
import { requireAdmin } from "@/lib/admin-auth"
import { brandSlugFromDisplay } from "@/lib/compatibility-paste-parser"

type ImportRow = {
  brand_display_name: string
  section_tag?: string
  model_name: string
  engine_name: string
  displacement?: string | null
  fuel_type?: string | null
  technology?: string | null
  power_output?: string | null
  variant?: string
  body_style?: string
  drive_type?: string
}

type Counts = {
  brands_created: number
  engines_created: number
  vehicles_created: number
  links_created: number
  links_skipped: number
  rows_failed: number
}

function norm(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase()
}

function emptyEq(a: string | null | undefined, b: string | null | undefined): boolean {
  return norm(a) === norm(b)
}

async function resolveOrCreateBrand(
  supabase: SupabaseClient,
  displayName: string,
  counts: Counts,
  cache: Map<string, { id: number; name: string; display_name: string }>,
) {
  const slug = brandSlugFromDisplay(displayName)
  const cacheKey = slug || displayName.toLowerCase()
  if (cache.has(cacheKey)) return cache.get(cacheKey)!

  const { data: bySlug } = await supabase.from("brands").select("*").eq("name", slug).maybeSingle()
  if (bySlug) {
    cache.set(cacheKey, bySlug)
    return bySlug
  }

  const { data: allBrands } = await supabase.from("brands").select("*")
  const byDisplay = (allBrands ?? []).find(
    (b) => norm(b.display_name) === norm(displayName) || norm(b.name) === norm(slug),
  )
  if (byDisplay) {
    cache.set(cacheKey, byDisplay)
    return byDisplay
  }

  const { data: created, error } = await supabase
    .from("brands")
    .insert({ name: slug, display_name: displayName.trim() })
    .select()
    .single()

  if (error || !created) {
    throw new Error(error?.message || "Failed to create brand")
  }

  counts.brands_created += 1
  cache.set(cacheKey, created)
  return created
}

async function resolveOrCreateEngine(
  supabase: SupabaseClient,
  brandId: number,
  row: ImportRow,
  counts: Counts,
  cache: Map<string, { id: number }>,
) {
  const engineName = row.engine_name.trim()
  const cacheKey = `${brandId}::${norm(engineName)}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)!

  const { data: engines } = await supabase.from("engines").select("*").eq("brand_id", brandId)
  const existing = (engines ?? []).find((e) => norm(e.name) === norm(engineName))
  if (existing) {
    cache.set(cacheKey, existing)
    return existing
  }

  const { data: created, error } = await supabase
    .from("engines")
    .insert({
      brand_id: brandId,
      name: engineName,
      displacement: row.displacement || null,
      fuel_type: row.fuel_type || null,
      technology: row.technology || null,
      power_output: row.power_output || null,
    })
    .select()
    .single()

  if (error || !created) {
    throw new Error(error?.message || "Failed to create engine")
  }

  counts.engines_created += 1
  cache.set(cacheKey, created)
  return created
}

async function resolveOrCreateVehicle(
  supabase: SupabaseClient,
  engineId: number,
  row: ImportRow,
  counts: Counts,
  cache: Map<string, { id: number }>,
) {
  const model = row.model_name.trim()
  const variant = row.variant ?? ""
  const body = row.body_style ?? ""
  const drive = row.drive_type ?? ""
  const cacheKey = `${engineId}::${norm(model)}::${norm(variant)}::${norm(body)}::${norm(drive)}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)!

  const { data: vehicles } = await supabase.from("vehicles").select("*").eq("engine_id", engineId)
  const existing = (vehicles ?? []).find(
    (v) =>
      emptyEq(v.model_name, model) &&
      emptyEq(v.variant, variant) &&
      emptyEq(v.body_style, body) &&
      emptyEq(v.drive_type, drive),
  )
  if (existing) {
    cache.set(cacheKey, existing)
    return existing
  }

  const { data: created, error } = await supabase
    .from("vehicles")
    .insert({
      engine_id: engineId,
      model_name: model,
      variant: variant || null,
      body_style: body || null,
      drive_type: drive || null,
    })
    .select()
    .single()

  if (error || !created) {
    throw new Error(error?.message || "Failed to create vehicle")
  }

  counts.vehicles_created += 1
  cache.set(cacheKey, created)
  return created
}

async function linkProductVehicle(
  supabase: SupabaseClient,
  productId: number,
  vehicleId: number,
  counts: Counts,
) {
  const { data: existing } = await supabase
    .from("product_compatibilities")
    .select("id")
    .eq("product_id", productId)
    .eq("vehicle_id", vehicleId)
    .maybeSingle()

  if (existing) {
    counts.links_skipped += 1
    return { skipped: true }
  }

  const { error } = await supabase.from("product_compatibilities").insert({
    product_id: productId,
    vehicle_id: vehicleId,
  })

  if (error) {
    throw new Error(error.message || "Failed to link product")
  }

  counts.links_created += 1
  return { skipped: false }
}

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin(request)
    if (denied) return denied

    const cfg = getServerSupabaseConfig()
    if (!cfg) return supabaseMisconfiguredResponse()
    const supabase = createClient(cfg.url, cfg.key)

    const body = await request.json()
    const product_id = Number(body.product_id)
    const rows: ImportRow[] = Array.isArray(body.rows) ? body.rows : []

    if (!product_id || Number.isNaN(product_id)) {
      return NextResponse.json({ error: "product_id is required" }, { status: 400 })
    }
    if (rows.length === 0) {
      return NextResponse.json({ error: "rows array is required" }, { status: 400 })
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", product_id)
      .maybeSingle()

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const counts: Counts = {
      brands_created: 0,
      engines_created: 0,
      vehicles_created: 0,
      links_created: 0,
      links_skipped: 0,
      rows_failed: 0,
    }

    const brandCache = new Map<string, { id: number; name: string; display_name: string }>()
    const engineCache = new Map<string, { id: number }>()
    const vehicleCache = new Map<string, { id: number }>()
    const rowResults: Array<{ index: number; ok: boolean; error?: string; vehicle_id?: number }> = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      try {
        if (!row.brand_display_name?.trim() || !row.model_name?.trim() || !row.engine_name?.trim()) {
          throw new Error("brand_display_name, model_name, and engine_name are required")
        }

        const brand = await resolveOrCreateBrand(supabase, row.brand_display_name, counts, brandCache)
        const engine = await resolveOrCreateEngine(supabase, brand.id, row, counts, engineCache)
        const vehicle = await resolveOrCreateVehicle(supabase, engine.id, row, counts, vehicleCache)
        await linkProductVehicle(supabase, product_id, vehicle.id, counts)

        rowResults.push({ index: i, ok: true, vehicle_id: vehicle.id })
      } catch (err: any) {
        counts.rows_failed += 1
        rowResults.push({ index: i, ok: false, error: err?.message || "Unknown error" })
      }
    }

    return NextResponse.json(
      {
        message: "Import completed",
        counts,
        rowResults,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Compatibility import error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    )
  }
}
