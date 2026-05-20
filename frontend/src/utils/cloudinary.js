/**
 * Automatically applies f_auto (WebP/AVIF) and q_auto (smart compression)
 * to any Cloudinary URL. Non-Cloudinary URLs are returned unchanged.
 * Reduces image size 30–60% with zero visual quality loss.
 */
export function optimizeCloudinaryUrl(url, { width, height } = {}) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;

  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);

  // Insert transforms after /upload/
  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
}

/**
 * Returns a low-quality placeholder (blur-up) URL for progressive loading.
 */
export function cloudinaryPlaceholder(url) {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  return url.replace('/upload/', '/upload/w_20,q_10,e_blur:500,f_auto/');
}
