# Cloudflare D1 数据库初始化脚本
# 需要用户提供API Token

param(
    [string]$ApiToken = $env:CLOUDFLARE_API_TOKEN
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Cloudflare D1 数据库初始化向导" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查API Token
if (-not $ApiToken -or $ApiToken -eq "your_api_token_here") {
    Write-Host "⚠️  未检测到有效的 API Token" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请按以下步骤操作:" -ForegroundColor White
    Write-Host "1. 访问: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor White
    Write-Host "2. 点击 'Create Token'" -ForegroundColor White
    Write-Host "3. 选择 'Create Custom Token'" -ForegroundColor White
    Write-Host "4. 配置权限:" -ForegroundColor White
    Write-Host "   - Account > D1 > Edit" -ForegroundColor White
    Write-Host "   - Account > Account Settings > Read" -ForegroundColor White
    Write-Host "5. 创建并复制Token" -ForegroundColor White
    Write-Host ""
    
    $token = Read-Host "请粘贴你的 API Token"
    
    if (-not $token) {
        Write-Host "❌ 未提供Token，退出" -ForegroundColor Red
        exit 1
    }
    
    $ApiToken = $token
}

Write-Host "✅ API Token 已配置" -ForegroundColor Green
Write-Host ""

# 显示配置信息
Write-Host "配置信息:" -ForegroundColor Cyan
Write-Host "  账号ID: 24c17bbd73ff03387abaa5960296320d" -ForegroundColor White
Write-Host "  数据库ID: 3dd242d5-f86b-4acb-83e8-04945a47a525" -ForegroundColor White
Write-Host "  数据库名: blog-db" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "确认开始初始化? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "已取消" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "开始初始化..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 设置SSL绕过
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"

# 方式1: 尝试使用Node.js脚本
Write-Host "[方式1] 使用Node.js直接初始化..." -ForegroundColor Yellow
if (Test-Path "init-db-direct.js") {
    try {
        node init-db-direct.js $ApiToken
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ 初始化成功！" -ForegroundColor Green
            Write-Host ""
            Write-Host "下一步:" -ForegroundColor Cyan
            Write-Host "1. 运行: .\check-database.bat 验证所有表" -ForegroundColor White
            Write-Host "2. 启动开发服务器: npm run dev" -ForegroundColor White
            Write-Host "3. 访问 http://localhost:3000 测试" -ForegroundColor White
            exit 0
        }
    } catch {
        Write-Host "❌ Node.js初始化失败，尝试其他方式..." -ForegroundColor Red
    }
}

# 方式2: 尝试使用wrangler
Write-Host ""
Write-Host "[方式2] 使用wrangler命令行工具..." -ForegroundColor Yellow

# 临时设置API Token
$env:CLOUDFLARE_API_TOKEN = $ApiToken

# 尝试执行
$maxRetries = 5
for ($i = 1; $i -le $maxRetries; $i++) {
    Write-Host ""
    Write-Host "尝试 $i / $maxRetries ..." -ForegroundColor Cyan
    
    try {
        npx wrangler d1 execute blog-db --file=./db/complete-init.sql --remote
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ 初始化成功！" -ForegroundColor Green
            
            # 验证
            Write-Host ""
            Write-Host "验证表创建..." -ForegroundColor Cyan
            npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;" --remote
            
            Write-Host ""
            Write-Host "下一步:" -ForegroundColor Cyan
            Write-Host "1. 运行: .\check-database.bat 验证所有表" -ForegroundColor White
            Write-Host "2. 启动开发服务器: npm run dev" -ForegroundColor White
            Write-Host "3. 访问 http://localhost:3000 测试" -ForegroundColor White
            exit 0
        }
    } catch {
        Write-Host "❌ 尝试失败: $_" -ForegroundColor Red
    }
    
    if ($i -lt $maxRetries) {
        Write-Host "⏳ 等待 $i 秒后重试..." -ForegroundColor Yellow
        Start-Sleep -Seconds $i
    }
}

Write-Host ""
Write-Host "❌ 所有尝试均失败" -ForegroundColor Red
Write-Host ""
Write-Host "请尝试以下手动方式:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 确保已登录:" -ForegroundColor White
Write-Host "   npx wrangler login" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 手动执行SQL文件:" -ForegroundColor White
Write-Host "   npx wrangler d1 execute blog-db --file=./db/complete-init.sql --remote" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 或访问Cloudflare Dashboard手动创建表:" -ForegroundColor White
Write-Host "   https://dash.cloudflare.com/24c17bbd73ff03387abaa5960296320d/workers/d1" -ForegroundColor Gray
Write-Host ""

Read-Host "按Enter键退出"
