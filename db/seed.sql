-- Cloudflare D1 测试数据
-- 插入测试文章

INSERT INTO posts (title, slug, content, excerpt, date, first_published_at, published_at, is_draft, tags) VALUES
(
  'Welcome to My Blog',
  'welcome-to-my-blog',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"这是我的第一篇博客文章。欢迎来到我的个人博客！"}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"关于这个博客"}]},{"type":"paragraph","content":[{"type":"text","text":"这里我会分享关于编程、技术和生活的各种想法。"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"主要内容包括:"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"前端开发技术"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"后端开发经验"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"开源项目分享"}]}]}]}]}',
  '这是我的第一篇博客文章。欢迎来到我的个人博客！',
  '2024-01-15',
  '2024-01-15T08:00:00.000Z',
  '2024-01-15T08:00:00.000Z',
  0,
  '["博客", "欢迎"]'
),
(
  'Getting Started with Next.js and Cloudflare',
  'getting-started-nextjs-cloudflare',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"在本文中，我将分享如何使用 Next.js 和 Cloudflare D1 数据库构建现代化的博客系统。"}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"为什么选择 Cloudflare D1?"}]},{"type":"paragraph","content":[{"type":"text","text":"Cloudflare D1 是一个基于 SQLite 的分布式数据库，具有以下优势："}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"全球边缘网络部署"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"低延迟访问"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"免费额度充足"}]}]}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"技术栈"}]},{"type":"paragraph","content":[{"type":"text","text":"Next.js 15, TypeScript, Tailwind CSS, Cloudflare D1"}]}]}',
  '在本文中，我将分享如何使用 Next.js 和 Cloudflare D1 数据库构建现代化的博客系统。',
  '2024-12-20',
  '2024-12-20T10:30:00.000Z',
  '2024-12-20T10:30:00.000Z',
  0,
  '["Next.js", "Cloudflare", "教程"]'
);

-- 插入测试浏览量数据
INSERT INTO view_counts (slug, view_count) VALUES
('welcome-to-my-blog', 156),
('getting-started-nextjs-cloudflare', 89);

-- 插入测试书签集合
INSERT INTO bookmark_collections (name, slug, description, icon, color, count) VALUES
('前端开发', 'frontend', '前端开发相关的优质资源', '🎨', '#3B82F6', 0),
('后端技术', 'backend', '后端开发和架构相关资源', '⚙️', '#10B981', 0),
('设计工具', 'design', '设计和UI/UX相关工具', '✨', '#F59E0B', 0),
('学习资源', 'learning', '编程学习和教程资源', '📚', '#8B5CF6', 0);

-- 插入测试书签
INSERT INTO bookmarks (url, title, description, email, type, status, collection_id, date) VALUES
(
  'https://nextjs.org',
  'Next.js Official Documentation',
  'The React Framework for Production',
  'test@example.com',
  'Documentation',
  'approved',
  1,
  '2024-12-15T00:00:00.000Z'
),
(
  'https://tailwindcss.com',
  'Tailwind CSS',
  'A utility-first CSS framework',
  'test@example.com',
  'Tool',
  'approved',
  1,
  '2024-12-16T00:00:00.000Z'
);

-- 更新书签集合计数
UPDATE bookmark_collections SET count = 2 WHERE slug = 'frontend';

-- 插入旅程/时间线数据（可选）
INSERT INTO journey_items (title, description, date, year, type, icon, link) VALUES
(
  '开始学习编程',
  '开始接触前端开发，学习HTML, CSS, JavaScript',
  '2020-03-15',
  2020,
  'education',
  '🎓',
  NULL
),
(
  '第一份开发工作',
  '加入科技公司担任前端工程师',
  '2021-06-01',
  2021,
  'work',
  '💼',
  NULL
),
(
  '创建个人博客',
  '使用Next.js和Cloudflare构建个人博客',
  '2024-12-22',
  2024,
  'achievement',
  '🎉',
  'https://myblog.com'
);
