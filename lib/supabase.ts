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
  divers_vehicules: string | null
  filtration_system: string
  Ptte: string | null
  MANN: string | null
  UFI: string | null
  HIFI: string | null
  WIX: string | null
  created_at?: string
  updated_at?: string
}
