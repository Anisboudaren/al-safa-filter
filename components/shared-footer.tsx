"use client"

import { Phone, Mail, ArrowRight, Facebook, Instagram } from "lucide-react"
import { TikTokIcon } from "@/components/ui/tiktok-icon"
import Link from "next/link"
import { trackFacebookEvent } from "@/lib/pixel"
import { useTranslation } from "@/components/language-provider"

export function SharedFooter() {
  const t = useTranslation()
  
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Logo Overlay */}
      <div className="absolute bottom-0 right-0 opacity-5">
        <img
          src="/ALSAFA LOGO.png"
          alt={t.backgroundLogoAlt}
          className="h-64 sm:h-96 w-auto object-contain"
        />
      </div>

      <div className="relative py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <img
                  src="/ALSAFA LOGO.png"
                  alt="Alsafa Filters"
                  className="h-10 sm:h-12 w-auto"
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">{t.brandName}</h3>
                  <p className="text-gray-400 text-sm sm:text-base">{t.tagline}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                {t.companyDescription}
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                  </div>
                  <a
                    href="tel:+213555046890"
                    onClick={() => trackFacebookEvent('Contact')}
                    className="text-base sm:text-lg hover:underline"
                  >
                    +213 555046890
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                  </div>
                  <a
                    href="mailto:contact@elitifakfilters.com"
                    onClick={() => trackFacebookEvent('Contact')}
                    className="text-base sm:text-lg hover:underline"
                  >
                    contact@elitifakfilters.com
                  </a>
                </div>
                 <div className="flex items-center gap-4">
                   <a
               href="https://uq2n5vkavyhuooys.public.blob.vercel-storage.com/catalogue/CATALOGUE%202025%20%20.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500/20 text-orange-400 w-full text-center font-semibold px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition-colors"
              >
                {t.downloadCatalogPdf}
              </a>
                </div>
               
              </div>
            </div>

            <div>
              <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">{t.navigation}</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-300">
                <li>
                  <Link
                    href="/"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    {t.home}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/global-filter"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    {t.catalog}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/a-propos"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />{t.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    {t.contact}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">{t.services}</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-300">
                <li>
                  <Link
                    href="/filter/vehicle"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    {t.searchByVehicle}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/filter/reference"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    {t.searchByReference}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/filter/dimensions"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    {t.searchByDimensions}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/filter/correspondence"
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    {t.correspondences}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div>
              <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">{t.socialMedia}</h4>
              <p className="text-gray-300 text-sm sm:text-base mb-4">
                {t.followUs}
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/share/1GPUHSKrps/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title="Facebook"
                >
                  <Facebook className="h-5 w-5 text-white" />
                </a>
                
                <a
                  href="https://www.instagram.com/alsafa_filters?igsh=YWRpMXhmZWw5a2p1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title="Instagram"
                >
                  <Instagram className="h-5 w-5 text-white" />
                </a>
                
                <a
                  href="https://www.tiktok.com/@alsafa_filtres?_t=ZS-90A09xcdHNf&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title="TikTok"
                >
                  <TikTokIcon className="h-5 w-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm sm:text-base text-center sm:text-left">
                {t.allRightsReserved}
              </p>
              
              {/* Social Media Icons - Mobile */}
              <div className="flex gap-3 sm:hidden">
                <a
                  href="https://www.facebook.com/share/1GPUHSKrps/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title="Facebook"
                >
                  <Facebook className="h-4 w-4 text-white" />
                </a>
                
                <a
                  href="https://www.instagram.com/alsafa_filters?igsh=YWRpMXhmZWw5a2p1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-pink-600 hover:bg-pink-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title="Instagram"
                >
                  <Instagram className="h-4 w-4 text-white" />
                </a>
                
                <a
                  href="https://www.tiktok.com/@alsafa_filtres?_t=ZS-90A09xcdHNf&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title="TikTok"
                >
                  <TikTokIcon className="h-4 w-4 text-white" />
                </a>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
                <Link href="#" className="hover:text-orange-400 transition-colors">
                  {t.termsOfUse}
                </Link>
                <Link href="#" className="hover:text-orange-400 transition-colors">
                  {t.privacyPolicy}
                </Link>
                <a 
                  href="https://uq2n5vkavyhuooys.public.blob.vercel-storage.com/certificates/IMG_2354.jpeg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400 transition-colors"
                >
                  {t.qualityPolicy}
                </a>
                <Link href="#" className="hover:text-orange-400 transition-colors">
                  {t.siteMap}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
