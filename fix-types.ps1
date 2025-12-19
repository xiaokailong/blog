$files = Get-ChildItem -Path "C:\Personal Project\blog\src\components" -Recurse -Filter "*.tsx"

foreach ($file in $files) {
    $content = Get-Content -Raw $file.FullName
    
    # 匹配各种模式并添加类型
    $patterns = @(
        @{ Pattern = '= memo\(\(\{([^}]+)\}\) =>'; Replacement = '= memo(({$1}: any) =>' },
        @{ Pattern = 'function (\w+)\(\{([^}]+)\}\) \{'; Replacement = 'function $1({$2}: any) {' },
        @{ Pattern = 'export const (\w+) = \(\{([^}]+)\}\) =>'; Replacement = 'export const $1 = ({$2}: any) =>' },
        @{ Pattern = 'export function (\w+)\(\{([^}]+)\}\) \{'; Replacement = 'export function $1({$2}: any) {' },
        @{ Pattern = 'const (\w+) = \(\{([^}]+)\}\) =>'; Replacement = 'const $1 = ({$2}: any) =>' }
    )
    
    $modified = $false
    foreach ($p in $patterns) {
        if ($content -match $p.Pattern) {
            $content = $content -replace $p.Pattern, $p.Replacement
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Modified: $($file.Name)"
    }
}
