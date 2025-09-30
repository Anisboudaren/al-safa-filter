import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { LanguageProvider } from '@/components/language-provider'
import { FacebookPageViewTracker } from '@/components/FacebookPageView.tsx'
import { FontWrapper } from '@/components/font-wrapper'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo'
})

export const metadata: Metadata = {
  title: 'Alsafa Filters - Product Catalog',
  description: 'Internal distribution system for car parts and filters',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable}`}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/ALSAFA LOGO.png" type="image/png" />
        <link rel="shortcut icon" href="/ALSAFA LOGO.png" type="image/png" />
        <link rel="apple-touch-icon" href="/ALSAFA LOGO.png" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1QE9KCQR5N"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1QE9KCQR5N');
          `}
        </Script>
        {/* Meta Pixel Code */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '3167277163431706');
            fbq('track', 'PageView');
          `}
        </Script>
        {/* End Meta Pixel Code */}
      </head>
      <body className={`${inter.className} ${cairo.className}`}>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=3167277163431706&ev=PageView&noscript=1"
          />
        </noscript>
        <LanguageProvider>
          <FontWrapper 
            interClass={inter.className} 
            cairoClass={cairo.className}
          >
            <FacebookPageViewTracker />
            {children}
          </FontWrapper>
        </LanguageProvider>
      </body>
    </html>
  )
}
