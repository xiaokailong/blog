@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo Cloudflare D1 数据库初始化脚本
echo ==========================================
echo.

set MAX_RETRIES=5
set RETRY_COUNT=0
set SUCCESS=0

:RETRY_LOOP
if !RETRY_COUNT! GEQ !MAX_RETRIES! (
    echo.
    echo [错误] 已达到最大重试次数 !MAX_RETRIES!
    echo 请检查您的网络连接和Cloudflare凭据
    pause
    exit /b 1
)

set /a RETRY_COUNT+=1
echo.
echo ==========================================
echo 尝试 !RETRY_COUNT! / !MAX_RETRIES!
echo ==========================================

echo.
echo [步骤 1/6] 检查 wrangler 是否已安装...
where wrangler >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] wrangler 未安装，尝试安装...
    call npm install -g wrangler
    if !errorlevel! neq 0 (
        echo [错误] wrangler 安装失败
        timeout /t 3 >nul
        goto RETRY_LOOP
    )
)
echo [成功] wrangler 已就绪

echo.
echo [步骤 2/6] 检查数据库连接...
call npx wrangler d1 list
if !errorlevel! neq 0 (
    echo [警告] 无法连接到 Cloudflare，请确认您已登录
    echo 如果需要登录，请运行: npx wrangler login
    timeout /t 5 >nul
    goto RETRY_LOOP
)
echo [成功] 数据库连接正常

echo.
echo [步骤 3/6] 查看现有表...
call npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;" --remote
if !errorlevel! neq 0 (
    echo [警告] 无法查询表，继续尝试...
    timeout /t 2 >nul
)

echo.
echo [步骤 4/6] 执行完整数据库初始化...
call npx wrangler d1 execute blog-db --file=./db/complete-init.sql --remote
if !errorlevel! neq 0 (
    echo [错误] 数据库初始化失败
    timeout /t 3 >nul
    goto RETRY_LOOP
)
echo [成功] 数据库初始化完成

echo.
echo [步骤 5/6] 验证表创建...
call npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;" --remote
if !errorlevel! neq 0 (
    echo [警告] 无法验证表创建
) else (
    echo [成功] 表验证完成
)

echo.
echo [步骤 6/6] 检查表数量...
call npx wrangler d1 execute blog-db --command="SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';" --remote
if !errorlevel! neq 0 (
    echo [警告] 无法统计表数量
    timeout /t 2 >nul
    goto RETRY_LOOP
)

set SUCCESS=1
goto END

:END
echo.
echo ==========================================
if !SUCCESS! EQU 1 (
    echo [完成] 数据库初始化成功！
    echo 共尝试 !RETRY_COUNT! 次
    echo.
    echo 已创建以下表:
    echo - posts ^(文章^)
    echo - view_counts ^(浏览量^)
    echo - bookmarks ^(书签^)
    echo - bookmark_collections ^(书签集合^)
    echo - journey_items ^(旅程项^)
    echo - page_views ^(页面访问记录^)
    echo - site_likes ^(网站点赞^)
) else (
    echo [失败] 数据库初始化失败
)
echo ==========================================
echo.
pause
