-- 清空所有表的脚本（慎用！）
-- 这会删除所有数据但保留表结构

-- 清空所有表
DELETE FROM journey_items;
DELETE FROM bookmarks;
DELETE FROM bookmark_collections;
DELETE FROM view_counts;
DELETE FROM posts;

-- 重置自增ID（SQLite特性）
DELETE FROM sqlite_sequence WHERE name IN ('posts', 'view_counts', 'bookmarks', 'bookmark_collections', 'journey_items');

-- 验证
SELECT 'posts' as table_name, COUNT(*) as count FROM posts
UNION ALL
SELECT 'view_counts', COUNT(*) FROM view_counts
UNION ALL
SELECT 'bookmarks', COUNT(*) FROM bookmarks
UNION ALL
SELECT 'bookmark_collections', COUNT(*) FROM bookmark_collections
UNION ALL
SELECT 'journey_items', COUNT(*) FROM journey_items;
