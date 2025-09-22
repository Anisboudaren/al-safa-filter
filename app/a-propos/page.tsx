"use client"

import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Factory, Package, Award, Phone, Mail, MapPin, CheckCircle, QrCode, Shield } from "lucide-react"
import MobileHeader from "@/components/mobile-header"

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-white">
      <MobileHeader />
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Intro + Logo */}
        <section className="text-center mb-16 sm:mb-20">
          <div className="mb-8 sm:mb-12">
            {/* <img
              src="https://devlly.net/alsafa/resources/ALSFA%20LOGO_bg.png"
              alt="Alsafa Filters Logo"
              className="h-24 sm:h-32 mx-auto mb-6 sm:mb-8"
            /> */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Alsafa Filters</h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Depuis 2002, Alsafa Filters est le leader algérien dans la filtration automobile, offrant des solutions innovantes et de haute qualité pour tous types de véhicules. Nous nous engageons chaque jour à l’excellence, à l’innovation et à la satisfaction de nos clients.
            </p>
          </div>
        </section>

        {/* Team & R&D */}
        <section className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Équipe & Recherche</h2>
              </div>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
               Notre équipe d’ingénieurs spécialisés œuvre en continu au développement et à l’amélioration de nos filtres. Grâce à notre laboratoire de pointe, chaque produit fait l’objet de tests rigoureux afin d’assurer des performances optimales.


              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">15+</div>
                  <div className="text-sm sm:text-base text-gray-600">Ingénieurs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">500+</div>
                  <div className="text-sm sm:text-base text-gray-600">Tests par mois</div>
                </div>
              </div>
            </div>
            <div className="order-first lg:order-last">
              <img
                src="https://devlly.net/alsafa/resources/men%20in%20the%20lab%20working%20on%20testing%20and%20devlping%20filters.jpg"
                alt="Équipe de recherche et développement"
                className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Factory & Production */}
        <section className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <img
                src="https://devlly.net/alsafa/resources/photo%20of%20a%20man%20in%20the%20USINE%20ALSAFA%20FILTRES.jpg"
                alt="Usine Alsafa Filters"
                className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg mb-6 sm:mb-8"
              />
              <img
                src="https://devlly.net/alsafa/resources/photo%20or%20some%20filters%20in%20productions.jpg"
                alt="Filtres en production"
                className="w-full h-48 sm:h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <Factory className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Usine & Production</h2>
              </div>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
               Notre usine moderne, implantée en Algérie, utilise des technologies de pointe pour la production de filtres automobiles. Nous maintenons des standards de qualité élevés tout en optimisant notre capacité de production afin de répondre efficacement à la demande croissante.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">50,000+</div>
                  <div className="text-sm sm:text-base text-gray-600">Filtres/mois</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-sm sm:text-base text-gray-600">Production</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs sm:text-sm">
                  Production automatisée
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm">
                  Contrôle qualité
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm">
                  Traçabilité complète
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Nos Produits</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Une gamme complète de filtres automobiles pour répondre à tous vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <img
              src="https://devlly.net/alsafa/resources/photo%20of%20some%20filters%20with%20differnet%20sizes.jpg"
              alt="Différents types de filtres"
              className="w-full h-64 sm:h-80 object-cov</p>er rounded-2xl shadow-lg"
            />
            <img
              src="https://devlly.net/alsafa/resources/aboutus%20filters.avif"
              alt="Catalogue de filtres"
              className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="text-center p-4 sm:p-6">
              <CardContent className="p-0">
                <div className="text-xl sm:text-2xl font-bold text-orange-600 mb-2">2,500+</div>
                <div className="text-sm sm:text-base text-gray-600">Références disponibles</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4 sm:p-6">
              <CardContent className="p-0">
                <div className="text-xl sm:text-2xl font-bold text-orange-600 mb-2">150+</div>
                <div className="text-sm sm:text-base text-gray-600">Marques compatibles</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4 sm:p-6">
              <CardContent className="p-0">
                <div className="text-xl sm:text-2xl font-bold text-orange-600 mb-2">99.8%</div>
                <div className="text-sm sm:text-base text-gray-600">Taux de satisfaction</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4 sm:p-6">
              <CardContent className="p-0">
                <div className="text-xl sm:text-2xl font-bold text-orange-600 mb-2">48h</div>
                <div className="text-sm sm:text-base text-gray-600">Livraison express</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Certifications & Standards */}
        {/* Our Certifications */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Nos Certifications</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Des standards de qualité reconnus internationalement pour votre tranquillité d'esprit
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="text-center p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border-2 border-gray-100">
              <CardContent className="p-0">
                <img
                  src="https://devlly.net/alsafa/resources/ISO%2014001.png"
                  alt="Certification ISO 14001"
                  className="h-20 sm:h-24 mx-auto mb-4 sm:mb-6"
                />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">ISO 14001</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                  Management environnemental pour une production respectueuse de l'environnement
                </p>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">Certifié</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border-2 border-gray-100">
              <CardContent className="p-0">
                <img
                  src="https://devlly.net/alsafa/resources/the%20certifcate%20of%20ISO%209001.png"
                  alt="Certification ISO 9001"
                  className="h-20 sm:h-24 mx-auto mb-4 sm:mb-6"
                />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">ISO 9001</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                  Management de la qualité garantissant l'excellence de nos processus de production
                </p>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">Certifié</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border-2 border-gray-100">
              <CardContent className="p-0">
                <img
                  src="https://devlly.net/alsafa/resources/ISO%2045001.png"
                  alt="Certification ISO 45001"
                  className="h-20 sm:h-24 mx-auto mb-4 sm:mb-6"
                />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">ISO 45001</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                  Système de management de la santé et sécurité au travail pour la protection de nos équipes et partenaires
                </p>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">Certifié</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 sm:col-span-2 lg:col-span-1">
              <CardContent className="p-0">
                <img
                  src="https://devlly.net/alsafa/resources/QR%20code%20%20elitifak%20filters%20black%20.png"
                  alt="QR Code Elitifak Filters"
                  className="h-20 sm:h-24 mx-auto mb-4 sm:mb-6"
                />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Authentification</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                  Vérification QR pour l'authentification de tous nos produits
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">Vérifiable</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

        {/* Contact / Identity */}
        <section className="mb-8 sm:mb-12">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact & Identité</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="text-center lg:text-left">
              <img
                src="https://devlly.net/alsafa/resources/carta"
                alt="Carte d'identité SARL EL ITIFAK"
                className="max-w-sm mx-auto lg:mx-0 mb-6 sm:mb-8 rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">SARL EL ITIFAK</h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Adresse</h4>
                    <p className="text-gray-600">Z.A.D.N N 100 - 04300 AIN MLILA, Algérie</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Téléphone</h4>
                    <p className="text-gray-600">+213 555 046 890</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">contact@elitifakfilters.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Statut</h4>
                    <p className="text-gray-600">Société à Responsabilité Limitée</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SharedFooter />
      
    </div>
  )
}
