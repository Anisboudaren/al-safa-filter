import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.SUPABASE_KEY

if (!supabaseUrl) {
  throw new Error('Supabase URL is not configured')
}

if (!supabaseKey) {
  throw new Error('Supabase anon key is not configured')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'sb-qbpgclcndalyzflariuv-auth-token',
    detectSessionInUrl: true
  }
})

export type Product = {
  id?: number
  name: string
  description: string | null
  image_url: string | null
  ALSAFA: string | null
  Ext: string | null
  Int: string | null
  H: string | null
  SAFI: string | null
  SARL_F: string | null
  FLEETG: string | null
  ASAS: string | null
  MECA_F: string | null
  REF_ORG: string | null
  filtration_system: string
  Ptte: string | null
  MANN: string | null
  UFI: string | null
  HIFI: string | null
  WIX: string | null
  created_at?: string
  updated_at?: string
}

export type Brand = {
  id?: number
  name: string
  display_name: string
  logo_url?: string | null
  created_at?: string
  updated_at?: string
}

export type Engine = {
  id?: number
  brand_id: number
  name: string
  displacement?: string | null
  fuel_type?: string | null
  technology?: string | null
  power_output?: string | null
  created_at?: string
  updated_at?: string
}

export type Vehicle = {
  id?: number
  engine_id: number
  model_name: string
  body_style?: string | null
  variant?: string | null
  drive_type?: string | null
  year_from?: number | null
  year_to?: number | null
  created_at?: string
  updated_at?: string
}

export type ProductCompatibility = {
  id?: number
  product_id: number
  vehicle_id: number
  created_at?: string
}

export type CompatibilityData = {
  brand: Brand
  engine: Engine
  vehicle: Vehicle
}

export type ProductExtraReference = {
  id?: number
  product_id: number
  ref_name: string
  ref_value: string | null
  created_at?: string
}
