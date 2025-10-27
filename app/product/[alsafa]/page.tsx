"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Package, Info, Phone, Mail, X, CheckCircle, Star, Download, Share2, Heart, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase, type Product } from "@/lib/supabase"
import { trackFacebookEvent } from "@/lib/pixel"
import { generateProductPDF } from "@/lib/pdf-generator"
import MobileHeader from "@/components/mobile-header"
import { SharedFooter } from "@/components/shared-footer"
import { ProductCompatibilityDisplay } from "@/components/ProductCompatibilityDisplay"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showContactPopup, setShowContactPopup] = useState(false)
  const [generatingPDF, setGeneratingPDF] = useState(false)

  const alsafa = decodeURIComponent(params.alsafa as string)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.from("products").select("*").eq("ALSAFA", alsafa).single()

      if (error) {
        console.error("Error fetching product:", error)
        setError("Product not found")
      } else {
        setProduct(data)
      }

      setLoading(false)
    }

    if (alsafa && alsafa !== "unknown") {
      fetchProduct()
    } else {
      setError("Invalid product identifier")
      setLoading(false)
    }
  }, [alsafa])

  // Track product view as InitiateCheckout-like intent
  useEffect(() => {
    if (product) {
      trackFacebookEvent('InitiateCheckout', {
        content_name: product.ALSAFA,
        content_ids: [product.ALSAFA].filter(Boolean),
        content_type: 'product',
      })
    }
  }, [product])


  const handleGeneratePDF = async () => {
    if (!product) return
    
    setGeneratingPDF(true)
    try {
      await generateProductPDF({
        product,
        companyInfo: {
          name: "Alsafa Filters",
          logo: "/ALSAFA LOGO.png",
          phone: "0555046890",
          email: "contact@elitifakfilters.com",
          website: "https://devlly.net/alsafa",
          address: "Algérie"
        }
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Erreur lors de la génération du PDF. Veuillez réessayer.")
    } finally {
      setGeneratingPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <MobileHeader forceSolid={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="h-96 w-full rounded-lg" />
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <MobileHeader forceSolid={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Package className="h-12 w-12 text-orange-600" />
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl font-bold text-gray-900 mb-4"
            >
              Produit introuvable
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-gray-600 mb-8 max-w-md mx-auto"
            >
              Le produit que vous recherchez n'existe pas ou a été supprimé de notre catalogue.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="px-6 py-3 rounded-xl border-2 border-orange-200 hover:border-orange-300 text-orange-600 hover:text-orange-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au catalogue
              </Button>
              <Button
                onClick={() => router.push("/catalog")}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-xl"
              >
                Voir le catalogue
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  const productFields = [
    { label: "ALSAFA", value: product.ALSAFA, primary: true },
    { label: "Origin", value: product.REF_ORG },
    { label: "SAFI", value: product.SAFI },
    { label: "SARL F", value: product.SARL_F },
    { label: "FLEETG", value: product.FLEETG },
    { label: "ASAS", value: product.ASAS },
    { label: "MECA F", value: product.MECA_F },
    { label: "External", value: product.Ext },
    { label: "Internal", value: product.Int },
    { label: "Height", value: product.H },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <MobileHeader forceSolid={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28 sm:pt-24 lg:pt-28">
        {/* Product Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4"
            >
              {product.ALSAFA || "Produit"}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {product.REF_ORG && (
                <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg">
                  <Zap className="h-4 w-4 mr-2" />
                  {product.REF_ORG}
                </Badge>
              )}
              <Badge variant="outline" className="px-4 py-2 text-sm border-orange-200 text-orange-600 rounded-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                En stock
              </Badge>
            </motion.div>
          </div>
        </motion.div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="overflow-hidden shadow-2xl border-0 bg-white">
              <CardContent className="p-0">
                <div className="aspect-square bg-white relative overflow-hidden group">
                  <img
                    src={product.image_url || `https://devlly.net/alsafa/${(product.ALSAFA || "").replace("-", "")}.avif`}
                    alt={product.ALSAFA || "Product image"}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = "flex"
                    }}
                  />
                  <div className="w-full h-full bg-white hidden items-center justify-center">
                    <div className="text-center">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Image non disponible</p>
                    </div>
                  </div>
                  
                  {/* Image Overlay Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        size="sm"
                        className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full shadow-lg"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        size="sm"
                        className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full shadow-lg"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  onClick={() => {
                    trackFacebookEvent('Contact', {
                      content_name: product?.ALSAFA,
                      content_type: 'product'
                    })
                    setShowContactPopup(true)
                  }}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Nous Contacter
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleGeneratePDF}
                  disabled={generatingPDF}
                  variant="outline"
                  className="h-12 px-6 rounded-xl border-2 border-orange-200 hover:border-orange-300 text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingPDF ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full" />
                      Génération...
                    </motion.div>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      PDF
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    Spécifications du produit
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {/* Primary Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Star className="h-5 w-5 text-orange-500" />
                      Informations principales
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {product.ALSAFA && (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                          <span className="text-gray-600 text-sm font-medium block mb-2">Référence:</span>
                          <p className="font-bold text-gray-900 text-lg">{product.ALSAFA}</p>
                        </div>
                      )}
                      {product.REF_ORG && (
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
                          <span className="text-orange-600 text-sm font-medium block mb-2">Origine:</span>
                          <p className="font-bold text-orange-800 text-lg">{product.REF_ORG}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                  {/* Dimensions */}
                  {(product.Ext || product.Int || product.H) && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Package className="h-5 w-5 text-orange-500" />
                        Dimensions
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {product.Ext && (
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                            <span className="text-blue-600 text-sm font-medium block mb-2">Externe</span>
                            <p className="font-bold text-blue-800 text-lg">{product.Ext}</p>
                          </div>
                        )}
                        {product.Int && (
                          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                            <span className="text-green-600 text-sm font-medium block mb-2">Interne</span>
                            <p className="font-bold text-green-800 text-lg">{product.Int}</p>
                          </div>
                        )}
                        {product.H && (
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                            <span className="text-purple-600 text-sm font-medium block mb-2">Hauteur</span>
                            <p className="font-bold text-purple-800 text-lg">{product.H}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(product.Ext || product.Int || product.H) && (
                    <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  )}

                  {/* Filtration System */}
                  {product.filtration_system && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-orange-500" />
                        Système de Filtration
                      </h3>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                        <p className="text-blue-800 font-bold text-lg">{product.filtration_system}</p>
                      </div>
                    </div>
                  )}

                  {product.filtration_system && (
                    <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Vehicle Compatibility - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="w-full bg-gradient-to-br from-slate-50 to-gray-100 py-12"
      >
        <div className="max-w-none px-4 sm:px-6 lg:px-8">
          <ProductCompatibilityDisplay 
            productId={product.id!} 
            productAlsaFa={product.ALSAFA || undefined}
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {showContactPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowContactPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl mx-4 h-full max-h-[90vh] sm:max-h-[85vh] flex flex-col"
            >
              <Card className="w-full shadow-2xl border-0 bg-white overflow-hidden flex flex-col h-full">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white">Nous Contacter</CardTitle>
                        <p className="text-orange-100 text-sm">Demande d'information</p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowContactPopup(false)}
                        className="text-white hover:bg-white/20 rounded-full"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex-1 overflow-y-auto">
                  {/* Contact Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-500" />
                      Contactez-nous directement
                    </h3>
                    <div className="space-y-4">
                      {/* Phone Numbers */}
                      <div>
                        <h4 className="text-sm font-bold text-orange-600 mb-3 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          TÉLÉPHONES
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-xl"
                          >
                            <p className="text-xs text-orange-600 font-medium mb-1">Téléphone Fixe</p>
                            <a href="tel:+21332503168" className="text-orange-800 font-bold hover:underline text-sm break-all">
                              +213 32503168
                            </a>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-xl"
                          >
                            <p className="text-xs text-green-600 font-medium mb-1">Mobile 1</p>
                            <a href="tel:+213555046890" className="text-green-800 font-bold hover:underline text-sm break-all">
                              +213 555046890
                            </a>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl"
                          >
                            <p className="text-xs text-blue-600 font-medium mb-1">Mobile 2</p>
                            <a href="tel:+213676888271" className="text-blue-800 font-bold hover:underline text-sm break-all">
                              +213 676888271
                            </a>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-xl"
                          >
                            <p className="text-xs text-purple-600 font-medium mb-1">Fax</p>
                            <a href="tel:+21332503169" className="text-purple-800 font-bold hover:underline text-sm break-all">
                              +213 32503169
                            </a>
                          </motion.div>
                        </div>
                      </div>

                      {/* Email Addresses */}
                      <div>
                        <h4 className="text-sm font-bold text-blue-600 mb-3 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          EMAILS
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl"
                          >
                            <p className="text-xs text-blue-600 font-medium mb-1">Général</p>
                            <a href="mailto:sarlelitifak@gmail.com" className="text-blue-800 font-bold hover:underline text-xs break-all">
                              sarlelitifak@gmail.com
                            </a>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-xl"
                          >
                            <p className="text-xs text-orange-600 font-medium mb-1">Commercial</p>
                            <a href="mailto:commercial@elitifakfilters.com" className="text-orange-800 font-bold hover:underline text-xs break-all">
                              commercial@elitifakfilters.com
                            </a>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-xl"
                          >
                            <p className="text-xs text-green-600 font-medium mb-1">Achats</p>
                            <a href="mailto:purchase@elitifakfilters.com" className="text-green-800 font-bold hover:underline text-xs break-all">
                              purchase@elitifakfilters.com
                            </a>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-xl"
                          >
                            <p className="text-xs text-purple-600 font-medium mb-1">Marketing</p>
                            <a href="mailto:marketing@elitifakfilters.com" className="text-purple-800 font-bold hover:underline text-xs break-all">
                              marketing@elitifakfilters.com
                            </a>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SharedFooter />
    </div>
  )
}
