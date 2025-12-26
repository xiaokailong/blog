// API配置 - 统一使用生产环境API
export const API_BASE_URL = 'https://velen-blog.pages.dev/api'

// 获取完整的API URL
export function getApiUrl(path: string): string {
  // 移除开头的斜杠（如果有）
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  // 移除 'api/' 前缀（如果有）
  const finalPath = cleanPath.startsWith('api/') ? cleanPath.slice(4) : cleanPath
  
  return `${API_BASE_URL}/${finalPath}`
}
