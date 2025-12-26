@echo off
echo ==========================================
echo 数据库初始化 - 交互式向导
echo ==========================================
echo.
echo 此脚本将帮助您初始化Cloudflare D1数据库
echo 需要的权限: D1 Edit 权限
echo.

echo [准备工作]
echo 1. 确保已安装 wrangler: npm install -g wrangler
echo 2. 确保已登录 Cloudflare
echo.

echo 请选择认证方式:
echo [1] 使用 OAuth 登录 (推荐)
echo [2] 使用 API Token
echo [3] 跳过登录，直接执行
echo.
set /p auth_choice="请输入选择 (1/2/3): "

if "%auth_choice%"=="1" (
    echo.
    echo 正在使用 OAuth 登录...
    echo 注意: 如果环境变量中有 CLOUDFLARE_API_TOKEN，请先删除它
    echo.
    pause
    call npx wrangler login
    if %errorlevel% neq 0 (
        echo [错误] 登录失败
        pause
        exit /b 1
    )
)

if "%auth_choice%"=="2" (
    echo.
    echo 请访问: https://dash.cloudflare.com/profile/api-tokens
    echo 创建一个新的API Token，权限设置:
    echo   - Account: D1: Edit
    echo   - Account: Account Settings: Read
    echo.
    echo 然后在 .env.local 文件中更新 CLOUDFLARE_API_TOKEN
    echo.
    pause
)

echo.
echo ==========================================
echo 开始初始化数据库
echo ==========================================
echo.

set /p confirm="确认开始执行吗? (Y/N): "
if /i not "%confirm%"=="Y" (
    echo 已取消
    pause
    exit /b 0
)

echo.
echo [1/5] 检查数据库连接...
call npx wrangler d1 list
if %errorlevel% neq 0 (
    echo [错误] 无法连接到数据库
    echo 请检查登录状态: npx wrangler whoami
    pause
    exit /b 1
)

echo.
echo [2/5] 查看现有表...
call npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote

echo.
echo [3/5] 执行数据库初始化...
call npx wrangler d1 execute blog-db --file=./db/complete-init.sql --remote
if %errorlevel% neq 0 (
    echo [错误] 初始化失败
    echo.
    echo 可能的原因:
    echo 1. API Token权限不足
    echo 2. 网络连接问题
    echo 3. 数据库ID不正确
    echo.
    pause
    exit /b 1
)

echo.
echo [4/5] 验证表创建...
call npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;" --remote

echo.
echo [5/5] 统计表数量...
call npx wrangler d1 execute blog-db --command="SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';" --remote

echo.
echo ==========================================
echo 初始化完成！
echo ==========================================
echo.
echo 下一步:
echo 1. 运行 check-database.bat 验证所有表
echo 2. 启动开发服务器: npm run dev
echo 3. 访问 http://localhost:3000 测试
echo.
pause
