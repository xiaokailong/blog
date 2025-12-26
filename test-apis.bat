@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo API 接口测试
echo ==========================================
echo.

set PORT=3001
set BASE_URL=http://localhost:%PORT%

echo 正在测试API接口...
echo 服务器地址: %BASE_URL%
echo.

echo [1/6] 测试 /api/stats (网站统计)
echo ----------------------------------------
curl -s "%BASE_URL%/api/stats" | jq . 2>nul
if !errorlevel! neq 0 (
    curl -s "%BASE_URL%/api/stats"
)
echo.
echo.

echo [2/6] 测试 /api/stats/like (点赞功能)
echo ----------------------------------------
curl -s -X POST "%BASE_URL%/api/stats/like" -H "Content-Type: application/json" | jq . 2>nul
if !errorlevel! neq 0 (
    curl -s -X POST "%BASE_URL%/api/stats/like" -H "Content-Type: application/json"
)
echo.
echo.

echo [3/6] 测试 /api/posts (文章列表)
echo ----------------------------------------
curl -s "%BASE_URL%/api/posts" | jq . 2>nul
if !errorlevel! neq 0 (
    curl -s "%BASE_URL%/api/posts"
)
echo.
echo.

echo [4/6] 测试 /api/test-db (数据库连接)
echo ----------------------------------------
curl -s "%BASE_URL%/api/test-db" | jq . 2>nul
if !errorlevel! neq 0 (
    curl -s "%BASE_URL%/api/test-db"
)
echo.
echo.

echo [5/6] 测试 /api/view-counts (浏览统计)
echo ----------------------------------------
curl -s "%BASE_URL%/api/view-counts" | jq . 2>nul
if !errorlevel! neq 0 (
    curl -s "%BASE_URL%/api/view-counts"
)
echo.
echo.

echo [6/6] 测试 /api/bookmarks (书签)
echo ----------------------------------------
curl -s "%BASE_URL%/api/bookmarks" | jq . 2>nul
if !errorlevel! neq 0 (
    curl -s "%BASE_URL%/api/bookmarks"
)
echo.
echo.

echo ==========================================
echo 测试完成
echo ==========================================
echo.
echo 请检查以上输出，确认没有错误
echo.
echo 如果看到 "success": true，说明接口正常
echo 如果看到错误信息，请检查数据库连接
echo.
pause
