"use client"

import { useState } from "react"
import { supabase, type Product } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Save, Loader2, Image as ImageIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

const defaultFormData: Product = {
  name: "",
  description: null,
  image_url: null,
  ALSAFA: "",
  Ext: "",
  Int: "",
  H: "",
  SAFI: "",
  SARL_F: "",
  FLEETG: "",
  ASAS: "",
  MECA_F: "",
  REF_ORG: "",
  filtration_system: "huile",
  Ptte: "",
  MANN: "",
  UFI: "",
  HIFI: "",
  WIX: "",
}

export function ProductCreateModal({ isOpen, onClose, onSave }: ProductCreateModalProps) {
  const [formData, setFormData] = useState<Product>(defaultFormData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: keyof Product, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreate = async () => {
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const payload: Partial<Product> = {
        ...formData,
        // Normalize empty strings to null where appropriate
        description: formData.description || null,
        image_url: formData.image_url || null,
        ALSAFA: formData.ALSAFA || null,
        Ext: formData.Ext || null,
        Int: formData.Int || null,
        H: formData.H || null,
        SAFI: formData.SAFI || null,
        SARL_F: formData.SARL_F || null,
        FLEETG: formData.FLEETG || null,
        ASAS: formData.ASAS || null,
        MECA_F: formData.MECA_F || null,
        REF_ORG: formData.REF_ORG || null,
        Ptte: formData.Ptte || null,
        MANN: formData.MANN || null,
        UFI: formData.UFI || null,
        HIFI: formData.HIFI || null,
        WIX: formData.WIX || null,
      }

      const { error } = await supabase
        .from("products")
        .insert(payload as Product)

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          onSave()
          setFormData(defaultFormData)
        }, 800)
      }
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
          <CardTitle className="text-white">Create Product</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-500 text-white bg-gray-700 hover:bg-gray-600 hover:text-white hover:border-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create
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
              <AlertDescription>Product created successfully!</AlertDescription>
            </Alert>
          )}

          {/* Image Section (disabled until after creation) */}
          <div className="space-y-4 p-4 bg-gray-700/50 rounded-lg">
            <Label className="text-gray-300 text-sm font-medium">Product Image</Label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                <ImageIcon className="h-8 w-8 text-gray-300" />
              </div>
              <div className="flex-1 text-sm text-gray-300">
                Image upload is available after the product is created.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Label htmlFor="alsafa" className="text-gray-300">ALSAFA</Label>
              <Input
                id="alsafa"
                value={formData.ALSAFA || ""}
                onChange={(e) => handleInputChange("ALSAFA", e.target.value)}
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
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductCreateModal


