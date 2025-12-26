# Tech Stack Page 技术栈页面

## 功能特性

### 🎨 精美卡片设计
- **卡片布局**：响应式网格布局，支持 2/3/4 列自适应
- **动画效果**：使用 Framer Motion 实现入场动画和悬停效果
- **视觉设计**：现代化的卡片设计，带有图标、分类标签和外部链接图标

### 🔍 分类筛选
- **多种分类**：Framework、Styling、Language、Build Tool、Deployment等12个分类
- **实时筛选**：点击分类按钮即时过滤显示内容
- **分类统计**：显示当前筛选结果数量

### 📦 技术网站内容 (20个)

#### 框架类 (Framework)
1. **React** - 用于构建用户界面的JavaScript库
2. **Next.js** - 生产级React框架，支持服务端渲染
3. **Vue.js** - 渐进式JavaScript框架
4. **Angular** - 构建移动和桌面应用的平台
5. **Svelte** - 真正响应式的框架

#### 样式工具 (Styling)
6. **Tailwind CSS** - 实用优先的CSS框架

#### 语言 (Language)
7. **TypeScript** - 带类型的JavaScript

#### 构建工具 (Build Tool)
8. **Vite** - 下一代前端工具

#### 部署 (Deployment)
9. **Vercel** - 前端开发者平台
10. **Cloudflare** - 全球网络平台

#### 文档与学习 (Documentation & Learning)
11. **MDN Web Docs** - Web技术文档
12. **CSS-Tricks** - CSS/HTML/JavaScript文章

#### 开发工具 (Development)
13. **GitHub** - 代码协作平台
14. **npm** - JavaScript包管理器

#### 社区 (Community)
15. **Stack Overflow** - 程序员社区

#### 设计工具 (Design)
16. **Figma** - 协作界面设计工具

#### 动画库 (Animation)
17. **Framer Motion** - React动画库

#### UI组件库 (UI Library)
18. **Radix UI** - 无样式、可访问的组件
19. **Shadcn/ui** - 基于Radix UI的漂亮组件

#### 工具 (Tool)
20. **Can I Use** - 浏览器兼容性查询

## 文件结构

```
src/
├── app/stack/
│   ├── page.tsx                 # 主页面（Server Component）
│   └── opengraph-image.tsx      # Open Graph 图片
├── components/common/
│   ├── tech-card.tsx            # 技术卡片组件
│   └── stack-page-client.tsx   # 客户端交互组件
└── lib/
    └── tech-stack.ts            # 技术栈数据
```

## 使用方式

### 访问页面
访问 `/stack` 路径即可查看技术栈页面

### 自定义内容
编辑 `src/lib/tech-stack.ts` 文件，修改 `TECH_STACK_ITEMS` 数组：

```typescript
{
  name: '技术名称',
  description: '技术描述',
  icon: '🎨',  // 使用 emoji 作为图标
  url: 'https://example.com',
  category: 'Framework'  // 分类
}
```

### 添加新分类
在 `src/components/common/stack-page-client.tsx` 的 `categories` 数组中添加新分类名称

## 技术实现

- **React Server Components** - 页面主体
- **Client Components** - 交互功能（筛选、动画）
- **Framer Motion** - 动画效果
- **Tailwind CSS** - 样式设计
- **Lucide React** - 图标库
- **TypeScript** - 类型安全

## 特色功能

1. ✨ **流畅动画**：卡片入场动画，每个卡片延迟0.05秒依次出现
2. 🎯 **悬停效果**：卡片悬停时上移4px，显示外部链接图标
3. 🏷️ **分类标签**：每个卡片右上角显示分类
4. 🔗 **新标签打开**：所有链接在新标签页中打开
5. 📱 **响应式设计**：移动端、平板、桌面端完美适配

## 扩展建议

如果需要添加更多功能，可以考虑：
- 搜索功能
- 收藏功能
- 排序功能（按名称、分类等）
- 添加更详细的技术信息（使用年限、熟练度等）
- 集成真实的Logo图片
