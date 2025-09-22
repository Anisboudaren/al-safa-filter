const XLSX = require('xlsx');
const path = require('path');

async function examineExcelFile() {
  try {
    const filePath = path.join(__dirname, '../public/LISTING 2025/LISTING.xlsx');
    console.log('Reading Excel file from:', filePath);
    
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    
    console.log('\n=== EXCEL FILE ANALYSIS ===');
    console.log('Sheet names:', workbook.SheetNames);
    console.log('Number of sheets:', workbook.SheetNames.length);
    
    // Analyze each sheet
    workbook.SheetNames.forEach((sheetName, index) => {
      console.log(`\n--- Sheet ${index + 1}: "${sheetName}" ---`);
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      console.log('Total rows:', jsonData.length);
      
      if (jsonData.length > 0) {
        console.log('Headers (first row):', jsonData[0]);
        console.log('Number of columns:', jsonData[0].length);
        
        // Show first few data rows
        console.log('\nFirst 3 data rows:');
        for (let i = 1; i <= Math.min(3, jsonData.length - 1); i++) {
          console.log(`Row ${i}:`, jsonData[i]);
        }
        
        // Show sample data with headers
        if (jsonData.length > 1) {
          console.log('\nSample data with headers:');
          const headers = jsonData[0];
          const sampleRow = jsonData[1];
          const sampleData = {};
          headers.forEach((header, colIndex) => {
            sampleData[header] = sampleRow[colIndex];
          });
          console.log(JSON.stringify(sampleData, null, 2));
        }
      }
    });
    
    console.log('\n=== ANALYSIS COMPLETE ===');
    
  } catch (error) {
    console.error('Error reading Excel file:', error.message);
  }
}

examineExcelFile();
