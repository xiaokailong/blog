-- Cloudflare D1 Database Schema for Blog
-- Database: blog-db
-- ID: 3dd242d5-f86b-4acb-83e8-04945a47a525

-- ==========================================
-- Table: posts (文章)
-- ==========================================
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL, -- JSON格式存储富文本内容
  excerpt TEXT, -- 文章摘要
  date TEXT NOT NULL, -- ISO 8601格式日期
  first_published_at TEXT NOT NULL,
  published_at TEXT NOT NULL,
  is_draft INTEGER DEFAULT 0, -- 0=已发布, 1=草稿
  tags TEXT, -- JSON数组格式存储标签
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 索引优化查询
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_posts_is_draft ON posts(is_draft);

-- ==========================================
-- Table: view_counts (浏览量)
-- ==========================================
CREATE TABLE IF NOT EXISTS view_counts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  view_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_view_counts_slug ON view_counts(slug);

-- ==========================================
-- Table: bookmarks (书签提交)
-- ==========================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  email TEXT,
  type TEXT DEFAULT 'Other', -- Article, Video, Tool, Other
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  collection_id INTEGER, -- 关联到书签集合
  date TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_status ON bookmarks(status);
CREATE INDEX IF NOT EXISTS idx_bookmarks_collection_id ON bookmarks(collection_id);

-- ==========================================
-- Table: bookmark_collections (书签集合)
-- ==========================================
CREATE TABLE IF NOT EXISTS bookmark_collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- emoji或图标
  color TEXT, -- 主题色
  count INTEGER DEFAULT 0, -- 书签数量
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookmark_collections_slug ON bookmark_collections(slug);

-- ==========================================
-- Table: journey_items (旅程/时间线)
-- ==========================================
CREATE TABLE IF NOT EXISTS journey_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT, -- work, education, achievement, etc.
  icon TEXT, -- emoji或图标
  link TEXT, -- 相关链接
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_journey_year ON journey_items(year DESC);
CREATE INDEX IF NOT EXISTS idx_journey_date ON journey_items(date DESC);

-- ==========================================
-- Table: page_views (页面访问记录)
-- ==========================================
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT NOT NULL,
  page TEXT NOT NULL,
  visited_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(ip_address, page) -- 每个IP每个页面只记录一次
);

CREATE INDEX IF NOT EXISTS idx_page_views_ip ON page_views(ip_address);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page);
CREATE INDEX IF NOT EXISTS idx_page_views_visited_at ON page_views(visited_at DESC);
