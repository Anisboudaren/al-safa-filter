"use client"

import { useState, useEffect } from "react"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Factory, Package, Award, Phone, Mail, MapPin, CheckCircle, Shield, ArrowRight } from "lucide-react"
import MobileHeader from "@/components/mobile-header"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useTranslation } from "@/components/language-provider"

export default function AProposPage() {
  const { scrollYProgress } = useScroll()
  const t = useTranslation()

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
                {t.since1994}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold leading-tight"
              >
                {t.aboutAlsafaFilters.split(' ').slice(0, -2).join(' ')}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                  {t.aboutAlsafaFilters.split(' ').slice(-2).join(' ')}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 leading-relaxed"
              >
                {t.companyDescription}
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
                  {t.discoverOurHistory}
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
                  <div className="text-sm text-gray-400">{t.yearsOfExperience}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">1,179</div>
                  <div className="text-sm text-gray-400">{t.references}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">2M+</div>
                  <div className="text-sm text-gray-400">{t.filtersPerYear}</div>
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
                  src="/resources/people in the factury.webp"
                  alt={t.researchDevelopmentTeam}
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
                      <div className="font-semibold text-gray-900">{t.certifiedQuality}</div>
                      <div className="text-sm text-gray-600">{t.iso9001}</div>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.ourHistory}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.thirtyYearsExcellence}
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
                  <h3 className="text-3xl font-bold text-gray-900">{t.ourJourney}</h3>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
                    <h4 className="text-xl font-bold text-orange-600 mb-2">{t.foundation1994}</h4>
                    <p className="text-gray-700">{t.foundationDescription}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                    <h4 className="text-xl font-bold text-blue-600 mb-2">{t.transition2002}</h4>
                    <p className="text-gray-700">{t.transitionDescription}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                    <h4 className="text-xl font-bold text-green-600 mb-2">{t.today}</h4>
                    <p className="text-gray-700">{t.todayDescription}</p>
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
                  src="/resources/worker in the factury.webp"
                  alt={t.alsafaFiltersFactoryHistory}
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
                      <div className="font-semibold text-gray-900">{t.nationalLeader}</div>
                      <div className="text-sm text-gray-600">{t.since2002}</div>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.ourTeamResearch}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.expertTeamDescription}
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
                  <h3 className="text-3xl font-bold text-gray-900">{t.innovationExcellence}</h3>
                </div>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {t.teamDescription}
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
                  src="/resources/people in the factury.webp"
                  alt={t.researchDevelopmentTeam}
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.ourFactoryProduction}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.modernInfrastructure}
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
                  src="/resources/worker in the factury.webp"
                  alt={t.alsafaFiltersFactory}
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
                <img
                  src="/resources/filters iwth white bg.webp"
                  alt={t.filtersInProduction}
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
                  <h3 className="text-3xl font-bold text-gray-900">{t.modernProduction}</h3>
                </div>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {t.factoryDescription}
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl"
                  >
                    <div className="text-3xl font-bold text-orange-600 mb-2">2M+</div>
                    <div className="text-gray-600 font-medium">{t.filtersPerYear}</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl"
                  >
                    <div className="text-3xl font-bold text-orange-600 mb-2">90%</div>
                    <div className="text-gray-600 font-medium">{t.integrationRate}</div>
                  </motion.div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white border-orange-200 text-orange-700 hover:bg-orange-50">
                    {t.automatedProduction}
                  </Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white border-orange-200 text-orange-700 hover:bg-orange-50">
                    {t.qualityControl}
                  </Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white border-orange-200 text-orange-700 hover:bg-orange-50">
                    {t.completeTraceability}
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.ourProduction}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.productionCapacityDescription}
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.oilFilters}</h3>
                    <div className="text-4xl font-bold text-orange-600 mb-2">140</div>
                    <div className="text-gray-600 font-medium mb-4">{t.references}</div>
                    <div className="text-3xl font-bold text-orange-600 mb-2">1,200,000</div>
                    <div className="text-gray-600 font-medium">{t.piecesPerYear}</div>
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.dieselFilters}</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-2">78</div>
                    <div className="text-gray-600 font-medium mb-4">{t.references}</div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">700,000</div>
                    <div className="text-gray-600 font-medium">{t.piecesPerYear}</div>
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.airFilters}</h3>
                    <div className="text-4xl font-bold text-green-600 mb-2">961</div>
                    <div className="text-gray-600 font-medium mb-4">{t.references}</div>
                    <div className="text-3xl font-bold text-green-600 mb-2">600,000</div>
                    <div className="text-gray-600 font-medium">{t.piecesPerYear}</div>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.ourProducts}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.completeRangeDescription}
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
                  src="/resources/filters with white bg.webp"
                  alt={t.differentFilterTypes}
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
                  src="/resources/filters iwth white bg.webp"
                  alt={t.filterCatalog}
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { number: "1,179", label: t.availableReferences },
                { number: "300", label: t.jobsCreated },
                { number: "90%", label: t.integrationRate },
                { number: "2M+", label: t.filtersPerYear }
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.trustedBrands}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.trustedPartnersDescription}
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.ourCertifications}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.qualityStandardsDescription}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  image: "/resources/ISO 14001.png",
                  title: "ISO 14001:2015",
                  description: "Management environnemental pour une production respectueuse de l'environnement",
                  icon: CheckCircle,
                  color: "green",
                  certificateUrl: "https://uq2n5vkavyhuooys.public.blob.vercel-storage.com/certificates/Certificate%20EL%20ITIFAK%20ISO%2014001-2015-ACCREDIA.pdf"
                },
                {
                  image: "/resources/ISO 9001.png",
                  title: "ISO Certified",
                  description: "Management de la qualité garantissant l'excellence de nos processus de production",
                  icon: CheckCircle,
                  color: "green",
                  certificateUrl: "https://uq2n5vkavyhuooys.public.blob.vercel-storage.com/certificates/Certificate%20EL%20ITIFAK%20ISO%209001-2015-ACCREDIA.pdf"
                },
                {
                  image: "/resources/ISO 45001.png",
                  title: "ISO 45001:2018",
                  description: "Système de management de la santé et sécurité au travail pour la protection de nos équipes et partenaires",
                  icon: CheckCircle,
                  color: "green",
                  certificateUrl: "https://uq2n5vkavyhuooys.public.blob.vercel-storage.com/certificates/Certificate%20EL%20ITIFAK%20ISO%2045001-2018-ACCREDIA.pdf"
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.complianceTransparency}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.compliantTransparentActivities}
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
                      <h3 className="text-2xl font-bold text-gray-900">{t.legalStatus}</h3>
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
                        <h4 className="font-semibold text-gray-900 mb-1">{t.transparency}</h4>
                        <p className="text-gray-600">{t.transparentBusinessPractices}</p>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.ourCommitment}</h3>
                <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                  {t.commitmentDescription}
                </p>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-green-700 font-semibold">{t.compliantTransparentCompany}</span>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.contactIdentity}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.trustedPartnerDescription}
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
                    src="/resources/carte visite.webp"
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
