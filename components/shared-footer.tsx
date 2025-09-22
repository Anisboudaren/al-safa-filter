"use client"

import { Phone, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

export function SharedFooter() {
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Logo Overlay */}
      <div className="absolute bottom-0 right-0 opacity-5">
        <img
          src="https://devlly.net/alsafa/resources/alsafa%20logo.png"
          alt="Background Logo"
          className="h-64 sm:h-96 w-auto object-contain"
        />
      </div>

      <div className="relative py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <img
                  src="https://devlly.net/alsafa/resources/alsafa%20logo.png"
                  alt="Alsafa Filters"
                  className="h-10 sm:h-12 w-auto"
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">Alsafa Filters</h3>
                  <p className="text-gray-400 text-sm sm:text-base">Solutions de filtration automobile</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                Alsafa Filters vous garantit des filtres de haute qualité pour tous types de véhicules, avec un service
                client exceptionnel et une expertise technique reconnue dans toute l'Algérie.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                  </div>
                  <span className="text-base sm:text-lg">+213 555046890</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                  </div>
                  <span className="text-base sm:text-lg">contact@elitifakfilters.com</span>
                </div>
                 <div className="flex items-center gap-4">
                   <a
               href="https://devlly.net/alsafa/resources/CATALOGUE%202025%20%20.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500/20 text-orange-400 w-full text-center font-semibold px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition-colors"
              >
                Télécharger le catalogue PDF
              </a>
                </div>
               
              </div>
            </div>

            <div>
              <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Navigation</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-300">
                <li>
                  <Link
                    href="/"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/global-filter"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    Catalogue
                  </Link>
                </li>
                <li>
                  <Link
                    href="/a-propos"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />À propos
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Services</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-300">
                <li>
                  <Link
                    href="/filter/vehicle"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    Recherche par véhicule
                  </Link>
                </li>
                <li>
                  <Link
                    href="/filter/reference"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    Recherche par référence
                  </Link>
                </li>
                <li>
                  <Link
                    href="/filter/dimensions"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    Recherche par dimensions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/filter/correspondence"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    Correspondances
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm sm:text-base text-center sm:text-left">
                &copy; 2025 By Elitifak filters. Tous droits réservés.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
                <Link href="#" className="hover:text-orange-400 transition-colors">
                  Conditions d'utilisation
                </Link>
                <Link href="#" className="hover:text-orange-400 transition-colors">
                  Politique de confidentialité
                </Link>
                <Link href="#" className="hover:text-orange-400 transition-colors">
                  Plan du site
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
