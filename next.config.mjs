/** @type {import('next').NextConfig} */
const nextConfig = {
  // Client bundles only see NEXT_PUBLIC_* from .env. If you use SUPABASE_URL / SUPABASE_ANON_KEY
  // without the prefix, map them here so "use client" pages (e.g. catalog) still get the values.
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.SUPABASE_ANON_KEY ??
      process.env.SUPABASE_KEY ??
      "",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
