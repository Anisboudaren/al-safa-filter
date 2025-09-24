import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { Product } from './supabase'

export interface PDFGenerationOptions {
  product: Product
  companyInfo: {
    name: string
    logo: string
    phone: string
    email: string
    website?: string
    address?: string
  }
}

export const generateProductPDF = async (options: PDFGenerationOptions): Promise<void> => {
  const { product, companyInfo } = options
  
  // Create a new PDF document
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  
  // Colors
  const primaryColor = '#f97316' // Orange
  const secondaryColor = '#1f2937' // Dark gray
  const lightGray = '#f3f4f6'
  
  // Helper function to load image and convert to base64
  const loadImageAsBase64 = async (url: string): Promise<string | null> => {
    try {
      // Create a new image element to handle CORS
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      return new Promise((resolve) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            
            if (!ctx) {
              resolve(null)
              return
            }
            
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
            
            const dataURL = canvas.toDataURL('image/png')
            resolve(dataURL)
          } catch (error) {
            console.error('Error converting image to base64:', error)
            resolve(null)
          }
        }
        
        img.onerror = () => {
          console.error('Error loading image:', url)
          resolve(null)
        }
        
        img.src = url
      })
    } catch (error) {
      console.error('Error loading image:', error)
      return null
    }
  }
  
  // Helper function to add image to PDF
  const addImage = async (imageUrl: string, x: number, y: number, width: number, height: number): Promise<boolean> => {
    try {
      const base64 = await loadImageAsBase64(imageUrl)
      if (base64) {
        pdf.addImage(base64, 'JPEG', x, y, width, height)
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding image to PDF:', error)
      return false
    }
  }
  
  // Helper function to add text with styling
  const addText = (text: string, x: number, y: number, options: {
    fontSize?: number
    color?: string
    fontStyle?: 'normal' | 'bold'
    align?: 'left' | 'center' | 'right'
  } = {}) => {
    const { fontSize = 12, color = secondaryColor, fontStyle = 'normal', align = 'left' } = options
    pdf.setFontSize(fontSize)
    pdf.setTextColor(color)
    pdf.setFont('helvetica', fontStyle)
    pdf.text(text, x, y, { align })
  }
  
  // Helper function to add a line
  const addLine = (x1: number, y1: number, x2: number, y2: number, color: string = primaryColor) => {
    pdf.setDrawColor(color)
    pdf.setLineWidth(0.5)
    pdf.line(x1, y1, x2, y2)
  }
  
  // Helper function to add a rectangle
  const addRect = (x: number, y: number, width: number, height: number, color: string = lightGray) => {
    pdf.setFillColor(color)
    pdf.rect(x, y, width, height, 'F')
  }
  
  let currentY = 20
  
  // Header Section
  addRect(0, 0, pageWidth, 20, primaryColor)
  
  // Company name and tagline
  addText(companyInfo.name, 20, 15, { 
    fontSize: 18, 
    color: '#ffffff', 
    fontStyle: 'bold' 
  })
  
  
  
  // Main contact info in header (simplified)
  addText(`Tél: +213 32503168`, pageWidth - 20, 15, { 
    fontSize: 11, 
    color: '#ffffff', 
    align: 'right' 
  })
  
  
  currentY = 50
  
  // Product Title
  addText('FICHE PRODUIT', 20, currentY, { 
    fontSize: 24, 
    color: primaryColor, 
    fontStyle: 'bold' 
  })
  currentY += 15
  
  // Product Reference (Main)
  addText(`Référence: ${product.ALSAFA || 'N/A'}`, 20, currentY, { 
    fontSize: 16, 
    color: secondaryColor, 
    fontStyle: 'bold' 
  })
  currentY += 10
  
  // Product Image
  const imageWidth = 80
  const imageHeight = 80
  const imageX = pageWidth - imageWidth - 20
  const imageY = currentY
  
  // Image border
  pdf.setDrawColor(primaryColor)
  pdf.setLineWidth(1)
  pdf.rect(imageX, imageY, imageWidth, imageHeight)
  
  // Try to load the actual product image
  const productImageUrl = product.image_url || `https://devlly.net/alsafa/${(product.ALSAFA || "").replace("-", "")}.avif`
  const productImageLoaded = await addImage(productImageUrl, imageX, imageY, imageWidth, imageHeight)
  
  // If image failed to load, show placeholder text
  if (!productImageLoaded) {
    addText('Image du Produit', imageX + imageWidth/2, imageY + imageHeight/2, { 
      fontSize: 10, 
      color: secondaryColor, 
      align: 'center' 
    })
  }
  
  // Product Information
  const infoStartY = currentY
  const infoWidth = pageWidth - imageWidth - 50
  
  // Primary Information
  addText('INFORMATIONS PRINCIPALES', 20, infoStartY, { 
    fontSize: 14, 
    color: primaryColor, 
    fontStyle: 'bold' 
  })
  currentY += 8
  
  const primaryInfo = [
    { label: 'Référence ALSAFA', value: product.ALSAFA },
    { label: 'Référence Origine', value: product.REF_ORG },
    { label: 'SAFI', value: product.SAFI },
    { label: 'SARL F', value: product.SARL_F },
    { label: 'FLEETG', value: product.FLEETG },
    { label: 'ASAS', value: product.ASAS },
    { label: 'MECA F', value: product.MECA_F }
  ]
  
  primaryInfo.forEach((info, index) => {
    if (info.value) {
      const rowY = infoStartY + 12 + (index * 6)
      addText(`${info.label}:`, 20, rowY, { fontSize: 10, color: secondaryColor })
      addText(info.value, 20 + 60, rowY, { fontSize: 10, color: secondaryColor, fontStyle: 'bold' })
    }
  })
  
  currentY = Math.max(currentY, infoStartY + 12 + (primaryInfo.filter(i => i.value).length * 6) + 15)
  
  // Dimensions Section
  if (product.Ext || product.Int || product.H) {
    addText('DIMENSIONS', 20, currentY, { 
      fontSize: 14, 
      color: primaryColor, 
      fontStyle: 'bold' 
    })
    currentY += 8
    
    const dimensions = [
      { label: 'Externe', value: product.Ext },
      { label: 'Interne', value: product.Int },
      { label: 'Hauteur', value: product.H }
    ]
    
    dimensions.forEach((dim, index) => {
      if (dim.value) {
        const rowY = currentY + (index * 6)
        addText(`${dim.label}:`, 20, rowY, { fontSize: 10, color: secondaryColor })
        addText(dim.value, 20 + 40, rowY, { fontSize: 10, color: secondaryColor, fontStyle: 'bold' })
      }
    })
    
    currentY += 20
  }
  
  // Filtration System
  if (product.filtration_system) {
    addText('SYSTÈME DE FILTRATION', 20, currentY, { 
      fontSize: 14, 
      color: primaryColor, 
      fontStyle: 'bold' 
    })
    currentY += 8
    
    addText(product.filtration_system, 20, currentY, { 
      fontSize: 10, 
      color: secondaryColor 
    })
    currentY += 15
  }
  
  // Vehicle Compatibility
  if (product.divers_vehicules) {
    addText('COMPATIBILITÉ VÉHICULES', 20, currentY, { 
      fontSize: 14, 
      color: primaryColor, 
      fontStyle: 'bold' 
    })
    currentY += 8
    
    // Split long text into multiple lines
    const maxWidth = pageWidth - 40
    const words = product.divers_vehicules.split(' ')
    let line = ''
    let lineY = currentY
    
    words.forEach(word => {
      const testLine = line + word + ' '
      const textWidth = pdf.getTextWidth(testLine)
      
      if (textWidth > maxWidth && line !== '') {
        addText(line, 20, lineY, { fontSize: 10, color: secondaryColor })
        line = word + ' '
        lineY += 5
      } else {
        line = testLine
      }
    })
    
    if (line) {
      addText(line, 20, lineY, { fontSize: 10, color: secondaryColor })
    }
    
    currentY = lineY + 15
  }
  
  // Footer
  const footerY = pageHeight - 50
  addLine(20, footerY, pageWidth - 20, footerY, primaryColor)
  
  addText('Pour plus d\'informations, contactez-nous:', 20, footerY + 8, { 
    fontSize: 10, 
    color: secondaryColor 
  })
  
  // Contact information in two columns
  const leftColX = 20
  const rightColX = pageWidth / 2 + 10
  let contactY = footerY + 15
  
  // Left column - Phone numbers
  addText('TÉLÉPHONES:', leftColX, contactY, { 
    fontSize: 9, 
    color: primaryColor, 
    fontStyle: 'bold' 
  })
  contactY += 6
  addText(`Tél: +213 32503168`, leftColX, contactY, { fontSize: 8, color: secondaryColor })
  contactY += 4
  addText(`Mob: +213 555046890`, leftColX, contactY, { fontSize: 8, color: secondaryColor })
  contactY += 4
  addText(`Mob: +213 676888271`, leftColX, contactY, { fontSize: 8, color: secondaryColor })
  contactY += 4
  addText(`Fax: +213 32503169`, leftColX, contactY, { fontSize: 8, color: secondaryColor })
  
  // Right column - Emails
  contactY = footerY + 15
  addText('EMAILS:', rightColX, contactY, { 
    fontSize: 9, 
    color: primaryColor, 
    fontStyle: 'bold' 
  })
  contactY += 6
  addText(`sarlelitifak@gmail.com`, rightColX, contactY, { fontSize: 8, color: secondaryColor })
  contactY += 4
  addText(`commercial@elitifakfilters.com`, rightColX, contactY, { fontSize: 8, color: secondaryColor })
  contactY += 4
  addText(`purchase@elitifakfilters.com`, rightColX, contactY, { fontSize: 8, color: secondaryColor })
  contactY += 4
  addText(`marketing@elitifakfilters.com`, rightColX, contactY, { fontSize: 8, color: secondaryColor })
  
  // Generation date
  addText(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 20, footerY + 35, { 
    fontSize: 8, 
    color: secondaryColor, 
    align: 'right' 
  })
  
  // Save the PDF
  const fileName = `Fiche_Produit_${product.ALSAFA || 'Unknown'}_${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}

// Alternative method using HTML to Canvas (for more complex layouts)
export const generateProductPDFFromHTML = async (options: PDFGenerationOptions): Promise<void> => {
  const { product, companyInfo } = options
  
  // Create a temporary HTML element for PDF generation
  const tempDiv = document.createElement('div')
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  tempDiv.style.width = '210mm' // A4 width
  tempDiv.style.backgroundColor = 'white'
  tempDiv.style.padding = '20px'
  tempDiv.style.fontFamily = 'Arial, sans-serif'
  
  tempDiv.innerHTML = `
    <div style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 20px; margin: -20px -20px 20px -20px; border-radius: 0;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">${companyInfo.name}</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Solutions de Filtration Automobile</p>
        </div>
        <div style="text-align: right; font-size: 12px;">
          <p style="margin: 0;">Tél: +213 32503168</p>
          <p style="margin: 0;">Email: ${companyInfo.email}</p>
        </div>
      </div>
    </div>
    
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #f97316; font-size: 28px; margin: 0 0 10px 0;">FICHE PRODUIT</h2>
      <h3 style="color: #1f2937; font-size: 20px; margin: 0;">Référence: ${product.ALSAFA || 'N/A'}</h3>
    </div>
    
    <div style="display: flex; gap: 30px; margin-bottom: 30px;">
      <div style="flex: 1;">
        <h4 style="color: #f97316; font-size: 16px; margin: 0 0 15px 0; border-bottom: 2px solid #f97316; padding-bottom: 5px;">INFORMATIONS PRINCIPALES</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
          ${product.ALSAFA ? `<div><strong>Référence ALSAFA:</strong> ${product.ALSAFA}</div>` : ''}
          ${product.REF_ORG ? `<div><strong>Référence Origine:</strong> ${product.REF_ORG}</div>` : ''}
          ${product.SAFI ? `<div><strong>SAFI:</strong> ${product.SAFI}</div>` : ''}
          ${product.SARL_F ? `<div><strong>SARL F:</strong> ${product.SARL_F}</div>` : ''}
          ${product.FLEETG ? `<div><strong>FLEETG:</strong> ${product.FLEETG}</div>` : ''}
          ${product.ASAS ? `<div><strong>ASAS:</strong> ${product.ASAS}</div>` : ''}
          ${product.MECA_F ? `<div><strong>MECA F:</strong> ${product.MECA_F}</div>` : ''}
        </div>
      </div>
      
      <div style="width: 120px; height: 120px; border: 2px solid #f97316; display: flex; align-items: center; justify-content: center; background: #f9fafb; overflow: hidden;">
        <img src="${product.image_url || `https://devlly.net/alsafa/${(product.ALSAFA || "").replace("-", "")}.avif`}" 
             alt="Product Image" 
             style="width: 100%; height: 100%; object-fit: cover;" 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div style="text-align: center; color: #6b7280; font-size: 10px; display: none;">
          <div>Image du</div>
          <div>Produit</div>
        </div>
      </div>
    </div>
    
    ${product.Ext || product.Int || product.H ? `
    <div style="margin-bottom: 25px;">
      <h4 style="color: #f97316; font-size: 16px; margin: 0 0 15px 0; border-bottom: 2px solid #f97316; padding-bottom: 5px;">DIMENSIONS</h4>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; font-size: 12px;">
        ${product.Ext ? `<div style="background: #f0f9ff; padding: 10px; border-radius: 8px; text-align: center;"><strong>Externe</strong><br/>${product.Ext}</div>` : ''}
        ${product.Int ? `<div style="background: #f0fdf4; padding: 10px; border-radius: 8px; text-align: center;"><strong>Interne</strong><br/>${product.Int}</div>` : ''}
        ${product.H ? `<div style="background: #faf5ff; padding: 10px; border-radius: 8px; text-align: center;"><strong>Hauteur</strong><br/>${product.H}</div>` : ''}
      </div>
    </div>
    ` : ''}
    
    ${product.filtration_system ? `
    <div style="margin-bottom: 25px;">
      <h4 style="color: #f97316; font-size: 16px; margin: 0 0 15px 0; border-bottom: 2px solid #f97316; padding-bottom: 5px;">SYSTÈME DE FILTRATION</h4>
      <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; font-size: 12px;">
        ${product.filtration_system}
      </div>
    </div>
    ` : ''}
    
    ${product.divers_vehicules ? `
    <div style="margin-bottom: 25px;">
      <h4 style="color: #f97316; font-size: 16px; margin: 0 0 15px 0; border-bottom: 2px solid #f97316; padding-bottom: 5px;">COMPATIBILITÉ VÉHICULES</h4>
      <div style="background: #f9fafb; padding: 15px; border-radius: 8px; font-size: 12px; line-height: 1.5;">
        ${product.divers_vehicules}
      </div>
    </div>
    ` : ''}
    
    <div style="border-top: 2px solid #f97316; padding-top: 20px; margin-top: 30px;">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div style="flex: 1;">
          <p style="margin: 0 0 15px 0; font-size: 12px; color: #6b7280;">Pour plus d'informations, contactez-nous:</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 11px; color: #f97316; font-weight: bold;">TÉLÉPHONES</h4>
              <p style="margin: 0 0 4px 0; font-size: 10px; color: #374151;">Tél: +213 32503168</p>
              <p style="margin: 0 0 4px 0; font-size: 10px; color: #374151;">Mob: +213 555046890</p>
              <p style="margin: 0 0 4px 0; font-size: 10px; color: #374151;">Mob: +213 676888271</p>
              <p style="margin: 0; font-size: 10px; color: #374151;">Fax: +213 32503169</p>
            </div>
            
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 11px; color: #f97316; font-weight: bold;">EMAILS</h4>
              <p style="margin: 0 0 4px 0; font-size: 10px; color: #374151;">sarlelitifak@gmail.com</p>
              <p style="margin: 0 0 4px 0; font-size: 10px; color: #374151;">commercial@elitifakfilters.com</p>
              <p style="margin: 0 0 4px 0; font-size: 10px; color: #374151;">purchase@elitifakfilters.com</p>
              <p style="margin: 0; font-size: 10px; color: #374151;">marketing@elitifakfilters.com</p>
            </div>
          </div>
        </div>
        
        <div style="text-align: right; font-size: 10px; color: #6b7280; margin-left: 20px;">
          <p style="margin: 0;">Généré le: ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </div>
  `
  
  document.body.appendChild(tempDiv)
  
  try {
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    const fileName = `Fiche_Produit_${product.ALSAFA || 'Unknown'}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
  } finally {
    document.body.removeChild(tempDiv)
  }
}
