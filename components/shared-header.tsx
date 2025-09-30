"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft, Home, Search, Download, CheckCircle, Facebook, Instagram, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { useTranslation } from "@/components/language-provider"

interface SharedHeaderProps {
  title: string
  description: string
  icon: React.ReactNode
  showBackButton?: boolean
  showHomeButton?: boolean
}

export function SharedHeader({ 
  title, 
  description, 
  icon, 
  showBackButton = true, 
  showHomeButton = true 
}: SharedHeaderProps) {
  const t = useTranslation()
  return (
    <motion.header 
      className="bg-white border-b border-gray-200 shadow-lg sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link href="/home">
            <motion.div 
              className="flex items-center gap-3 sm:gap-4 group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="relative"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center p-2">
                  {icon}
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <CheckCircle className="h-3 w-3 text-white" />
                </motion.div>
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-orange-500 transition-all duration-300">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 group-hover:text-orange-600 transition-colors duration-300">
                  {description}
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Navigation and Actions */}
          <div className="flex items-center gap-4">
            {/* Back and Home Buttons */}
            <div className="flex items-center gap-2">
              {showBackButton && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-600 hover:border-orange-300 transition-all duration-300 rounded-xl"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.back}</span>
                  </Button>
                </motion.div>
              )}
              
              {showHomeButton && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/home">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-gray-600 hover:text-orange-600 hover:border-orange-300 transition-all duration-300 rounded-xl"
                    >
                      <Home className="h-4 w-4" />
                      <span className="hidden sm:inline">{t.home}</span>
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>

            <LanguageSwitcher />

            {/* Search Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => window.location.href = '/catalog'}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t.search}</span>
                <span className="sm:hidden">{t.searchShort}</span>
              </Button>
            </motion.div>

            {/* PDF Download Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="https://devlly.net/alsafa/resources/CATALOGUE%202025%20%20.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{t.downloadPdf}</span>
                <span className="sm:hidden">{t.downloadPdfShort}</span>
              </a>
            </motion.div>

            {/* Social Media Links */}
            <div className="flex items-center gap-2">
              <motion.a
                href="https://www.facebook.com/share/1Un2RrRJHS/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors duration-300"
                title="Facebook"
              >
                <Facebook className="h-4 w-4 text-white" />
              </motion.a>
              
              <motion.a
                href="https://www.instagram.com/alsafa_filters?igsh=MmdnNHg3aDV1MnRo"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-pink-600 hover:bg-pink-700 rounded-lg flex items-center justify-center transition-colors duration-300"
                title="Instagram"
              >
                <Instagram className="h-4 w-4 text-white" />
              </motion.a>
              
              <motion.a
                href="https://www.tiktok.com/@alsafa_filtres?_t=ZS-90A09xcdHNf&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-gray-800 hover:bg-gray-900 rounded-lg flex items-center justify-center transition-colors duration-300"
                title="TikTok"
              >
                <Globe className="h-4 w-4 text-white" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
