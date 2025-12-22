import { cache } from 'react'

/**
 * Retrieves the regular font file asynchronously.
 * It returns a Promise that resolves to the font file's array buffer.
 * @returns A Promise resolving to the regular font file as an array buffer.
 */
export const getRegularFont = cache(async () => {
  // Use fetch to load font from public folder for Edge Runtime compatibility
  const url = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}/fonts/Geist-Regular.otf`
    : 'http://localhost:3000/fonts/Geist-Regular.otf'
  
  const response = await fetch(url)
  return await response.arrayBuffer()
})

/**
 * Retrieves the bold font file asynchronously.
 * It returns a Promise that resolves to the font file's array buffer.
 * @returns A Promise resolving to the bold font file as an array buffer.
 */
export const getBoldFont = cache(async () => {
  // Use fetch to load font from public folder for Edge Runtime compatibility
  const url = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}/fonts/Geist-Medium.otf`
    : 'http://localhost:3000/fonts/Geist-Medium.otf'
  
  const response = await fetch(url)
  return await response.arrayBuffer()
})
