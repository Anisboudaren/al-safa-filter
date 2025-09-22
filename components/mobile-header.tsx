"use client"
import { useState, useEffect } from "react"
import { Menu, X, Phone, Mail, Search, Download, ArrowRight, CheckCircle, Home, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface MobileHeaderProps {
  forceSolid?: boolean
}

export default function MobileHeader({ forceSolid = false }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleSearchClick = () => {
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })
    closeMenu()
  }

  return (
    <>
            <motion.header
              className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                forceSolid || isScrolled
                  ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
                  : 'bg-transparent'
              }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
          <div className="flex items-center justify-between">
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
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center p-1 sm:p-2">
                    <img
                      src="https://devlly.net/alsafa/resources/alsafa logo.png"
                      alt="Alsafa Filters"
                      className="h-6 sm:h-10 w-auto"
                    />
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
                        <h1 className={`text-lg sm:text-2xl font-bold transition-all duration-300 ${
                          forceSolid || isScrolled
                            ? 'text-gray-900 group-hover:text-orange-600'
                            : 'text-white group-hover:text-orange-300'
                        }`}>
                    Alsafa Filters
                  </h1>
                  <p className={`text-xs sm:text-sm transition-colors duration-300 ${
                    forceSolid || isScrolled 
                      ? 'text-gray-600 group-hover:text-orange-600' 
                      : 'text-gray-200 group-hover:text-orange-300'
                  }`}>
                    <span className="hidden sm:inline">Solutions de filtration automobile</span>
                    <span className="sm:hidden">Filtres auto</span>
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                      <Link href="/home" className={`font-medium transition-colors duration-300 ${
                        forceSolid || isScrolled
                          ? 'text-gray-700 hover:text-orange-600'
                          : 'text-white hover:text-orange-300'
                      }`}>
                  Accueil
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                      <Link href="/catalog" className={`font-medium transition-colors duration-300 ${
                        forceSolid || isScrolled
                          ? 'text-gray-700 hover:text-orange-600'
                          : 'text-white hover:text-orange-300'
                      }`}>
                  Catalogue
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                      <Link href="/a-propos" className={`font-medium transition-colors duration-300 ${
                        forceSolid || isScrolled
                          ? 'text-gray-700 hover:text-orange-600'
                          : 'text-white hover:text-orange-300'
                      }`}>
                  À propos
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSearchClick}
                        className={`font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                          forceSolid || isScrolled
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                            : 'bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white border border-white/40'
                        }`}
                >
                  <Search className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Rechercher</span>
                  <span className="sm:hidden">Recherche</span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="https://devlly.net/alsafa/resources/CATALOGUE%202025%20%20.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                        className={`font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 ${
                          forceSolid || isScrolled
                            ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white'
                            : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30'
                        }`}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Catalogue PDF</span>
                  <span className="sm:hidden">PDF</span>
                </a>
              </motion.div>
            </nav>

            {/* Mobile Menu Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                      className={`md:hidden transition-all duration-300 ${
                        forceSolid || isScrolled
                          ? 'bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-200'
                          : 'bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white border border-white/40 shadow-lg'
                      }`}
                onClick={toggleMenu}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden border-l border-gray-200"
          >
            <div className="p-6 h-full flex flex-col bg-white">
              {/* Close Button */}
              <motion.div 
                className="flex justify-between items-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src="https://devlly.net/alsafa/resources/ALSAFA%20LOGO.png"
                      alt="Alsafa Filters"
                      className="h-10 w-auto"
                    />
                  </motion.div>
                  <div>
                    <span className="font-bold text-lg text-gray-900">Menu</span>
                    <p className="text-xs text-orange-600 font-medium">Navigation</p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button variant="ghost" size="sm" onClick={closeMenu} className="rounded-full">
                    <X className="h-6 w-6" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Navigation Links */}
              <nav className="space-y-2 mb-8 flex-1">
                {[
                  { href: "/home", label: "Accueil", icon: Home },
                  { href: "/catalog", label: "Catalogue", icon: FileText },
                  { href: "/a-propos", label: "À propos", icon: Info },
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-4 py-4 px-4 text-lg font-medium text-gray-700 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-xl transition-all duration-300 group"
                      onClick={closeMenu}
                    >
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-300">
                        <item.icon className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span>{item.label}</span>
                      <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </motion.div>
                ))}

                {/* Search Button */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleSearchClick}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                  >
                    <Search className="h-5 w-5" />
                    Rechercher un filtre
                  </Button>
                </motion.div>
              </nav>

              {/* Contact Info & Actions */}
              <motion.div 
                className="border-t border-gray-200 pt-6 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {/* Download PDF Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a
                    href="https://devlly.net/alsafa/resources/CATALOGUE%202025%20%20.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold px-4 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                  >
                    <Download className="h-5 w-5" />
                    Télécharger le catalogue PDF
                  </a>
                </motion.div>
                
                {/* Contact Info */}
                <div className="space-y-3">
                  <motion.div 
                    className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Téléphone</p>
                      <p className="text-sm">+213 555 046 890</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-sm">contact@elitifakfilters.com</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
