import ExcelJS from 'exceljs'
import { type Product } from './supabase'

// Color mappings for filtration systems
const getFiltrationSystemColor = (system: string) => {
  switch (system?.toLowerCase()) {
    case 'huile':
    case 'oil':
      return 'FFEB3B' // Yellow
    case 'gasoil':
    case 'diesel':
      return '2196F3' // Blue
    case 'air':
      return '4CAF50' // Green
    default:
      return 'FFFFFF' // White
  }
}

export async function exportProductsToExcel(
  products: Product[], 
  extraRefsMap?: Record<number, Array<{ ref_name: string; ref_value: string | null }>>,
  filename?: string
) {
  // Get all unique extra reference names
  const allExtraRefNames = new Set<string>()
  if (extraRefsMap) {
    Object.values(extraRefsMap).forEach(refs => {
      refs.forEach(ref => allExtraRefNames.add(ref.ref_name))
    })
  }
  const sortedExtraRefNames = Array.from(allExtraRefNames).sort()
  
  // Create a new workbook
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Products')
  
  // Define column structure
  const columnDefs = [
    { header: 'ALSAFA', key: 'ALSAFA', width: 15 },
    { header: 'Name', key: 'Name', width: 30 },
    { header: 'Origin (REF_ORG)', key: 'Origin', width: 20 },
    { header: 'SAFI', key: 'SAFI', width: 15 },
    { header: 'SARL F', key: 'SARL_F', width: 15 },
    { header: 'FLEETG', key: 'FLEETG', width: 15 },
    { header: 'ASAS', key: 'ASAS', width: 15 },
    { header: 'MECA F', key: 'MECA_F', width: 15 },
    { header: 'Ext', key: 'Ext', width: 12 },
    { header: 'Int', key: 'Int', width: 12 },
    { header: 'H', key: 'H', width: 12 },
    { header: 'Filtration System', key: 'Filtration System', width: 20 },
    { header: 'Ptte', key: 'Ptte', width: 15 },
    { header: 'MANN', key: 'MANN', width: 15 },
    { header: 'UFI', key: 'UFI', width: 15 },
    { header: 'HIFI', key: 'HIFI', width: 15 },
    { header: 'WIX', key: 'WIX', width: 15 },
    { header: 'Image URL', key: 'Image URL', width: 50 },
  ]
  
  // Add extra reference columns
  sortedExtraRefNames.forEach(refName => {
    columnDefs.push({ header: refName, key: refName, width: 15 })
  })
  
  worksheet.columns = columnDefs
  
  // Add header row with styling
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  }
  
  // Add data rows
  products.forEach(product => {
    const rowData: any = {
      'ALSAFA': product.ALSAFA || '',
      'Name': product.name || '',
      'Origin': product.REF_ORG || '',
      'SAFI': product.SAFI || '',
      'SARL_F': product.SARL_F || '',
      'FLEETG': product.FLEETG || '',
      'ASAS': product.ASAS || '',
      'MECA_F': product.MECA_F || '',
      'Ext': product.Ext || '',
      'Int': product.Int || '',
      'H': product.H || '',
      'Filtration System': product.filtration_system || '',
      'Ptte': product.Ptte || '',
      'MANN': product.MANN || '',
      'UFI': product.UFI || '',
      'HIFI': product.HIFI || '',
      'WIX': product.WIX || '',
      'Image URL': product.image_url || '',
    }
    
    // Add extra reference columns
    if (product.id && extraRefsMap && extraRefsMap[product.id]) {
      extraRefsMap[product.id].forEach(ref => {
        rowData[ref.ref_name] = ref.ref_value || ''
      })
    }
    
    const row = worksheet.addRow(rowData)
    
    // Color the Filtration System cell based on the value
    const filtrationSystemCell = row.getCell('Filtration System')
    const color = getFiltrationSystemColor(product.filtration_system || '')
    filtrationSystemCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    }
  })
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0]
  const defaultFilename = `AlSafa_Products_${timestamp}.xlsx`
  const finalFilename = filename || defaultFilename
  
  // Write file as buffer and download
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  })
  
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = finalFilename
  link.click()
  window.URL.revokeObjectURL(url)
}

