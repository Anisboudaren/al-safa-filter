"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit, Trash2, Save, X, Car, Cpu, Building2, Search, Filter, Eye, CheckSquare, Square, Loader2 } from "lucide-react"
import { type Brand, type Engine, type Vehicle, type ProductCompatibility } from "@/lib/supabase"

interface CompatibilityManagerProps {
  productId?: number
  onClose?: () => void
}

export function CompatibilityManager({ productId, onClose }: CompatibilityManagerProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [allBrands, setAllBrands] = useState<Brand[]>([])
  const [engines, setEngines] = useState<Engine[]>([])
  const [allEngines, setAllEngines] = useState<Engine[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [productCompatibilities, setProductCompatibilities] = useState<ProductCompatibility[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingBrands, setLoadingBrands] = useState(false)
  const [loadingEngines, setLoadingEngines] = useState(false)
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [loadingCompatibilities, setLoadingCompatibilities] = useState(false)
  const [viewMode, setViewMode] = useState<'add' | 'browse'>('add')
  
  // Form states
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [selectedEngines, setSelectedEngines] = useState<Engine[]>([])
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([])
  
  // New item forms
  const [newBrand, setNewBrand] = useState({ name: "", display_name: "" })
  const [newEngine, setNewEngine] = useState({ 
    brand_id: "", 
    name: "", 
    displacement: "", 
    fuel_type: "", 
    technology: "", 
    power_output: "" 
  })
  const [newVehicle, setNewVehicle] = useState({ 
    engine_id: "", 
    model_name: "", 
    body_style: "", 
    variant: "", 
    drive_type: "", 
    year_from: "", 
    year_to: "" 
  })
  
  // Form errors
  const [brandErrors, setBrandErrors] = useState({ name: "", display_name: "" })
  const [engineErrors, setEngineErrors] = useState({ brand_id: "", name: "" })
  const [vehicleErrors, setVehicleErrors] = useState({ engine_id: "", model_name: "" })

  useEffect(() => {
    fetchBrands()
    fetchAllBrandsAndEngines()
    if (productId) {
      fetchProductCompatibilities()
    }
  }, [productId])

  const showSuccess = (message: string) => {
    alert('✓ ' + message)
  }

  const showError = (message: string) => {
    alert('✗ ' + message)
  }

  const fetchBrands = async () => {
    setLoadingBrands(true)
    try {
      const response = await fetch('/api/compatibility/brands')
      const result = await response.json()
      
      if (!response.ok) {
        console.error('Error fetching brands:', result.error || 'Unknown error')
        showError(`Error fetching brands: ${result.error || 'Unknown error'}`)
        return
      }
      setBrands(result.data || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
      showError(`Error fetching brands: ${error instanceof Error ? error.message : 'Network error'}`)
    } finally {
      setLoadingBrands(false)
    }
  }

  const fetchAllBrandsAndEngines = async () => {
    setLoadingBrands(true)
    setLoadingEngines(true)
    try {
      const [brandsRes, enginesRes] = await Promise.all([
        fetch('/api/compatibility/brands'),
        fetch('/api/compatibility/engines?with_brands=true')
      ])
      
      const brandsResult = await brandsRes.json()
      const enginesResult = await enginesRes.json()
      
      if (brandsRes.ok) {
        setAllBrands(brandsResult.data || [])
      } else {
        console.error('Error fetching brands:', brandsResult.error || 'Unknown error')
        showError(`Error fetching brands: ${brandsResult.error || 'Unknown error'}`)
      }
      
      if (enginesRes.ok) {
        setAllEngines(enginesResult.data || [])
      } else {
        console.error('Error fetching engines:', enginesResult.error || 'Unknown error')
        showError(`Error fetching engines: ${enginesResult.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      showError(`Error fetching data: ${error instanceof Error ? error.message : 'Network error'}`)
    } finally {
      setLoadingBrands(false)
      setLoadingEngines(false)
    }
  }

  const fetchEngines = async (brandId: number) => {
    setLoadingEngines(true)
    try {
      const response = await fetch(`/api/compatibility/engines?brand_id=${brandId}`)
      const result = await response.json()
      
      if (!response.ok) {
        console.error('Error fetching engines:', result.error || 'Unknown error')
        showError(`Error fetching engines: ${result.error || 'Unknown error'}`)
        return
      }
      setEngines(result.data || [])
    } catch (error) {
      console.error('Error fetching engines:', error)
      showError(`Error fetching engines: ${error instanceof Error ? error.message : 'Network error'}`)
    } finally {
      setLoadingEngines(false)
    }
  }

  const fetchVehiclesForEngines = async (engineIds: number[]) => {
    if (engineIds.length === 0) {
      setVehicles([])
      return
    }

    setLoadingVehicles(true)
    try {
      const response = await fetch(`/api/compatibility/vehicles?engine_ids=${engineIds.join(',')}`)
      const result = await response.json()
      
      if (!response.ok) {
        console.error('Error fetching vehicles:', result.error || 'Unknown error')
        showError(`Error fetching vehicles: ${result.error || 'Unknown error'}`)
        return
      }
      setVehicles(result.data || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      showError(`Error fetching vehicles: ${error instanceof Error ? error.message : 'Network error'}`)
    } finally {
      setLoadingVehicles(false)
    }
  }

  const fetchProductCompatibilities = async () => {
    if (!productId) {
      setProductCompatibilities([])
      return
    }
    
    setLoadingCompatibilities(true)
    try {
      const response = await fetch(`/api/compatibility?product_id=${productId}`)
      const result = await response.json()
      
      if (!response.ok) {
        console.error('Error fetching compatibilities:', result.error || 'Unknown error')
        showError(`Error fetching compatibilities: ${result.error || 'Unknown error'}`)
        return
      }
      setProductCompatibilities(result.data || [])
    } catch (error) {
      console.error('Error fetching compatibilities:', error)
      showError(`Error fetching compatibilities: ${error instanceof Error ? error.message : 'Network error'}`)
    } finally {
      setLoadingCompatibilities(false)
    }
  }

  const handleBrandSelect = (brand: Brand) => {
    setSelectedBrand(brand)
    setSelectedEngines([])
    setSelectedVehicles([])
    setEngines([])
    setVehicles([])
    fetchEngines(brand.id!)
  }

  const handleEngineToggle = (engine: Engine) => {
    const isSelected = selectedEngines.some(e => e.id === engine.id)
    let newSelectedEngines: Engine[]
    
    if (isSelected) {
      newSelectedEngines = selectedEngines.filter(e => e.id !== engine.id)
    } else {
      newSelectedEngines = [...selectedEngines, engine]
    }
    
    setSelectedEngines(newSelectedEngines)
    setSelectedVehicles([])
    fetchVehiclesForEngines(newSelectedEngines.map(e => e.id!))
  }

  const handleVehicleToggle = (vehicle: Vehicle) => {
    const isSelected = selectedVehicles.some(v => v.id === vehicle.id)
    
    if (isSelected) {
      setSelectedVehicles(selectedVehicles.filter(v => v.id !== vehicle.id))
    } else {
      setSelectedVehicles([...selectedVehicles, vehicle])
    }
  }

  const addCompatibilities = async () => {
    if (!productId || selectedVehicles.length === 0) {
      showError('No product selected for compatibility management')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          vehicle_ids: selectedVehicles.map(v => v.id)
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        console.error('Error adding compatibilities:', result.error || 'Unknown error')
        showError(`Error adding compatibilities: ${result.error || 'Unknown error'}`)
      } else {
        showSuccess(result.message || 'Compatibilities added successfully')
        fetchProductCompatibilities()
        setSelectedVehicles([])
      }
    } catch (error) {
      console.error('Error adding compatibilities:', error)
      showError(`Error adding compatibilities: ${error instanceof Error ? error.message : 'Network error'}`)
    }
    
    setLoading(false)
  }

  const removeCompatibility = async (compatibilityId: number) => {
    setLoading(true)
    
    try {
      const response = await fetch(`/api/compatibility?id=${compatibilityId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        showError(result.error || 'Error removing compatibility')
      } else {
        showSuccess(result.message || 'Compatibility removed successfully')
        fetchProductCompatibilities()
      }
    } catch (error) {
      showError('Error removing compatibility')
    }
    
    setLoading(false)
  }

  // Brand management
  const addBrand = async () => {
    // Validate
    const errors = { name: "", display_name: "" }
    let hasErrors = false
    
    if (!newBrand.name.trim()) {
      errors.name = "Brand name is required"
      hasErrors = true
    } else if (!/^[a-z0-9-]+$/.test(newBrand.name.trim())) {
      errors.name = "Use lowercase letters, numbers, and hyphens only"
      hasErrors = true
    }
    
    if (!newBrand.display_name.trim()) {
      errors.display_name = "Display name is required"
      hasErrors = true
    }
    
    setBrandErrors(errors)
    if (hasErrors) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/compatibility/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBrand.name.trim().toLowerCase(),
          display_name: newBrand.display_name.trim()
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        showError(result.error || 'Error adding brand')
        if (result.error?.includes('name')) {
          setBrandErrors({ ...errors, name: result.error })
        }
      } else {
        showSuccess(result.message || 'Brand added successfully')
        setBrands([...brands, result.data])
        setNewBrand({ name: "", display_name: "" })
        setBrandErrors({ name: "", display_name: "" })
        fetchBrands()
        fetchAllBrandsAndEngines()
      }
    } catch (error) {
      showError('Error adding brand')
    }
    
    setLoading(false)
  }

  // Engine management
  const addEngine = async () => {
    // Validate
    const errors = { brand_id: "", name: "" }
    let hasErrors = false
    
    const brandId = newEngine.brand_id || selectedBrand?.id
    if (!brandId) {
      errors.brand_id = "Please select a brand"
      hasErrors = true
    }
    
    if (!newEngine.name.trim()) {
      errors.name = "Engine name is required"
      hasErrors = true
    }
    
    setEngineErrors(errors)
    if (hasErrors) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/compatibility/engines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_id: Number(brandId),
          name: newEngine.name.trim(),
          displacement: newEngine.displacement.trim() || null,
          fuel_type: newEngine.fuel_type.trim() || null,
          technology: newEngine.technology.trim() || null,
          power_output: newEngine.power_output.trim() || null
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        showError(result.error || 'Error adding engine')
      } else {
        showSuccess(result.message || 'Engine added successfully')
        setEngines([...engines, result.data])
        setNewEngine({ 
          brand_id: "", 
          name: "", 
          displacement: "", 
          fuel_type: "", 
          technology: "", 
          power_output: "" 
        })
        setEngineErrors({ brand_id: "", name: "" })
        if (selectedBrand && Number(brandId) === selectedBrand.id) {
          fetchEngines(selectedBrand.id!)
        }
        fetchAllBrandsAndEngines()
      }
    } catch (error) {
      showError('Error adding engine')
    }
    
    setLoading(false)
  }

  // Vehicle management
  const addVehicle = async () => {
    // Validate
    const errors = { engine_id: "", model_name: "" }
    let hasErrors = false
    
    const engineId = newVehicle.engine_id || (selectedEngines.length === 1 ? selectedEngines[0].id : null)
    const engineIds = engineId ? [Number(engineId)] : selectedEngines.map(e => e.id)
    
    if (engineIds.length === 0) {
      errors.engine_id = "Please select at least one engine"
      hasErrors = true
    }
    
    if (!newVehicle.model_name.trim()) {
      errors.model_name = "Model name is required"
      hasErrors = true
    }
    
    setVehicleErrors(errors)
    if (hasErrors) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/compatibility/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engine_ids: engineIds,
          model_name: newVehicle.model_name.trim(),
          body_style: newVehicle.body_style.trim() || null,
          variant: newVehicle.variant.trim() || null,
          drive_type: newVehicle.drive_type.trim() || null,
          year_from: newVehicle.year_from.trim() || null,
          year_to: newVehicle.year_to.trim() || null
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        showError(result.error || 'Error adding vehicle(s)')
      } else {
        showSuccess(result.message || 'Vehicle(s) added successfully')
        if (selectedEngines.length > 0) {
          fetchVehiclesForEngines(selectedEngines.map(e => e.id!))
        }
        setNewVehicle({ 
          engine_id: "", 
          model_name: "", 
          body_style: "", 
          variant: "", 
          drive_type: "", 
          year_from: "", 
          year_to: "" 
        })
        setVehicleErrors({ engine_id: "", model_name: "" })
        fetchAllBrandsAndEngines()
      }
    } catch (error) {
      showError('Error adding vehicle(s)')
    }
    
    setLoading(false)
  }

  return (
    <div className="space-y-6 p-6 min-h-screen" style={{backgroundColor: '#111827'}}>
      {/* Header with Mode Toggle */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">Vehicle Compatibility Manager</h2>
        <div className="flex gap-3">
          <Button 
            variant={viewMode === 'add' ? "default" : "outline"} 
            onClick={() => setViewMode('add')}
            disabled={loading}
            style={viewMode === 'add' 
              ? {backgroundColor: '#f97316', color: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'} 
              : {backgroundColor: '#374151', borderColor: '#4b5563', color: '#ffffff'}}
            className={viewMode === 'add' ? '' : 'hover:bg-gray-600'}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Data
          </Button>
          <Button 
            variant={viewMode === 'browse' ? "default" : "outline"}
            onClick={() => setViewMode('browse')}
            disabled={loading}
            style={viewMode === 'browse' 
              ? {backgroundColor: '#f97316', color: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'} 
              : {backgroundColor: '#374151', borderColor: '#4b5563', color: '#ffffff'}}
            className={viewMode === 'browse' ? '' : 'hover:bg-gray-600'}
          >
            <Eye className="h-4 w-4 mr-2" />
            Browse Data
          </Button>
          {onClose && (
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
              style={{backgroundColor: '#374151', borderColor: '#4b5563', color: '#ffffff'}}
              className="hover:bg-gray-600"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      {viewMode === 'browse' ? (
        <div className="space-y-6">
          {/* Browse Existing Data */}
          <Card className="shadow-xl" style={{backgroundColor: '#1f2937', borderColor: '#374151'}}>
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-3 text-xl">
                <Building2 className="h-6 w-6 text-orange-500" />
                All Brands
                <Badge variant="secondary" className="ml-auto bg-orange-500/20 text-orange-400 border-orange-500">
                  {allBrands.length} Total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {allBrands.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No brands in database yet</p>
                  <p className="text-gray-500 text-sm mt-1">Switch to "Add Data" to create your first brand</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {allBrands.map((brand) => (
                    <div 
                      key={brand.id} 
                      className="border-2 border-orange-500/50 bg-orange-500/10 text-orange-400 py-3 px-4 rounded-lg text-center font-medium hover:border-orange-500 hover:bg-orange-500/20 transition-all"
                    >
                      {brand.display_name}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl" style={{backgroundColor: '#1f2937', borderColor: '#374151'}}>
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-3 text-xl">
                <Cpu className="h-6 w-6 text-orange-500" />
                All Engines
                <Badge variant="secondary" className="ml-auto bg-orange-500/20 text-orange-400 border-orange-500">
                  {allEngines.length} Total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {allEngines.length === 0 ? (
                <div className="text-center py-12">
                  <Cpu className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No engines in database yet</p>
                  <p className="text-gray-500 text-sm mt-1">Switch to "Add Data" to create your first engine</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {allEngines.map((engine: any) => (
                    <div 
                      key={engine.id} 
                      className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-orange-500/50 transition-all"
                    >
                      <Badge variant="outline" className="border-blue-500 text-blue-400 px-3 py-1">
                        {engine.brands?.display_name || 'Unknown'}
                      </Badge>
                      <span className="text-white font-medium text-lg">{engine.name}</span>
                      {engine.displacement && (
                        <span className="text-gray-400">{engine.displacement}L</span>
                      )}
                      {engine.fuel_type && (
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          {engine.fuel_type}
                        </Badge>
                      )}
                      {engine.power_output && (
                        <span className="text-gray-500 text-sm ml-auto">{engine.power_output} HP</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current Compatibilities */}
          {productId ? (
            <Card className="shadow-xl" style={{backgroundColor: '#1f2937', borderColor: '#374151'}}>
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <Car className="h-6 w-6 text-orange-500" />
                  Current Compatibilities
                  <Badge variant="secondary" className="ml-auto bg-orange-500/20 text-orange-400 border-orange-500">
                    {productCompatibilities.length} Total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loadingCompatibilities ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-12 w-12 text-orange-500 mx-auto mb-3 animate-spin" />
                    <p className="text-gray-400">Loading compatibilities...</p>
                  </div>
                ) : productCompatibilities.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No compatibilities added yet</p>
                    <p className="text-gray-500 text-sm mt-1">Add vehicles below to make this product compatible</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {productCompatibilities.map((comp: any) => (
                      <div key={comp.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-orange-500/50 transition-all">
                        <div className="flex items-center gap-4 flex-wrap">
                          <Badge variant="outline" className="border-blue-500 text-blue-400 px-3 py-1">
                            {comp.vehicles.engines.brands.display_name}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-green-400" />
                            <span className="text-gray-300">{comp.vehicles.engines.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-orange-400" />
                            <span className="text-white font-medium">{comp.vehicles.model_name}</span>
                          </div>
                          {comp.vehicles.variant && (
                            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                              {comp.vehicles.variant}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeCompatibility(comp.id)}
                          disabled={loading}
                          className="shrink-0"
                        >
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Add New Compatibility */}
          {productId ? (
            <Card className="shadow-xl" style={{backgroundColor: '#1f2937', borderColor: '#374151'}}>
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl flex items-center gap-3">
                  <Plus className="h-6 w-6 text-orange-500" />
                  Add New Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                {/* Brand Selection */}
                <div className="space-y-3">
                  <Label className="text-gray-300 text-base font-semibold flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white text-sm">1</span>
                    Select Brand
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {loadingBrands ? (
                      <div className="col-span-full flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
                        <span className="text-gray-400">Loading brands...</span>
                      </div>
                    ) : brands.length === 0 ? (
                      <div className="col-span-full text-center py-8">
                        <Building2 className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400">No brands available</p>
                        <p className="text-gray-500 text-sm">Add brands using the form below</p>
                      </div>
                    ) : (
                      brands.map((brand) => (
                        <Button
                          key={brand.id}
                          variant={selectedBrand?.id === brand.id ? "default" : "outline"}
                          size="lg"
                          onClick={() => handleBrandSelect(brand)}
                          disabled={loading || loadingBrands}
                          className={selectedBrand?.id === brand.id 
                            ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg border-2 border-orange-500" 
                            : "border-2 border-gray-600 text-white bg-gray-800 hover:text-white hover:border-orange-500 hover:bg-gray-700"
                          }
                        >
                          {brand.display_name}
                        </Button>
                      ))
                    )}
                  </div>
                </div>

                {/* Engine Multi-Selection */}
                {selectedBrand && (
                  <div className="space-y-3">
                    <Label className="text-gray-300 text-base font-semibold flex items-center gap-2">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white text-sm">2</span>
                      Select Engines (Multiple)
                      {selectedEngines.length > 0 && (
                        <Badge variant="secondary" className="ml-auto bg-orange-500/20 text-orange-400 border-orange-500">
                          {selectedEngines.length} Selected
                        </Badge>
                      )}
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-h-[280px] overflow-y-auto pr-2">
                      {loadingEngines ? (
                        <div className="col-span-full flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
                          <span className="text-gray-400">Loading engines...</span>
                        </div>
                      ) : engines.length === 0 ? (
                        <div className="col-span-full text-center py-8">
                          <Cpu className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-400">No engines available for this brand</p>
                          <p className="text-gray-500 text-sm">Add engines using the form below</p>
                        </div>
                      ) : (
                        engines.map((engine) => {
                          const isSelected = selectedEngines.some(e => e.id === engine.id)
                          return (
                            <div
                              key={engine.id}
                              onClick={() => !loading && !loadingEngines && handleEngineToggle(engine)}
                              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                isSelected 
                                  ? 'bg-orange-500/20 border-orange-500 shadow-lg' 
                                  : 'bg-gray-900 border-gray-600 hover:border-orange-400 hover:bg-gray-800/50'
                              } ${loading || loadingEngines ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {isSelected ? (
                                <CheckSquare className="h-5 w-5 text-orange-500 flex-shrink-0" />
                              ) : (
                                <Square className="h-5 w-5 text-gray-500 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <div className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                  {engine.name}
                                </div>
                                {(engine.displacement || engine.fuel_type) && (
                                  <div className="text-sm text-gray-400 mt-1">
                                    {engine.displacement && `${engine.displacement}L`}
                                    {engine.displacement && engine.fuel_type && ' • '}
                                    {engine.fuel_type}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Vehicle Multi-Selection */}
                {selectedEngines.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-gray-300 text-base font-semibold flex items-center gap-2">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white text-sm">3</span>
                      Select Vehicles (Multiple)
                      {selectedVehicles.length > 0 && (
                        <Badge variant="secondary" className="ml-auto bg-orange-500/20 text-orange-400 border-orange-500">
                          {selectedVehicles.length} Selected
                        </Badge>
                      )}
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-h-[350px] overflow-y-auto pr-2">
                      {loadingVehicles ? (
                        <div className="col-span-full flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
                          <span className="text-gray-400">Loading vehicles...</span>
                        </div>
                      ) : vehicles.length === 0 ? (
                        <div className="col-span-full text-center py-8">
                          <Car className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-400">No vehicles available for selected engines</p>
                          <p className="text-gray-500 text-sm">Add vehicles using the form below</p>
                        </div>
                      ) : (
                        vehicles.map((vehicle) => {
                          const isSelected = selectedVehicles.some(v => v.id === vehicle.id)
                          return (
                            <div
                              key={vehicle.id}
                              onClick={() => !loading && !loadingVehicles && handleVehicleToggle(vehicle)}
                              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                isSelected 
                                  ? 'bg-orange-500/20 border-orange-500 shadow-lg' 
                                  : 'bg-gray-900 border-gray-600 hover:border-orange-400 hover:bg-gray-800/50'
                              } ${loading || loadingVehicles ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {isSelected ? (
                                <CheckSquare className="h-5 w-5 text-orange-500 flex-shrink-0" />
                              ) : (
                                <Square className="h-5 w-5 text-gray-500 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <div className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                  {vehicle.model_name}
                                </div>
                                {(vehicle.variant || vehicle.body_style) && (
                                  <div className="text-sm text-gray-400 mt-1">
                                    {vehicle.variant} {vehicle.body_style}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Add Compatibility Button */}
                {selectedVehicles.length > 0 && (
                  <div className="pt-4 border-t border-gray-700">
                    <Button 
                      onClick={addCompatibilities} 
                      disabled={loading} 
                      size="lg"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg text-base py-6"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5 mr-2" />
                          Add {selectedVehicles.length} Compatibilit{selectedVehicles.length === 1 ? 'y' : 'ies'}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-xl" style={{backgroundColor: '#1f2937', borderColor: '#374151'}}>
              <CardContent className="p-8 text-center">
                <Car className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Product Compatibility Management</h3>
                <p className="text-gray-400 mb-4">
                  To manage product compatibilities, please select a product from the Products tab first.
                </p>
                <p className="text-gray-500 text-sm">
                  This section allows you to add vehicle compatibility data for specific products.
                </p>
              </CardContent>
            </Card>
          )}

          <Separator className="bg-gray-700 my-8" />

          {/* Add Data Forms Section */}
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Add New Data</h3>
              <p className="text-gray-400">Create brands, engines, and vehicles below</p>
            </div>

            {/* Add New Brand */}
            <Card className="shadow-xl" style={{backgroundColor: '#1f2937', borderColor: '#374151'}}>
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-orange-500" />
                  Add New Brand
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="brand-name" className="text-gray-300 font-medium">
                      Brand Name (URL friendly) *
                      <span className="text-xs text-gray-500 block mt-1">Lowercase, numbers, hyphens only (e.g., "dacia")</span>
                    </Label>
                    <Input
                      id="brand-name"
                      value={newBrand.name}
                      onChange={(e) => {
                        setNewBrand({ ...newBrand, name: e.target.value })
                        if (brandErrors.name) setBrandErrors({ ...brandErrors, name: "" })
                      }}
                      placeholder="dacia"
                      disabled={loading}
                      className={`h-11 ${brandErrors.name ? 'border-red-500' : ''}`}
                      style={{backgroundColor: '#111827', borderColor: brandErrors.name ? '#ef4444' : '#4b5563', color: '#ffffff'}}
                    />
                    {brandErrors.name && (
                      <p className="text-red-400 text-sm mt-1">{brandErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand-display" className="text-gray-300 font-medium">
                      Display Name *
                      <span className="text-xs text-gray-500 block mt-1">How it appears to users (e.g., "DACIA")</span>
                    </Label>
                    <Input
                      id="brand-display"
                      value={newBrand.display_name}
                      onChange={(e) => {
                        setNewBrand({ ...newBrand, display_name: e.target.value })
                        if (brandErrors.display_name) setBrandErrors({ ...brandErrors, display_name: "" })
                      }}
                      placeholder="DACIA"
                      disabled={loading}
                      className={`h-11 ${brandErrors.display_name ? 'border-red-500' : ''}`}
                      style={{backgroundColor: '#111827', borderColor: brandErrors.display_name ? '#ef4444' : '#4b5563', color: '#ffffff'}}
                    />
                    {brandErrors.display_name && (
                      <p className="text-red-400 text-sm mt-1">{brandErrors.display_name}</p>
                    )}
                  </div>
                </div>
                <Button 
                  onClick={addBrand} 
                  disabled={loading || !newBrand.name || !newBrand.display_name}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add Brand
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Add New Engine */}
            <Card className="shadow-xl" style={{backgroundColor: '#1f2937', borderColor: '#374151'}}>
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl flex items-center gap-3">
                  <Cpu className="h-6 w-6 text-orange-500" />
                  Add New Engine
                  {selectedBrand && (
                    <Badge variant="secondary" className="ml-2 bg-orange-500/20 text-orange-400 border-orange-500">
                      For {selectedBrand.display_name}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-0">
                <div className="space-y-2">
                  <Label htmlFor="engine-brand-select" className="text-gray-300 font-medium">
                    Select Brand *
                    {selectedBrand && (
                      <span className="text-xs text-orange-400 block mt-1">Currently selected: {selectedBrand.display_name}</span>
                    )}
                  </Label>
                  <select
                    id="engine-brand-select"
                    value={newEngine.brand_id || selectedBrand?.id || ""}
                    onChange={(e) => {
                      const brandId = e.target.value
                      setNewEngine({ ...newEngine, brand_id: brandId })
                      if (engineErrors.brand_id) setEngineErrors({ ...engineErrors, brand_id: "" })
                      if (brandId) {
                        const brand = allBrands.find(b => b.id === Number(brandId))
                        if (brand) handleBrandSelect(brand)
                      }
                    }}
                    disabled={loading || loadingBrands}
                    className={`h-11 px-3 rounded-md ${engineErrors.brand_id ? 'border-red-500' : 'border-gray-600'} bg-gray-900 text-white focus:border-orange-500 focus:outline-none`}
                    style={{backgroundColor: '#111827', borderColor: engineErrors.brand_id ? '#ef4444' : '#4b5563', color: '#ffffff'}}
                  >
                    <option value="">-- Select a brand --</option>
                    {allBrands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.display_name}
                      </option>
                    ))}
                  </select>
                  {engineErrors.brand_id && (
                    <p className="text-red-400 text-sm mt-1">{engineErrors.brand_id}</p>
                  )}
                  {allBrands.length === 0 && (
                    <p className="text-gray-500 text-sm mt-1">No brands available. Add a brand above first.</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="engine-name" className="text-gray-300 font-medium">
                      Engine Name *
                      <span className="text-xs text-gray-500 block mt-1">e.g., "1,6 SCE 115"</span>
                    </Label>
                    <Input
                      id="engine-name"
                      value={newEngine.name}
                      onChange={(e) => {
                        setNewEngine({ ...newEngine, name: e.target.value })
                        if (engineErrors.name) setEngineErrors({ ...engineErrors, name: "" })
                      }}
                      placeholder="1,6 SCE 115"
                      disabled={loading}
                      className={`h-11 ${engineErrors.name ? 'border-red-500' : ''}`}
                      style={{backgroundColor: '#111827', borderColor: engineErrors.name ? '#ef4444' : '#4b5563', color: '#ffffff'}}
                    />
                    {engineErrors.name && (
                      <p className="text-red-400 text-sm mt-1">{engineErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engine-displacement" className="text-gray-300 font-medium">
                      Displacement
                      <span className="text-xs text-gray-500 block mt-1">e.g., "1,6" (in liters)</span>
                    </Label>
                    <Input
                      id="engine-displacement"
                      value={newEngine.displacement}
                      onChange={(e) => setNewEngine({ ...newEngine, displacement: e.target.value })}
                      placeholder="1,6"
                      disabled={loading}
                      className="h-11"
                      style={{backgroundColor: '#111827', borderColor: '#4b5563', color: '#ffffff'}}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="engine-fuel" className="text-gray-300 font-medium">
                      Fuel Type
                      <span className="text-xs text-gray-500 block mt-1">e.g., "LPG", "Diesel", "Gasoline"</span>
                    </Label>
                    <Input
                      id="engine-fuel"
                      value={newEngine.fuel_type}
                      onChange={(e) => setNewEngine({ ...newEngine, fuel_type: e.target.value })}
                      placeholder="LPG"
                      disabled={loading}
                      className="h-11"
                      style={{backgroundColor: '#111827', borderColor: '#4b5563', color: '#ffffff'}}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engine-tech" className="text-gray-300 font-medium">
                      Technology
                      <span className="text-xs text-gray-500 block mt-1">e.g., "SCE", "Turbo", "Hybrid"</span>
                    </Label>
                    <Input
                      id="engine-tech"
                      value={newEngine.technology}
                      onChange={(e) => setNewEngine({ ...newEngine, technology: e.target.value })}
                      placeholder="SCE"
                      disabled={loading}
                      className="h-11"
                      style={{backgroundColor: '#111827', borderColor: '#4b5563', color: '#ffffff'}}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engine-power" className="text-gray-300 font-medium">
                      Power Output
                      <span className="text-xs text-gray-500 block mt-1">e.g., "115" (in HP)</span>
                    </Label>
                    <Input
                      id="engine-power"
                      value={newEngine.power_output}
                      onChange={(e) => setNewEngine({ ...newEngine, power_output: e.target.value })}
                      placeholder="115"
                      disabled={loading}
                      className="h-11"
                      style={{backgroundColor: '#111827', borderColor: '#4b5563', color: '#ffffff'}}
                    />
                  </div>
                </div>
                <Button 
                  onClick={addEngine} 
                  disabled={loading || !newEngine.name || (!newEngine.brand_id && !selectedBrand)}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add Engine
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Add New Vehicle */}
            <Card className="shadow-xl" style={{backgroundColor: '#1f2937', borderColor: '#374151'}}>
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl flex items-center gap-3">
                  <Car className="h-6 w-6 text-orange-500" />
                  Add New Vehicle
                  {selectedEngines.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-orange-500/20 text-orange-400 border-orange-500">
                      For {selectedEngines.length} Engine{selectedEngines.length === 1 ? '' : 's'}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-0">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-engine-select" className="text-gray-300 font-medium">
                    Select Engine *
                    {selectedEngines.length > 0 && (
                      <span className="text-xs text-orange-400 block mt-1">
                        {selectedEngines.length} engine{selectedEngines.length === 1 ? '' : 's'} selected from compatibility flow
                      </span>
                    )}
                  </Label>
                  <select
                    id="vehicle-engine-select"
                    value={newVehicle.engine_id || ""}
                    onChange={(e) => {
                      setNewVehicle({ ...newVehicle, engine_id: e.target.value })
                      if (vehicleErrors.engine_id) setVehicleErrors({ ...vehicleErrors, engine_id: "" })
                    }}
                    disabled={loading || loadingEngines}
                    className={`h-11 px-3 rounded-md ${vehicleErrors.engine_id ? 'border-red-500' : 'border-gray-600'} bg-gray-900 text-white focus:border-orange-500 focus:outline-none`}
                    style={{backgroundColor: '#111827', borderColor: vehicleErrors.engine_id ? '#ef4444' : '#4b5563', color: '#ffffff'}}
                  >
                    <option value="">-- Select an engine --</option>
                    {allEngines.map((engine: any) => (
                      <option key={engine.id} value={engine.id}>
                        {engine.brands?.display_name || 'Unknown'} - {engine.name}
                        {engine.displacement && ` (${engine.displacement}L)`}
                      </option>
                    ))}
                  </select>
                  {vehicleErrors.engine_id && (
                    <p className="text-red-400 text-sm mt-1">{vehicleErrors.engine_id}</p>
                  )}
                  {allEngines.length === 0 && (
                    <p className="text-gray-500 text-sm mt-1">No engines available. Add an engine above first.</p>
                  )}
                  {selectedEngines.length > 0 && (
                    <p className="text-orange-400 text-sm mt-1">
                      Or use the engine{selectedEngines.length === 1 ? '' : 's'} selected above in the compatibility flow
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle-model" className="text-gray-300 font-medium">
                    Model Name *
                    <span className="text-xs text-gray-500 block mt-1">e.g., "DUSTER II"</span>
                  </Label>
                  <Input
                    id="vehicle-model"
                    value={newVehicle.model_name}
                    onChange={(e) => {
                      setNewVehicle({ ...newVehicle, model_name: e.target.value })
                      if (vehicleErrors.model_name) setVehicleErrors({ ...vehicleErrors, model_name: "" })
                    }}
                    placeholder="DUSTER II"
                    disabled={loading}
                    className={`h-11 ${vehicleErrors.model_name ? 'border-red-500' : ''}`}
                    style={{backgroundColor: '#111827', borderColor: vehicleErrors.model_name ? '#ef4444' : '#4b5563', color: '#ffffff'}}
                  />
                  {vehicleErrors.model_name && (
                    <p className="text-red-400 text-sm mt-1">{vehicleErrors.model_name}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-variant" className="text-gray-300 font-medium">
                      Variant
                      <span className="text-xs text-gray-500 block mt-1">e.g., "4X4", "Premium"</span>
                    </Label>
                    <Input
                      id="vehicle-variant"
                      value={newVehicle.variant}
                      onChange={(e) => setNewVehicle({ ...newVehicle, variant: e.target.value })}
                      placeholder="4X4"
                      disabled={loading}
                      className="h-11"
                      style={{backgroundColor: '#111827', borderColor: '#4b5563', color: '#ffffff'}}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-body" className="text-gray-300 font-medium">
                      Body Style
                      <span className="text-xs text-gray-500 block mt-1">e.g., "BREAK", "SUV", "Sedan"</span>
                    </Label>
                    <Input
                      id="vehicle-body"
                      value={newVehicle.body_style}
                      onChange={(e) => setNewVehicle({ ...newVehicle, body_style: e.target.value })}
                      placeholder="BREAK"
                      disabled={loading}
                      className="h-11"
                      style={{backgroundColor: '#111827', borderColor: '#4b5563', color: '#ffffff'}}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-drive" className="text-gray-300 font-medium">
                      Drive Type
                      <span className="text-xs text-gray-500 block mt-1">e.g., "AWD", "FWD", "RWD"</span>
                    </Label>
                    <Input
                      id="vehicle-drive"
                      value={newVehicle.drive_type}
                      onChange={(e) => setNewVehicle({ ...newVehicle, drive_type: e.target.value })}
                      placeholder="AWD"
                      disabled={loading}
                      className="h-11"
                      style={{backgroundColor: '#111827', borderColor: '#4b5563', color: '#ffffff'}}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-year-from" className="text-gray-300 font-medium">
                      Year From
                      <span className="text-xs text-gray-500 block mt-1">e.g., "2020"</span>
                    </Label>
                    <Input
                      id="vehicle-year-from"
                      type="number"
                      value={newVehicle.year_from}
                      onChange={(e) => setNewVehicle({ ...newVehicle, year_from: e.target.value })}
                      placeholder="2020"
                      disabled={loading}
                      className="h-11"
                      style={{backgroundColor: '#111827', borderColor: '#4b5563', color: '#ffffff'}}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-year-to" className="text-gray-300 font-medium">
                      Year To
                      <span className="text-xs text-gray-500 block mt-1">e.g., "2025"</span>
                    </Label>
                    <Input
                      id="vehicle-year-to"
                      type="number"
                      value={newVehicle.year_to}
                      onChange={(e) => setNewVehicle({ ...newVehicle, year_to: e.target.value })}
                      placeholder="2025"
                      disabled={loading}
                      className="h-11"
                      style={{backgroundColor: '#111827', borderColor: '#4b5563', color: '#ffffff'}}
                    />
                  </div>
                </div>
                <Button 
                  onClick={addVehicle} 
                  disabled={loading || !newVehicle.model_name || (!newVehicle.engine_id && selectedEngines.length === 0)}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add Vehicle
                      {selectedEngines.length > 0 && ` to ${selectedEngines.length} Engine${selectedEngines.length === 1 ? '' : 's'}`}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
