-- ==========================================
-- 首页数据表设计（简化版）
-- 说明：只使用一个表管理首页所有数据
-- ==========================================

-- 删除旧的统计相关表
DROP TABLE IF EXISTS page_views;
DROP TABLE IF EXISTS site_likes;

-- 创建新的首页数据表
CREATE TABLE IF NOT EXISTS homepage (
  id INTEGER PRIMARY KEY DEFAULT 1,
  -- 个人介绍（可以在数据库中管理，便于更新）
  introduction TEXT DEFAULT 'Hello guys! I''m a Senior Frontend Engineer at a Fortune 500 multinational corporation, where I bring creativity and technical excellence to crafting exceptional web experiences. With a deep passion for programming and innovative design, I find inspiration in music and continuously enhance my English proficiency.',
  
  -- 网站运行起始时间
  site_start_date TEXT DEFAULT '2025-12-23',
  
  -- 访问次数（累计，每次访问+1）
  visit_count INTEGER DEFAULT 0,
  
  -- 点赞次数（累计）
  like_count INTEGER DEFAULT 0,
  
  -- 记录更新时间
  updated_at TEXT DEFAULT (datetime('now')),
  
  -- 确保只有一条记录
  CHECK (id = 1)
);

-- 插入初始数据
INSERT OR IGNORE INTO homepage (id, introduction, site_start_date, visit_count, like_count)
VALUES (
  1,
  'Hello guys! I''m a Senior Frontend Engineer at a Fortune 500 multinational corporation, where I bring creativity and technical excellence to crafting exceptional web experiences. With a deep passion for programming and innovative design, I find inspiration in music and continuously enhance my English proficiency.',
  '2025-12-23',
  0,
  0
);

-- 创建触发器，自动更新 updated_at
CREATE TRIGGER IF NOT EXISTS update_homepage_timestamp
AFTER UPDATE ON homepage
FOR EACH ROW
BEGIN
  UPDATE homepage SET updated_at = datetime('now') WHERE id = 1;
END;
