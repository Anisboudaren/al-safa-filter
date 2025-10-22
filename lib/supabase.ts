import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qbpgclcndalyzflariuv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGdjbGNuZGFseXpmbGFyaXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzE3NDAsImV4cCI6MjA3MDA0Nzc0MH0.eZlhQh-FO4ndlTQu8LZpwyvs6DAr4EAWn71DX9278Mw'

export const supabase = createClient(supabaseUrl, supabaseKey)

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
