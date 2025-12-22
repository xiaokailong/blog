import { cache } from 'react'

/**
 * Retrieves the regular font file asynchronously.
 * It returns a Promise that resolves to the font file's array buffer.
 * @returns A Promise resolving to the regular font file as an array buffer.
 */
export const getRegularFont = cache(async () => {
  // Use fetch to load font from public folder for Edge Runtime compatibility
  const baseUrl = process.env.CF_PAGES_URL || process.env.VERCEL_URL 
    ? `https://${process.env.CF_PAGES_URL || process.env.VERCEL_URL}`
    : 'http://localhost:3000'
  const url = `${baseUrl}/fonts/Geist-Regular.otf`
  
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
  const baseUrl = process.env.CF_PAGES_URL || process.env.VERCEL_URL 
    ? `https://${process.env.CF_PAGES_URL || process.env.VERCEL_URL}`
    : 'http://localhost:3000'
  const url = `${baseUrl}/fonts/Geist-Medium.otf`
  
  const response = await fetch(url)
  return await response.arrayBuffer()
})
