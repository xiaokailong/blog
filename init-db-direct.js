const https = require('https');

// Cloudflare 配置
const ACCOUNT_ID = '24c17bbd73ff03387abaa5960296320d';
const DATABASE_ID = '3dd242d5-f86b-4acb-83e8-04945a47a525';

// 从命令行参数或环境变量获取API Token
const API_TOKEN = process.argv[2] || process.env.CLOUDFLARE_API_TOKEN;

if (!API_TOKEN || API_TOKEN === 'your_api_token_here') {
  console.error('❌ 错误: 需要提供有效的 Cloudflare API Token');
  console.log('\n使用方法:');
  console.log('  node init-db-direct.js YOUR_API_TOKEN');
  console.log('\n或设置环境变量:');
  console.log('  $env:CLOUDFLARE_API_TOKEN="YOUR_API_TOKEN"');
  console.log('  node init-db-direct.js');
  console.log('\n获取API Token:');
  console.log('  https://dash.cloudflare.com/profile/api-tokens');
  process.exit(1);
}

// 创建不验证SSL证书的agent
const agent = new https.Agent({
  rejectUnauthorized: false
});

// 数据库初始化SQL（分成多个语句）
const SQL_STATEMENTS = [
  // posts 表
  `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    date TEXT NOT NULL,
    first_published_at TEXT NOT NULL,
    published_at TEXT NOT NULL,
    is_draft INTEGER DEFAULT 0,
    tags TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  'CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)',
  'CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC)',
  'CREATE INDEX IF NOT EXISTS idx_posts_is_draft ON posts(is_draft)',
  
  // view_counts 表
  `CREATE TABLE IF NOT EXISTS view_counts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    view_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  'CREATE INDEX IF NOT EXISTS idx_view_counts_slug ON view_counts(slug)',
  
  // bookmarks 表
  `CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    email TEXT,
    type TEXT DEFAULT "Other",
    status TEXT DEFAULT "pending",
    collection_id INTEGER,
    date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  'CREATE INDEX IF NOT EXISTS idx_bookmarks_status ON bookmarks(status)',
  'CREATE INDEX IF NOT EXISTS idx_bookmarks_collection_id ON bookmarks(collection_id)',
  
  // bookmark_collections 表
  `CREATE TABLE IF NOT EXISTS bookmark_collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  'CREATE INDEX IF NOT EXISTS idx_bookmark_collections_slug ON bookmark_collections(slug)',
  
  // journey_items 表
  `CREATE TABLE IF NOT EXISTS journey_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    year INTEGER NOT NULL,
    type TEXT,
    icon TEXT,
    link TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  'CREATE INDEX IF NOT EXISTS idx_journey_year ON journey_items(year DESC)',
  'CREATE INDEX IF NOT EXISTS idx_journey_date ON journey_items(date DESC)',
  
  // page_views 表
  `CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    page TEXT NOT NULL,
    visited_at TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(ip_address, page)
  )`,
  'CREATE INDEX IF NOT EXISTS idx_page_views_ip ON page_views(ip_address)',
  'CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page)',
  'CREATE INDEX IF NOT EXISTS idx_page_views_visited_at ON page_views(visited_at DESC)',
  
  // site_likes 表
  `CREATE TABLE IF NOT EXISTS site_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    liked_at TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  'CREATE INDEX IF NOT EXISTS idx_site_likes_ip ON site_likes(ip_address)',
  'CREATE INDEX IF NOT EXISTS idx_site_likes_liked_at ON site_likes(liked_at DESC)'
];

// 执行SQL语句
async function executeSQL(sql, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`\n🔄 执行SQL (尝试 ${attempt}/${retries})...`);
      
      const data = JSON.stringify({ sql });
      
      const options = {
        hostname: 'api.cloudflare.com',
        path: `/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
          'Content-Length': data.length
        },
        agent: agent
      };

      const response = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => {
            try {
              resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
            } catch (e) {
              reject(new Error(`解析响应失败: ${body}`));
            }
          });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
      });

      if (response.statusCode === 200 && response.body.success) {
        console.log('✅ 成功');
        return response.body;
      } else {
        console.error('❌ 失败:', response.body);
        if (attempt < retries) {
          console.log(`⏳ ${attempt}秒后重试...`);
          await new Promise(r => setTimeout(r, attempt * 1000));
          continue;
        }
        throw new Error(JSON.stringify(response.body));
      }
    } catch (error) {
      console.error(`❌ 错误:`, error.message);
      if (attempt < retries) {
        console.log(`⏳ ${attempt}秒后重试...`);
        await new Promise(r => setTimeout(r, attempt * 1000));
        continue;
      }
      throw error;
    }
  }
}

// 主函数
async function main() {
  console.log('==========================================');
  console.log('Cloudflare D1 数据库直接初始化');
  console.log('==========================================');
  console.log(`账号ID: ${ACCOUNT_ID}`);
  console.log(`数据库ID: ${DATABASE_ID}`);
  console.log(`API Token: ${API_TOKEN.substring(0, 10)}...`);
  console.log('==========================================\n');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < SQL_STATEMENTS.length; i++) {
    const sql = SQL_STATEMENTS[i];
    console.log(`\n[${i + 1}/${SQL_STATEMENTS.length}] ${sql.substring(0, 60)}...`);
    
    try {
      await executeSQL(sql);
      successCount++;
    } catch (error) {
      console.error(`❌ 执行失败: ${error.message}`);
      failCount++;
      // 继续执行其他语句
    }
  }

  console.log('\n==========================================');
  console.log('初始化完成');
  console.log('==========================================');
  console.log(`✅ 成功: ${successCount}`);
  console.log(`❌ 失败: ${failCount}`);
  console.log(`📊 总计: ${SQL_STATEMENTS.length}`);
  
  // 查询所有表
  console.log('\n查询所有表...');
  try {
    const result = await executeSQL("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    console.log('\n📋 已创建的表:');
    if (result.result && result.result[0] && result.result[0].results) {
      result.result[0].results.forEach(row => {
        console.log(`  - ${row.name}`);
      });
    }
  } catch (error) {
    console.error('查询表失败:', error.message);
  }
  
  console.log('\n✨ 所有操作完成！');
}

main().catch(console.error);
