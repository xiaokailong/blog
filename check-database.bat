@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo 数据库状态检查
echo ==========================================
echo.

echo 正在查询所有表...
call npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;" --remote

echo.
echo 正在统计各表记录数...
echo.

echo [posts 表]
call npx wrangler d1 execute blog-db --command="SELECT COUNT(*) as count FROM posts;" --remote

echo.
echo [view_counts 表]
call npx wrangler d1 execute blog-db --command="SELECT COUNT(*) as count FROM view_counts;" --remote

echo.
echo [bookmarks 表]
call npx wrangler d1 execute blog-db --command="SELECT COUNT(*) as count FROM bookmarks;" --remote

echo.
echo [bookmark_collections 表]
call npx wrangler d1 execute blog-db --command="SELECT COUNT(*) as count FROM bookmark_collections;" --remote

echo.
echo [journey_items 表]
call npx wrangler d1 execute blog-db --command="SELECT COUNT(*) as count FROM journey_items;" --remote

echo.
echo [page_views 表]
call npx wrangler d1 execute blog-db --command="SELECT COUNT(*) as count FROM page_views;" --remote

echo.
echo [site_likes 表]
call npx wrangler d1 execute blog-db --command="SELECT COUNT(*) as count FROM site_likes;" --remote

echo.
echo ==========================================
echo 检查完成
echo ==========================================
pause
