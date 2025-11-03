"use client"

import { useState, useEffect, useRef } from "react"
import { supabase, type Product, type ProductExtraReference } from "@/lib/supabase"
import { getProductImageUrlWithFallback } from "@/lib/image-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Save, Loader2, Upload, Image as ImageIcon, Car, Plus, Trash } from "lucide-react"
import { CompatibilityManager } from "./CompatibilityManager"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductEditModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export function ProductEditModal({ product, isOpen, onClose, onSave }: ProductEditModalProps) {
  const [formData, setFormData] = useState<Product>(product)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [showCompatibilityManager, setShowCompatibilityManager] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Extra references state
  const [extraReferences, setExtraReferences] = useState<ProductExtraReference[]>([])
  const [availableRefNames, setAvailableRefNames] = useState<string[]>([])
  const [loadingRefs, setLoadingRefs] = useState(false)
  
  useEffect(() => {
    setFormData(product)
    setError("")
    setSuccess(false)
    setUploadSuccess(false)
    if (product.id) {
      loadExtraReferences()
    }
    loadAvailableRefNames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])
  
  const loadExtraReferences = async () => {
    if (!product.id) return
    setLoadingRefs(true)
    try {
      const { data, error } = await supabase
        .from('product_extra_references')
        .select('*')
        .eq('product_id', product.id)
      
      if (error) {
        console.error('Error loading extra references:', error)
      } else {
        setExtraReferences(data || [])
      }
    } catch (err) {
      console.error('Error loading extra references:', err)
    } finally {
      setLoadingRefs(false)
    }
  }
  
  const loadAvailableRefNames = async () => {
    try {
      const { data, error } = await supabase
        .from('product_extra_references')
        .select('ref_name')
        .order('ref_name')
      
      if (error) {
        console.error('Error loading available ref names:', error)
      } else {
        // Get unique ref names
        const uniqueNames = [...new Set(data?.map(r => r.ref_name) || [])]
        setAvailableRefNames(uniqueNames)
      }
    } catch (err) {
      console.error('Error loading available ref names:', err)
    }
  }
  
  const handleAddExtraReference = () => {
    if (!product.id) return
    setExtraReferences([
      ...extraReferences,
      {
        product_id: product.id,
        ref_name: '',
        ref_value: ''
      }
    ])
  }
  
  const handleRemoveExtraReference = (index: number) => {
    setExtraReferences(extraReferences.filter((_, i) => i !== index))
  }
  
  const handleExtraReferenceChange = (index: number, field: 'ref_name' | 'ref_value', value: string) => {
    const updated = [...extraReferences]
    updated[index] = { ...updated[index], [field]: value }
    setExtraReferences(updated)
    
    // Update available ref names if this is a new name
    if (field === 'ref_name' && value && !availableRefNames.includes(value)) {
      setAvailableRefNames([...availableRefNames, value].sort())
    }
  }
  
  const filteredRefNames = (index: number) => {
    const currentValue = extraReferences[index]?.ref_name || ''
    if (!currentValue.trim()) return availableRefNames
    return availableRefNames.filter(name => 
      name.toLowerCase().includes(currentValue.toLowerCase())
    )
  }

  const handleInputChange = (field: keyof Product, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !product.id) return

    setUploading(true)
    setError("")
    setUploadSuccess(false)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('productId', product.id.toString())

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      // Update form data with new image URL
      setFormData(prev => ({
        ...prev,
        image_url: result.imageUrl
      }))

      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSave = async () => {
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Update product
      const { error } = await supabase
        .from("products")
        .update(formData)
        .eq("id", product.id)

      if (error) {
        setError(error.message)
        return
      }
      
      // Save extra references
      if (product.id) {
        // First, delete all existing references
        await supabase
          .from('product_extra_references')
          .delete()
          .eq('product_id', product.id)
        
        // Then insert the new ones
        const refsToInsert = extraReferences.filter(ref => ref.ref_name && ref.ref_value)
        if (refsToInsert.length > 0) {
          const { error: refsError } = await supabase
            .from('product_extra_references')
            .insert(refsToInsert)
          
          if (refsError) {
            console.error('Error saving extra references:', refsError)
          }
        }
      }
      
      setSuccess(true)
      setTimeout(() => {
        onSave()
      }, 1500)
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Edit Product</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-500 text-white bg-gray-700 hover:bg-gray-600 hover:text-white hover:border-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-700 ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert className="bg-red-900/20 border-red-800 text-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-900/20 border-green-800 text-green-200">
              <AlertDescription>Product updated successfully!</AlertDescription>
            </Alert>
          )}

          {uploadSuccess && (
            <Alert className="bg-green-900/20 border-green-800 text-green-200">
              <AlertDescription>Image uploaded successfully!</AlertDescription>
            </Alert>
          )}

          {/* Image Upload Section */}
          <div className="space-y-4 p-4 bg-gray-700/50 rounded-lg">
            <Label className="text-gray-300 text-sm font-medium">Product Image</Label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                {(() => {
                  const imageUrl = getProductImageUrlWithFallback(
                    formData.ALSAFA, 
                    formData.filtration_system, 
                    formData.image_url
                  );
                  return imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={formData.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null;
                })()}
                <div className={`w-full h-full flex items-center justify-center text-gray-400 ${getProductImageUrlWithFallback(formData.ALSAFA, formData.filtration_system, formData.image_url) ? 'hidden' : ''}`}>
                  <ImageIcon className="h-8 w-8" />
                </div>
              </div>
              <div className="flex-1">
                <Button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-400 mt-1">
                  Supports JPG, PNG, WebP. Will be converted to AVIF/WebP for optimal performance.
                </p>
                <p className="text-xs text-blue-400 mt-1">
                  💡 Automatic images are loaded from /public/images/ based on ALSAFA code and filter type.
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="alsafa" className="text-gray-300">ALSAFA</Label>
              <Input
                id="alsafa"
                value={formData.ALSAFA || ""}
                onChange={(e) => handleInputChange("ALSAFA", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ext" className="text-gray-300">Ext</Label>
              <Input
                id="ext"
                value={formData.Ext || ""}
                onChange={(e) => handleInputChange("Ext", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="int" className="text-gray-300">Int</Label>
              <Input
                id="int"
                value={formData.Int || ""}
                onChange={(e) => handleInputChange("Int", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="h" className="text-gray-300">H</Label>
              <Input
                id="h"
                value={formData.H || ""}
                onChange={(e) => handleInputChange("H", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="safi" className="text-gray-300">SAFI</Label>
              <Input
                id="safi"
                value={formData.SAFI || ""}
                onChange={(e) => handleInputChange("SAFI", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sarl_f" className="text-gray-300">SARL F</Label>
              <Input
                id="sarl_f"
                value={formData.SARL_F || ""}
                onChange={(e) => handleInputChange("SARL_F", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fleetg" className="text-gray-300">FLEETG</Label>
              <Input
                id="fleetg"
                value={formData.FLEETG || ""}
                onChange={(e) => handleInputChange("FLEETG", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asas" className="text-gray-300">ASAS</Label>
              <Input
                id="asas"
                value={formData.ASAS || ""}
                onChange={(e) => handleInputChange("ASAS", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meca_f" className="text-gray-300">MECA F</Label>
              <Input
                id="meca_f"
                value={formData.MECA_F || ""}
                onChange={(e) => handleInputChange("MECA_F", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ref_org" className="text-gray-300">REF_ORG</Label>
              <Input
                id="ref_org"
                value={formData.REF_ORG || ""}
                onChange={(e) => handleInputChange("REF_ORG", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Vehicle Compatibility</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCompatibilityManager(true)}
                className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white"
              >
                <Car className="h-4 w-4 mr-2" />
                Manage Vehicle Compatibility
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtration_system" className="text-gray-300">Filtration System</Label>
              <Select
                value={formData.filtration_system || ""}
                onValueChange={(v) => handleInputChange("filtration_system", v)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select filtration system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="huile">Oil (huile)</SelectItem>
                  <SelectItem value="gasoil">Diesel (gasoil)</SelectItem>
                  <SelectItem value="air">Air (air)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ptte" className="text-gray-300">Ptte</Label>
              <Input
                id="ptte"
                value={formData.Ptte || ""}
                onChange={(e) => handleInputChange("Ptte", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mann" className="text-gray-300">MANN</Label>
              <Input
                id="mann"
                value={formData.MANN || ""}
                onChange={(e) => handleInputChange("MANN", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ufi" className="text-gray-300">UFI</Label>
              <Input
                id="ufi"
                value={formData.UFI || ""}
                onChange={(e) => handleInputChange("UFI", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hifi" className="text-gray-300">HIFI</Label>
              <Input
                id="hifi"
                value={formData.HIFI || ""}
                onChange={(e) => handleInputChange("HIFI", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wix" className="text-gray-300">WIX</Label>
              <Input
                id="wix"
                value={formData.WIX || ""}
                onChange={(e) => handleInputChange("WIX", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Extra References Section */}
          <div className="col-span-full space-y-4 p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-sm font-medium">Extra References</Label>
              <Button
                type="button"
                onClick={handleAddExtraReference}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Reference
              </Button>
            </div>
            {loadingRefs ? (
              <div className="text-gray-400 text-sm">Loading...</div>
            ) : extraReferences.length === 0 ? (
              <div className="text-gray-400 text-sm">No extra references</div>
            ) : (
              <div className="space-y-3">
                {extraReferences.map((ref, index) => {
                  const suggestions = filteredRefNames(index)
                  const showSuggestions = ref.ref_name && suggestions.length > 0 && suggestions.length < availableRefNames.length
                  const exactMatch = ref.ref_name && availableRefNames.includes(ref.ref_name)
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                          <Input
                            value={ref.ref_name || ""}
                            onChange={(e) => handleExtraReferenceChange(index, 'ref_name', e.target.value)}
                            placeholder="Reference name"
                            list={`ref-names-${index}`}
                            className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                          />
                          <datalist id={`ref-names-${index}`}>
                            {availableRefNames.map((name) => (
                              <option key={name} value={name} />
                            ))}
                          </datalist>
                        </div>
                        <div className="flex-1">
                          <Input
                            value={ref.ref_value || ""}
                            onChange={(e) => handleExtraReferenceChange(index, 'ref_value', e.target.value)}
                            placeholder="Reference value"
                            className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleRemoveExtraReference(index)}
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      {showSuggestions && !exactMatch && (
                        <div className="flex flex-wrap gap-2 ml-0">
                          <span className="text-xs text-gray-400 mr-2">Suggestions:</span>
                          {suggestions.slice(0, 5).map((name) => (
                            <button
                              key={name}
                              type="button"
                              onClick={() => handleExtraReferenceChange(index, 'ref_name', name)}
                              className="px-2 py-1 text-xs bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-md cursor-pointer transition-colors"
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      )}
                      {!ref.ref_name && availableRefNames.length > 0 && (
                        <div className="flex flex-wrap gap-2 ml-0">
                          <span className="text-xs text-gray-400 mr-2">Or use existing:</span>
                          {availableRefNames.slice(0, 5).map((name) => (
                            <button
                              key={name}
                              type="button"
                              onClick={() => handleExtraReferenceChange(index, 'ref_name', name)}
                              className="px-2 py-1 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-md cursor-pointer transition-colors"
                            >
                              {name}
                            </button>
                          ))}
                          {availableRefNames.length > 5 && (
                            <span className="text-xs text-gray-500">+{availableRefNames.length - 5} more (type to search)</span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </CardContent>
      </Card>

      {/* Compatibility Manager Modal */}
      {showCompatibilityManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CompatibilityManager 
              productId={product.id} 
              onClose={() => setShowCompatibilityManager(false)} 
            />
          </div>
        </div>
      )}
    </div>
  )
}
