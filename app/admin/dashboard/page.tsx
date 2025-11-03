"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, type Product, type ProductExtraReference } from "@/lib/supabase"
import { exportProductsToExcel } from "@/lib/excel-export"
import { getProductImageUrlWithFallback } from "@/lib/image-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search, 
  Edit, 
  LogOut, 
  Package, 
  Plus,
  Trash,
  ChevronLeft,
  ChevronRight,
  Filter,
  BarChart3,
  Settings,
  Download
} from "lucide-react"
import { ProductEditModal } from "@/components/admin/ProductEditModal"
import { ProductCreateModal } from "@/components/admin/ProductCreateModal"
import { CompatibilityManager } from "@/components/admin/CompatibilityManager"
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard"

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSystem, setFilterSystem] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'products' | 'analytics' | 'compatibility'>('products')
  const [showCompatibilityManager, setShowCompatibilityManager] = useState(false)
  const router = useRouter()

  const ITEMS_PER_PAGE = 20

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user, currentPage, searchTerm, filterSystem])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/home")
    } else {
      setUser(user)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    
    let query = supabase.from("products").select("*", { count: "exact" })

    if (searchTerm) {
      query = query.or(
        `ALSAFA.ilike.%${searchTerm}%,REF_ORG.ilike.%${searchTerm}%,SAFI.ilike.%${searchTerm}%,FLEETG.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`
      )
    }

    if (filterSystem !== "all") {
      query = query.eq("filtration_system", filterSystem)
    }

    const from = (currentPage - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching products:", error)
    } else {
      setProducts(data || [])
      setTotalCount(count || 0)
    }

    setLoading(false)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchProducts()
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleProductUpdated = () => {
    fetchProducts()
    setIsEditModalOpen(false)
    setSelectedProduct(null)
  }

  const handleDeleteProduct = async (product: Product) => {
    if (!product.id) return
    const confirmed = typeof window !== 'undefined' ? window.confirm(`Delete product "${product.name || product.ALSAFA || product.id}"? This action cannot be undone.`) : false
    if (!confirmed) return
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id)
      if (error) {
        console.error('Error deleting product:', error)
        return
      }
      // Refresh list
      fetchProducts()
    } catch (e) {
      console.error('Unexpected delete error:', e)
    }
  }

  const handleExportToExcel = async () => {
    try {
      // Fetch ALL filtered products (not just current page)
      let query = supabase.from("products").select("*")

      if (searchTerm) {
        query = query.or(
          `ALSAFA.ilike.%${searchTerm}%,REF_ORG.ilike.%${searchTerm}%,SAFI.ilike.%${searchTerm}%,FLEETG.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`
        )
      }

      if (filterSystem !== "all") {
        query = query.eq("filtration_system", filterSystem)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching products for export:", error)
        alert("Error exporting products")
      } else if (data && data.length > 0) {
        // Fetch extra references for all products
        const productIds = data.map(p => p.id).filter(Boolean) as number[]
        const extraRefsMap: Record<number, Array<{ ref_name: string; ref_value: string | null }>> = {}
        
        if (productIds.length > 0) {
          const { data: refsData, error: refsError } = await supabase
            .from('product_extra_references')
            .select('*')
            .in('product_id', productIds)
          
          if (!refsError && refsData) {
            // Group references by product_id
            refsData.forEach(ref => {
              if (!extraRefsMap[ref.product_id]) {
                extraRefsMap[ref.product_id] = []
              }
              extraRefsMap[ref.product_id].push({
                ref_name: ref.ref_name,
                ref_value: ref.ref_value
              })
            })
          }
        }
        
        exportProductsToExcel(data, extraRefsMap)
      } else {
        alert("No products to export")
      }
    } catch (err) {
      console.error("Export error:", err)
      alert("Error exporting products")
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-orange-500 mr-3" />
              <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">{user.email}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'products'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <Package className="h-4 w-4 inline mr-2" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('compatibility')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'compatibility'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Compatibility
            </button>
            <button
              onClick={() => router.push('/admin/setup-analytics')}
              className="py-4 px-1 border-b-2 border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300 font-medium text-sm transition-colors"
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Setup Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' ? (
          <>
            {/* Search and Stats */}
            <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products by name, ALSAFA, REF_ORG, SAFI, or FLEETG..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterSystem}
                onChange={(e) => {
                  setFilterSystem(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:border-orange-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="huile">Oil Filters</option>
                <option value="gasoil">Diesel Filters</option>
                <option value="air">Air Filters</option>
              </select>
              <Button
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
              <Button
                onClick={handleExportToExcel}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Products</p>
                    <p className="text-2xl font-bold text-white">{totalCount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Filter className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Current Page</p>
                    <p className="text-2xl font-bold text-white">{currentPage} / {totalPages}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Edit className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Products on Page</p>
                    <p className="text-2xl font-bold text-white">{products.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Products Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <Skeleton className="h-4 w-32 bg-gray-700" />
                    <Skeleton className="h-4 w-24 bg-gray-700" />
                    <Skeleton className="h-4 w-20 bg-gray-700" />
                    <Skeleton className="h-4 w-16 bg-gray-700" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium w-16">Image</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">ALSAFA</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">REF_ORG</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Dimensions</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id || index} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                            {(() => {
                              const imageUrl = getProductImageUrlWithFallback(
                                product.ALSAFA, 
                                product.filtration_system, 
                                product.image_url
                              );
                              return imageUrl ? (
                                <img 
                                  src={imageUrl} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                  }}
                                />
                              ) : null;
                            })()}
                            <div className={`w-full h-full flex items-center justify-center text-gray-400 text-xs ${getProductImageUrlWithFallback(product.ALSAFA, product.filtration_system, product.image_url) ? 'hidden' : ''}`}>
                              <Package className="h-6 w-6" />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white font-medium">{product.name || "-"}</td>
                        <td className="py-3 px-4 text-white font-mono text-sm">{product.ALSAFA || "-"}</td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant="outline" 
                            className={`${
                              product.filtration_system === 'huile' ? 'border-yellow-500 text-yellow-500' :
                              product.filtration_system === 'gasoil' ? 'border-blue-500 text-blue-500' :
                              'border-green-500 text-green-500'
                            }`}
                          >
                            {product.filtration_system?.toUpperCase() || "-"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-white font-mono text-sm">{product.REF_ORG || "-"}</td>
                        <td className="py-3 px-4 text-white text-sm">
                          {product.Ext && product.Int && product.H ? 
                            `${product.Ext}×${product.Int}×${product.H}` : 
                            product.Ext && product.Int ? 
                            `${product.Ext}×${product.Int}` : 
                            product.Ext || product.Int || product.H || "-"
                          }
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleEditProduct(product)}
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteProduct(product)}
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} results
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white disabled:border-gray-600 disabled:text-gray-500 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white disabled:border-gray-600 disabled:text-gray-500 disabled:hover:bg-transparent"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
          </>
        ) : activeTab === 'analytics' ? (
          <AnalyticsDashboard />
        ) : (
          <CompatibilityManager />
        )}
      </main>

      {/* Edit Modal */}
      {isEditModalOpen && selectedProduct && (
        <ProductEditModal
          product={selectedProduct}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedProduct(null)
          }}
          onSave={handleProductUpdated}
        />
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <ProductCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={() => {
            setIsCreateModalOpen(false)
            fetchProducts()
          }}
        />
      )}
    </div>
  )
}
