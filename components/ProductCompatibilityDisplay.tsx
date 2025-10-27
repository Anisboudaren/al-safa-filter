"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Car, Cpu, Building2, CheckCircle, Loader2 } from "lucide-react"

interface CompatibilityData {
  id: number
  product_id: number
  vehicle_id: number
  vehicles: {
    id: number
    model_name: string
    body_style?: string
    variant?: string
    drive_type?: string
    year_from?: number
    year_to?: number
    engines: {
      id: number
      name: string
      displacement?: string
      fuel_type?: string
      technology?: string
      power_output?: string
      brands: {
        id: number
        name: string
        display_name: string
      }
    }
  }
}

interface ProductCompatibilityDisplayProps {
  productId: number
  productAlsaFa?: string
}

export function ProductCompatibilityDisplay({ productId, productAlsaFa }: ProductCompatibilityDisplayProps) {
  const [compatibilities, setCompatibilities] = useState<CompatibilityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCompatibilities()
  }, [productId])

  const fetchCompatibilities = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/compatibility?product_id=${productId}`)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch compatibilities')
      }
      
      setCompatibilities(result.data || [])
    } catch (error) {
      console.error('Error fetching compatibilities:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // Group compatibilities by brand
  const groupedCompatibilities = compatibilities.reduce((acc, comp) => {
    const brandName = comp.vehicles.engines.brands.display_name
    if (!acc[brandName]) {
      acc[brandName] = []
    }
    acc[brandName].push(comp)
    return acc
  }, {} as Record<string, CompatibilityData[]>)

  if (loading) {
    return (
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            Compatibilité véhicules
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100">
        <CardTitle className="flex items-center gap-3 text-xl text-red-800">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <Car className="h-5 w-5 text-white" />
          </div>
          Compatibilité véhicules
        </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-red-600 font-medium">Erreur lors du chargement des compatibilités</p>
            <p className="text-red-500 text-sm mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compatibilities.length === 0) {
    return (
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardTitle className="flex items-center gap-3 text-xl text-gray-700">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
            <Car className="h-5 w-5 text-white" />
          </div>
          Compatibilité véhicules
        </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-gray-600" />
            </div>
            <p className="text-gray-600 font-medium">Aucune compatibilité disponible</p>
            <p className="text-gray-500 text-sm mt-2">
              Les compatibilités pour ce produit n'ont pas encore été définies.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-xl border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Car className="h-5 w-5 text-white" />
          </div>
          Compatibilité véhicules
          <Badge variant="secondary" className="ml-auto bg-orange-500/20 text-orange-600 border-orange-500">
            {compatibilities.length} véhicule{compatibilities.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          {Object.entries(groupedCompatibilities).map(([brandName, brandCompatibilities]) => (
            <div key={brandName} className="space-y-4">
              {/* Brand Title */}
              <div className="flex items-center gap-3 pb-2 border-b-2 border-orange-200">
                <Building2 className="h-6 w-6 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900">{brandName}</h3>
                <Badge variant="outline" className="border-orange-300 text-orange-700">
                  {brandCompatibilities.length} véhicule{brandCompatibilities.length > 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Vehicles and Engines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brandCompatibilities.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors"
                  >
                    <div className="space-y-3">
                      {/* Vehicle Info */}
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-orange-600" />
                        <span className="font-bold text-gray-900 text-lg">
                          {comp.vehicles.model_name}
                        </span>
                        {comp.vehicles.variant && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                            {comp.vehicles.variant}
                          </Badge>
                        )}
                      </div>

                      {/* Engine Info */}
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700 font-medium">
                          {comp.vehicles.engines.name}
                        </span>
                        {comp.vehicles.engines.displacement && (
                          <Badge variant="outline" className="border-blue-300 text-blue-700 text-xs">
                            {comp.vehicles.engines.displacement}L
                          </Badge>
                        )}
                        {comp.vehicles.engines.fuel_type && (
                          <Badge variant="outline" className="border-green-300 text-green-700 text-xs">
                            {comp.vehicles.engines.fuel_type}
                          </Badge>
                        )}
                      </div>

                      {/* Additional Details */}
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        {comp.vehicles.body_style && (
                          <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                            {comp.vehicles.body_style}
                          </span>
                        )}
                        {comp.vehicles.drive_type && (
                          <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                            {comp.vehicles.drive_type}
                          </span>
                        )}
                        {(comp.vehicles.year_from || comp.vehicles.year_to) && (
                          <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                            {comp.vehicles.year_from && comp.vehicles.year_to 
                              ? `${comp.vehicles.year_from}-${comp.vehicles.year_to}`
                              : comp.vehicles.year_from || comp.vehicles.year_to
                            }
                          </span>
                        )}
                        {comp.vehicles.engines.technology && (
                          <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                            {comp.vehicles.engines.technology}
                          </span>
                        )}
                        {comp.vehicles.engines.power_output && (
                          <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                            {comp.vehicles.engines.power_output} HP
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
