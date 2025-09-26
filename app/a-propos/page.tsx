"use client"

import { useState, useEffect } from "react"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Factory, Package, Award, Phone, Mail, MapPin, CheckCircle, QrCode, Shield, ArrowRight } from "lucide-react"
import MobileHeader from "@/components/mobile-header"
import { motion, useScroll, useTransform, useInView } from "framer-motion"

export default function AProposPage() {
  const { scrollYProgress } = useScroll()

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
                Depuis 1994
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold leading-tight"
              >
                À propos de
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                  Alsafa Filters
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 leading-relaxed"
              >
                SARL ELITIFAK, fabricant de la marque Alsafa Filters, fondée en 1994 à Aïn M'lila – Algérie. Le plus grand fabricant de filtres (air, huile, carburant) du pays.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 flex items-center gap-2"
                  onClick={() => document.getElementById('about-content')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Découvrir notre histoire
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-3 gap-8 pt-8"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">30+</div>
                  <div className="text-sm text-gray-400">Années d'expérience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">1,179</div>
                  <div className="text-sm text-gray-400">Références</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">2M+</div>
                  <div className="text-sm text-gray-400">Filtres/an</div>
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
                  src="https://devlly.net/alsafa/resources/men%20in%20the%20lab%20working%20on%20testing%20and%20devlping%20filters.jpg"
                  alt="Équipe de recherche et développement Alsafa Filters"
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

      <main id="about-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Company History Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Histoire</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                De l'importation à la fabrication : 30 ans d'excellence en filtration automobile
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Notre Parcours</h3>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
                    <h4 className="text-xl font-bold text-orange-600 mb-2">1994 - Fondation</h4>
                    <p className="text-gray-700">SARL ELITIFAK a été fondée à Aïn M'lila – Algérie. Elle était à l'époque la plus grande entreprise d'importation de pièces de rechange automobiles en Algérie.</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                    <h4 className="text-xl font-bold text-blue-600 mb-2">2002 - Transition</h4>
                    <p className="text-gray-700">ELITIFAK s'est imposée comme le plus grand fabricant de filtres (air, huile, carburant) dans le pays, en offrant des produits conformes aux standards internationaux.</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                    <h4 className="text-xl font-bold text-green-600 mb-2">Aujourd'hui</h4>
                    <p className="text-gray-700">Elle demeure un acteur de référence sur le marché algérien et ambitionne d'élargir sa présence sur les marchés africains et internationaux.</p>
                  </div>
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
                  src="https://devlly.net/alsafa/resources/photo%20of%20a%20man%20in%20the%20USINE%20ALSAFA%20FILTRES.jpg"
                  alt="Usine Alsafa Filters - Histoire de l'entreprise"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Leader National</div>
                      <div className="text-sm text-gray-600">Depuis 2002</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team & R&D Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Équipe & Recherche</h2>
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
          </div>
        </section>

        {/* Factory & Production Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Usine & Production</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une infrastructure moderne pour une production de qualité supérieure
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <img
                  src="https://devlly.net/alsafa/resources/photo%20of%20a%20man%20in%20the%20USINE%20ALSAFA%20FILTRES.jpg"
                  alt="Usine Alsafa Filters"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
                <img
                  src="https://devlly.net/alsafa/resources/photo%20or%20some%20filters%20in%20productions.jpg"
                  alt="Filtres en production"
                  className="w-full h-64 object-cover rounded-2xl shadow-2xl"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                    <Factory className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Production Moderne</h3>
                </div>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Notre usine moderne, implantée en Algérie, utilise des technologies de pointe pour la production de filtres automobiles. Nous maintenons des standards de qualité élevés tout en optimisant notre capacité de production afin de répondre efficacement à la demande croissante.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl"
                  >
                    <div className="text-3xl font-bold text-orange-600 mb-2">2M+</div>
                    <div className="text-gray-600 font-medium">Filtres/an</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl"
                  >
                    <div className="text-3xl font-bold text-orange-600 mb-2">90%</div>
                    <div className="text-gray-600 font-medium">Taux d'intégration</div>
                  </motion.div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white border-orange-200 text-orange-700 hover:bg-orange-50">
                    Production automatisée
                  </Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white border-orange-200 text-orange-700 hover:bg-orange-50">
                    Contrôle qualité
                  </Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white border-orange-200 text-orange-700 hover:bg-orange-50">
                    Traçabilité complète
                  </Badge>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Production Details Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Production</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Capacité de production et caractéristiques de nos filtres
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-orange-50 hover:to-orange-100">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Filtres à Huile</h3>
                    <div className="text-4xl font-bold text-orange-600 mb-2">140</div>
                    <div className="text-gray-600 font-medium mb-4">Références</div>
                    <div className="text-3xl font-bold text-orange-600 mb-2">600,000</div>
                    <div className="text-gray-600 font-medium">Pièces/An</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Filtres Gas-oil</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-2">78</div>
                    <div className="text-gray-600 font-medium mb-4">Références</div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">500,000</div>
                    <div className="text-gray-600 font-medium">Pièces/An</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-green-50 hover:to-green-100">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Filtres à Air</h3>
                    <div className="text-4xl font-bold text-green-600 mb-2">961</div>
                    <div className="text-gray-600 font-medium mb-4">Références</div>
                    <div className="text-3xl font-bold text-green-600 mb-2">500,000</div>
                    <div className="text-gray-600 font-medium">Pièces/An</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Service Personnalisé</h3>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                En plus de notre gamme standard, nous concevons et réalisons également tout type de filtre sur modèle fourni par le client.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Produits</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une gamme complète de filtres automobiles pour répondre à tous vos besoins
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src="https://devlly.net/alsafa/resources/photo%20of%20some%20filters%20with%20differnet%20sizes.jpg"
                  alt="Différents types de filtres"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src="https://devlly.net/alsafa/resources/aboutus%20filters.avif"
                  alt="Catalogue de filtres"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { number: "1,179", label: "Références disponibles" },
                { number: "300", label: "Emplois créés" },
                { number: "90%", label: "Taux d'intégration" },
                { number: "2M+", label: "Filtres/an" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.05 }}
                >
                  <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-orange-50 hover:to-orange-100">
                    <CardContent className="p-0">
                      <div className="text-3xl font-bold text-orange-600 mb-3">{stat.number}</div>
                      <div className="text-gray-600 font-medium">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted Brands Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Marques qui nous font confiance</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des partenaires de confiance qui font appel à notre expertise en filtration
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-8">
              {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((brandNumber, index) => (
                <motion.div
                  key={brandNumber}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:from-orange-50 hover:to-orange-100 transition-all duration-300"
                >
                  <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <img
                      src={`/brands/${brandNumber}.png`}
                      alt={`Brand ${brandNumber}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Certifications</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des standards de qualité reconnus internationalement pour votre tranquillité d'esprit
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  image: "https://devlly.net/alsafa/resources/ISO%2014001.png",
                  title: "ISO 14001:2015",
                  description: "Management environnemental pour une production respectueuse de l'environnement",
                  icon: CheckCircle,
                  color: "green",
                  certificateUrl: "https://uq2n5vkavyhuooys.public.blob.vercel-storage.com/certificates/Certificate%20EL%20ITIFAK%20ISO%2014001-2015-ACCREDIA.pdf"
                },
                {
                  image: "https://devlly.net/alsafa/resources/the%20certifcate%20of%20ISO%209001.png",
                  title: "ISO 9001:2015",
                  description: "Management de la qualité garantissant l'excellence de nos processus de production",
                  icon: CheckCircle,
                  color: "green",
                  certificateUrl: "https://uq2n5vkavyhuooys.public.blob.vercel-storage.com/certificates/Certificate%20EL%20ITIFAK%20ISO%209001-2015-ACCREDIA.pdf"
                },
                {
                  image: "https://devlly.net/alsafa/resources/ISO%2045001.png",
                  title: "ISO 45001:2018",
                  description: "Système de management de la santé et sécurité au travail pour la protection de nos équipes et partenaires",
                  icon: CheckCircle,
                  color: "green",
                  certificateUrl: "https://uq2n5vkavyhuooys.public.blob.vercel-storage.com/certificates/Certificate%20EL%20ITIFAK%20ISO%2045001-2018-ACCREDIA.pdf"
                },
                {
                  image: "https://devlly.net/alsafa/resources/QR%20code%20%20elitifak%20filters%20black%20.png",
                  title: "Authentification",
                  description: "Vérification QR pour l'authentification de tous nos produits",
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
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-white group-hover:bg-gradient-to-br group-hover:from-orange-50 group-hover:to-orange-100">
                    <CardContent className="p-0">
                      <motion.div
                        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center group-hover:from-orange-100 group-hover:to-orange-200 transition-all duration-300"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                      >
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="h-16 w-16 object-contain"
                        />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">{cert.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {cert.description}
                      </p>
                      <div className={`flex items-center justify-center gap-2 ${
                        cert.color === 'green' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        <cert.icon className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          {cert.color === 'green' ? 'Certifié' : 'Vérifiable'}
                        </span>
                      </div>
                      {cert.certificateUrl && (
                        <motion.div
                          className="mt-4"
                          whileHover={{ scale: 1.05 }}
                        >
                          <a
                            href={cert.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Voir le certificat
                          </a>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Legal Information Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Conformité & Transparence</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                SARL ELITIFAK - Une entreprise conforme et transparente dans toutes ses activités
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Statut Légal</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Raison Sociale</h4>
                        <p className="text-gray-600">SARL ELITIFAK</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Enregistrement</h4>
                        <p className="text-gray-600">Société légalement enregistrée et conforme</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Forme Juridique</h4>
                        <p className="text-gray-600">Société à Responsabilité Limitée</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Conformité Réglementaire</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Fiscalité</h4>
                        <p className="text-gray-600">Conformité fiscale complète et à jour</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Statistiques</h4>
                        <p className="text-gray-600">Enregistrement statistique national</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Transparence</h4>
                        <p className="text-gray-600">Pratiques commerciales transparentes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Engagement</h3>
                <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                  SARL ELITIFAK s'engage à respecter toutes les réglementations en vigueur et à maintenir 
                  la plus haute transparence dans ses activités commerciales. Notre entreprise est 
                  légalement constituée, fiscalement conforme et statistiquement enregistrée, 
                  garantissant ainsi la confiance et la sécurité de nos partenaires et clients.
                </p>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-green-700 font-semibold">Entreprise Conforme & Transparente</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact / Identity Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact & Identité</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                SARL ELITIFAK - Votre partenaire de confiance en filtration automobile
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center lg:text-left"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-block"
                >
                  <img
                    src="https://devlly.net/alsafa/resources/carta"
                    alt="Carte d'identité SARL EL ITIFAK"
                    className="max-w-sm mx-auto lg:mx-0 rounded-2xl shadow-2xl"
                  />
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold text-gray-900 mb-8">SARL ELITIFAK</h3>
                <div className="space-y-6">
                  {[
                    {
                      icon: MapPin,
                      title: "Adresse",
                      content: "Z.A.D Rte/Nat n°100 Ain M'Lila, 04300 O.E.B. - ALGERIE"
                    },
                    {
                      icon: Phone,
                      title: "Téléphone",
                      content: "032 50 31 68 / 0555 04 68 90 / 0676 88 82 71"
                    },
                    {
                      icon: Mail,
                      title: "Email",
                      content: "contact@elitifakfilters.com / sarlelitifak@gmail.com"
                    },
                    {
                      icon: Building2,
                      title: "Site Web",
                      content: "alsafafilters.com"
                    },
                    {
                      icon: Building2,
                      title: "Fax",
                      content: "032 50 31 69"
                    }
                  ].map((contact, index) => (
                    <motion.div
                      key={contact.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 10 }}
                      className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <contact.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-lg">{contact.title}</h4>
                        <p className="text-gray-600 text-base">{contact.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <SharedFooter />
      
    </div>
  )
}
