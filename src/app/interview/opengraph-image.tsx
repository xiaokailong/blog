import { OpenGraphImage } from '@/components/content/og-image'

export const runtime = 'edge'
export const alt = '前端面试题'
export const contentType = 'image/png'

export default async function Image() {
  return OpenGraphImage({ title: '前端面试题' })
}
