"use client"

import { useState, useEffect } from "react"
import { Search, Car, Ruler, RefreshCw, Star, Phone, Mail, ChevronRight, Filter, ArrowRight, CheckCircle, Shield, Zap, Award, Users, Clock, MapPin, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import MobileHeader from "@/components/mobile-header"
import { SharedFooter } from "@/components/shared-footer"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import vehicleData from "@/lib/vehicle-data.json"
export default function HomePage() {
  const [filterType, setFilterType] = useState("vehicle")
  const [searchTerm, setSearchTerm] = useState("")
  const [dimensions, setDimensions] = useState({
    external: "",
    internal: "",
    height: ""
  })
  const [correspondenceRef, setCorrespondenceRef] = useState("")
  const [vehicleBrand, setVehicleBrand] = useState("")
  const [vehicleModel, setVehicleModel] = useState("")
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const { scrollYProgress } = useScroll()

  const carBrands = [
    { name: "Audi", logo: "https://elitifakfilter.com/wp-content/uploads/2024/05/client-7.webp" },
    { name: "Toyota", logo: "https://elitifakfilter.com/wp-content/uploads/2024/05/client-8.webp" },
    { name: "Volkswagen", logo: "https://elitifakfilter.com/wp-content/uploads/2024/05/client-9.webp" },
    { name: "Ford", logo: "https://elitifakfilter.com/wp-content/uploads/2024/05/client-7.webp" },
    { name: "Mercedes", logo: "https://elitifakfilter.com/wp-content/uploads/2024/05/client-8.webp" },
    { name: "BMW", logo: "https://elitifakfilter.com/wp-content/uploads/2024/05/client-9.webp" },
  ]

  // Update available models when brand changes
  useEffect(() => {
    if (vehicleBrand && vehicleData[vehicleBrand as keyof typeof vehicleData]) {
      setAvailableModels(vehicleData[vehicleBrand as keyof typeof vehicleData].models)
      // Reset model when brand changes
      setVehicleModel("")
    } else {
      setAvailableModels([])
    }
  }, [vehicleBrand])

  const testimonials = [
    {
      name: "Karim B.",
      location: "ALGER",
      text: "Depuis que j'utilise les filtres Alsafa, je remarque une meilleure performance de ma voiture et une consommation réduite.",
      rating: 5,
    },
    {
      name: "Hassim T.",
      location: "ORAN",
      text: "J'ai trouvé exactement les filtres dont j'avais besoin, à un prix plus que raisonnable. Merci Alsafa Filters !",
      rating: 5,
    },
    {
      name: "Mehdi L.",
      location: "SIDI BEL ABBES",
      text: "Je suis très satisfait de l'expérience d'achat. Très simple et rapide, avec une excellente qualité de produit. Je recommande vivement.",
      rating: 5,
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "Qualité Garantie",
      description: "Filtres certifiés selon les normes internationales",
    },
    {
      icon: Award,
      title: "Expertise Technique",
      description: "Plus de 20 ans d'expérience dans le domaine",
    },
    {
      icon: Users,
      title: "Support Client",
      description: "Assistance technique 7j/7",
    },
  ]

  const handleSearch = () => {
    // Build search parameters based on filter type
    const searchParams = new URLSearchParams()
    let targetUrl = "/catalog" // Default to catalog
    
    if (filterType === "vehicle") {
      if (vehicleBrand) searchParams.set("brand", vehicleBrand)
      if (vehicleModel) searchParams.set("model", vehicleModel)
      targetUrl = "/filter/vehicle"
    } else if (filterType === "reference" && searchTerm) {
      searchParams.set("search", searchTerm)
      targetUrl = "/catalog"
    } else if (filterType === "dimensions") {
      if (dimensions.external) searchParams.set("external", dimensions.external)
      if (dimensions.internal) searchParams.set("internal", dimensions.internal)
      if (dimensions.height) searchParams.set("height", dimensions.height)
      targetUrl = "/filter/dimensions"
    } else if (filterType === "correspondence" && correspondenceRef) {
      searchParams.set("correspondence", correspondenceRef)
      targetUrl = "/filter/correspondence"
    }
    
    // Navigate to appropriate page with search params
    const finalUrl = searchParams.toString() ? `${targetUrl}?${searchParams.toString()}` : targetUrl
    window.location.href = finalUrl
  }

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 overflow-hidden pt-24 sm:pt-20">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-white space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium"
              >
                <CheckCircle className="h-4 w-4 text-green-400" />
                Qualité Certifiée
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold leading-tight"
              >
                Filtres de
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                  Qualité Supérieure
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 leading-relaxed"
              >
                Trouvez le filtre parfait pour votre véhicule avec notre technologie de recherche avancée
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300"
                  onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Commencer la Recherche
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-primary border-primary hover:bg-white/10 font-semibold px-8 py-4 rounded-xl backdrop-blur-sm"
                  onClick={() => window.location.href = '/catalog'}
                >
                  Voir le Catalogue
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-2 gap-8 pt-8"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">1000+</div>
                  <div className="text-sm text-gray-400">Modèles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">50+</div>
                  <div className="text-sm text-gray-400">Marques</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right content - Hero image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://elitifakfilter.com/wp-content/uploads/revslider/video-media/202501281743_10.jpeg"
                  alt="Filtres automobiles"
                  className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
                />
                <motion.div
                  className="absolute -top-4 -right-4 bg-white rounded-2xl p-6 shadow-xl"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Qualité Certifiée</div>
                      <div className="text-sm text-gray-600">ISO 9001</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team & Innovation Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Équipe & Innovation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une équipe d'experts dédiée au développement de solutions de filtration innovantes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Innovation & Excellence</h3>
              </div>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Notre équipe d'ingénieurs spécialisés œuvre en continu au développement et à l'amélioration de nos filtres. Grâce à notre laboratoire de pointe, chaque produit fait l'objet de tests rigoureux afin d'assurer des performances optimales.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl"
                >
                  <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
                  <div className="text-gray-600 font-medium">Ingénieurs</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl"
                >
                  <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
                  <div className="text-gray-600 font-medium">Tests par mois</div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://devlly.net/alsafa/resources/men%20in%20the%20lab%20working%20on%20testing%20and%20devlping%20filters.jpg"
                alt="Équipe de recherche et développement"
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Laboratoire Certifié</div>
                    <div className="text-sm text-gray-600">Tests de qualité</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = '/a-propos'}
            >
              Découvrir notre histoire
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Certifications & Qualité</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Des standards de qualité reconnus internationalement pour votre tranquillité d'esprit
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                image: "https://devlly.net/alsafa/resources/ISO%2014001.png",
                title: "ISO 14001",
                description: "Management environnemental",
                icon: CheckCircle,
                color: "green"
              },
              {
                image: "https://devlly.net/alsafa/resources/the%20certifcate%20of%20ISO%209001.png",
                title: "ISO 9001",
                description: "Management de la qualité",
                icon: CheckCircle,
                color: "green"
              },
              {
                image: "https://devlly.net/alsafa/resources/ISO%2045001.png",
                title: "ISO 45001",
                description: "Santé et sécurité au travail",
                icon: CheckCircle,
                color: "green"
              },
              {
                image: "https://devlly.net/alsafa/resources/QR%20code%20%20elitifak%20filters%20black%20.png",
                title: "Authentification",
                description: "Vérification QR des produits",
                icon: Shield,
                color: "blue"
              }
            ].map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group"
              >
                <Card className="text-center p-6 hover:shadow-2xl transition-all duration-300 border-0 bg-white/10 backdrop-blur-sm group-hover:bg-white/20">
                  <CardContent className="p-0">
                    <motion.div
                      className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="h-12 w-12 object-contain"
                      />
                    </motion.div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">{cert.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {cert.description}
                    </p>
                    <div className={`flex items-center justify-center gap-2 ${
                      cert.color === 'green' ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      <cert.icon className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        {cert.color === 'green' ? 'Certifié' : 'Vérifiable'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = '/a-propos'}
            >
              En savoir plus sur nos certifications
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trouvez votre filtre</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez votre méthode de recherche préférée pour trouver le filtre parfait
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { type: "vehicle", icon: Car, label: "Par Véhicule" },
                    { type: "reference", icon: Search, label: "Par Référence" },
                    { type: "dimensions", icon: Ruler, label: "Par Dimensions" },
                    { type: "correspondence", icon: RefreshCw, label: "Par Correspondance" },
                  ].map((option) => (
                    <motion.div
                      key={option.type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={filterType === option.type ? "default" : "outline"}
                        onClick={() => setFilterType(option.type)}
                        className={`w-full flex flex-col items-center gap-3 h-auto py-6 rounded-xl transition-all duration-300 ${
                          filterType === option.type
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                            : "hover:bg-orange-50 hover:border-orange-300"
                        }`}
                      >
                        <option.icon className="h-6 w-6" />
                        <span className="font-medium">{option.label}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  key={filterType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {filterType === "vehicle" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select value={vehicleBrand} onValueChange={setVehicleBrand}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Marque" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(vehicleData).map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={vehicleModel} onValueChange={setVehicleModel}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Modèle" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {filterType === "reference" && (
                    <div className="flex gap-4">
                      <Input 
                        placeholder="Entrez la référence du filtre..." 
                        className="flex-1 h-12 rounded-xl text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <Button 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-12 px-8 rounded-xl"
                        onClick={handleSearch}
                        disabled={!searchTerm.trim()}
                      >
                        <Search className="h-5 w-5 mr-2" />
                        Rechercher
                      </Button>
                    </div>
                  )}

                  {filterType === "dimensions" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input 
                        placeholder="Diamètre externe (mm)" 
                        className="h-12 rounded-xl text-lg"
                        value={dimensions.external}
                        onChange={(e) => setDimensions(prev => ({ ...prev, external: e.target.value }))}
                      />
                      <Input 
                        placeholder="Diamètre interne (mm)" 
                        className="h-12 rounded-xl text-lg"
                        value={dimensions.internal}
                        onChange={(e) => setDimensions(prev => ({ ...prev, internal: e.target.value }))}
                      />
                      <Input 
                        placeholder="Hauteur (mm)" 
                        className="h-12 rounded-xl text-lg"
                        value={dimensions.height}
                        onChange={(e) => setDimensions(prev => ({ ...prev, height: e.target.value }))}
                      />
                    </div>
                  )}

                  {filterType === "correspondence" && (
                    <div className="flex gap-4">
                      <Input 
                        placeholder="Référence concurrente..." 
                        className="flex-1 h-12 rounded-xl text-lg"
                        value={correspondenceRef}
                        onChange={(e) => setCorrespondenceRef(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <Button 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-12 px-8 rounded-xl"
                        onClick={handleSearch}
                        disabled={!correspondenceRef.trim()}
                      >
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Trouver
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-center pt-6">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleSearch}
                    >
                      <Filter className="h-5 w-5 mr-2" />
                      Rechercher Maintenant
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>


      {/* Popular Products */}
      {/* <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🔥 Explorer les articles les plus populaires</h2>
            <p className="text-lg text-gray-600">Nos filtres les plus demandés par nos clients</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {popularProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-center text-sm">{product.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                👉 Voir Produits
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

      {/* Car Brands Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Marques automobiles supportées</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Filtres compatibles avec toutes les grandes marques automobiles
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {carBrands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="group"
              >
                <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50 group-hover:from-orange-50 group-hover:to-orange-100">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-orange-600 group-hover:to-orange-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <img 
                        src={brand.logo || "/placeholder.svg"} 
                        alt={brand.name} 
                        className="w-14 h-14 object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300" 
                      />
                    </motion.div>
                    <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                      {brand.name}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = '/catalog'}
            >
              Voir tous les filtres
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ce que nos clients disent</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les témoignages de nos clients satisfaits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 group-hover:from-orange-50 group-hover:to-orange-100">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    <blockquote className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>
                    <div className="border-t pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {testimonial.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Rejoignez nos clients satisfaits</h3>
              <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                Découvrez pourquoi plus de 10,000 clients nous font confiance pour leurs filtres automobiles
              </p>
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = '/catalog'}
              >
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
} 
