-- 初始化点赞表
-- 用于同步到Cloudflare D1生产数据库

-- 创建点赞表
CREATE TABLE IF NOT EXISTS site_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT NOT NULL,
  liked_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_site_likes_ip ON site_likes(ip_address);
CREATE INDEX IF NOT EXISTS idx_site_likes_liked_at ON site_likes(liked_at DESC);

-- 验证表创建
SELECT 'site_likes table created successfully' as status;
