declare module '@/*' {
  const content: any
  export = content
}

// ==========================================
// Database Types
// ==========================================

export interface Post {
  id: number
  title: string
  slug: string
  date: string
  excerpt: string
  content: any // Contentful Rich Text JSON
  tags: string[] | string
  is_draft: number
  created_at: string
  updated_at: string
}

export interface Bookmark {
  id: number
  title: string
  slug: string
  url: string
  description?: string
  collection_id: string
  created_at: string
  updated_at: string
}

export interface ViewCount {
  id: number
  slug: string
  count: number
  type: 'post' | 'bookmark' | 'page'
  created_at: string
  updated_at: string
}

// ==========================================
// API Response Types
// ==========================================

export interface D1Result<T = any> {
  success: boolean
  results: T[]
  meta?: {
    duration: number
    rows_read: number
    rows_written: number
  }
}

export interface D1Response<T = any> {
  success: boolean
  result?: D1Result<T>[]
  error?: string
  messages?: string[]
}

// ==========================================
// Contentful Types
// ==========================================

export interface ContentfulPost {
  title: string
  slug: string
  date: string
  excerpt: string
  content: any
  tags: string[]
  sys?: {
    firstPublishedAt: string
    publishedAt: string
  }
}

export interface ContentfulSEO {
  title: string
  description: string
  ogImageTitle?: string
  ogImageSubtitle?: string
}

export interface RaindropCollection {
  id: number
  _id: number
  title: string
  slug: string
  description?: string
  icon?: string
  color?: string
  count: number
}

export interface RaindropItem {
  _id: number
  title: string
  link: string
  excerpt?: string
  created: string
  domain: string
  cover?: string
  type?: string
}

// ==========================================
// Component Props Types
// ==========================================

export interface WritingListProps {
  items: [string, ContentfulPost[]][]  // Array of [year, posts] tuples
  header?: string
}

export interface WritingLinkProps {
  post: ContentfulPost
  viewCount?: number
  isMobile?: boolean
  isActive?: boolean
}

export interface NavigationLinkProps {
  href: string
  label: string
  icon: React.ReactNode
  shortcutNumber?: number
}

export interface BookmarkCardProps {
  bookmark: RaindropItem
}

export interface JourneyCardProps {
  title: string
  description: string
  image: {
    url: string
    title?: string
    description?: string
    width?: number
    height?: number
  } | string
  index: number
}

export interface FloatingHeaderProps {
  title?: string
  bookmarks?: RaindropCollection[]
  currentBookmark?: RaindropCollection
}

export interface SideMenuProps {
  children: React.ReactNode
  title?: string
  bookmarks?: RaindropCollection[]
  isInner?: boolean
  className?: string
}

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  useScrollAreaId?: boolean
  className?: string
}

export interface TweetCardProps {
  id: string
  className?: string
}

export interface RichTextProps {
  content: any
}
