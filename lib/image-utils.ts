// Utility functions for handling product images

export function getProductImageUrl(alsafa: string | null, filtrationSystem: string): string | null {
  if (!alsafa) return null;

  // Remove any spaces and convert to uppercase for matching
  const cleanAlsafa = alsafa.replace(/\s+/g, '').toUpperCase();
  
  // Determine the folder based on filtration system and ALSAFA prefix
  let folder = '';
  
  if (filtrationSystem === 'air') {
    if (cleanAlsafa.startsWith('FA-') || cleanAlsafa.startsWith('FAP') || cleanAlsafa.startsWith('FPL')) {
      folder = 'FAP';
    }
  } else if (filtrationSystem === 'gasoil') {
    if (cleanAlsafa.startsWith('GBS-')) {
      folder = 'GBS';
    }
  } else if (filtrationSystem === 'huile') {
    if (cleanAlsafa.startsWith('OBS-')) {
      folder = 'OBS';
    }
  }

  if (!folder) return null;

  // Try to find matching image files
  const possibleNames = [
    cleanAlsafa.replace('-', ''), // Remove dashes
    cleanAlsafa.replace('-', ' '), // Replace dash with space
    cleanAlsafa, // Keep as is
  ];

  // Common image extensions
  const extensions = ['.jpg', '.jpeg', '.png', '.webp'];

  // For each possible name, try different extensions
  for (const name of possibleNames) {
    for (const ext of extensions) {
      const imagePath = `/images/${folder}/${name}${ext}`;
      // Note: In a real implementation, you might want to check if the file exists
      // For now, we'll return the first possible path and let the browser handle 404s
      return imagePath;
    }
  }

  return null;
}

export function getProductImageUrlWithFallback(alsafa: string | null, filtrationSystem: string, existingImageUrl?: string | null): string | null {
  // Only use uploaded/online images - no local fallback
  return existingImageUrl || null;
}

// Helper function to check if an image exists (for future use)
export async function checkImageExists(imagePath: string): Promise<boolean> {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
