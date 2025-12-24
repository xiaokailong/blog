-- ==========================================
-- 生产数据库更新脚本
-- 执行日期: 2025-12-24
-- 说明: 添加 page_views 表以支持页面访问统计
-- ==========================================

-- 创建 page_views 表
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT NOT NULL,
  page TEXT NOT NULL,
  visited_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(ip_address, page) -- 每个IP每个页面只记录一次
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_page_views_ip ON page_views(ip_address);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page);
CREATE INDEX IF NOT EXISTS idx_page_views_visited_at ON page_views(visited_at DESC);

-- 验证表是否创建成功
-- SELECT sql FROM sqlite_master WHERE type='table' AND name='page_views';
