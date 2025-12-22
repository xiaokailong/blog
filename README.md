# blog.velen.fun

🎉 **Database Migration Complete!** This blog has been migrated from multiple third-party services to **Cloudflare D1**.

## ✅ Current Status

- ✅ **Database Initialized**: 5 tables created
- ✅ **Test Data Loaded**: 2 posts, 4 bookmark collections
- ✅ **All APIs Working**: No external dependencies
- ✅ **Ready for Production**: Deploy to Cloudflare Pages

## Overview

- `/` — Home page
- `/[slug]` — Static pre-rendered pages using **D1 Database**
- `/writing` — Writing page
- `/writing/[slug]` — Static pre-rendered writing pages using **D1 Database**
- `/journey` — Journey page
- `/workspace` — Workspace page
- `/bookmarks` — Bookmarks page
- `/bookmarks/[slug]` — Static pre-rendered bookmarks pages using **D1 Database**
- `/bookmarks.xml` — Bookmarks XML feed
- `/api` — API routes

## 🚀 Quick Start

### Prerequisites

Before running locally, you need to configure Cloudflare credentials:

1. **Get Cloudflare Account ID**:
   - Visit https://dash.cloudflare.com/
   - Click your profile > Account Home
   - Copy your Account ID

2. **Create API Token**:
   - Visit https://dash.cloudflare.com/profile/api-tokens
   - Create token with D1 permissions (Read + Edit)

3. **Configure Environment**:
   ```bash
   # Copy example env file
   cp .env.example .env.local
   
   # Edit .env.local and fill in:
   CLOUDFLARE_ACCOUNT_ID=your_account_id_here
   CLOUDFLARE_API_TOKEN=your_api_token_here
   ```

📖 **Need help?** See [docs/ENV_SETUP.md](docs/ENV_SETUP.md) for detailed instructions.

### Running Locally

```bash
# Clone and install
git clone https://github.com/xiaokailong/blog.git
cd blog
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000

### Database Management

```bash
# View posts
npm run db:query "SELECT title, slug FROM posts"

# View bookmark collections
npm run db:query "SELECT name, slug FROM bookmark_collections"

# Open D1 console
npm run db:console
```

## 📁 Documentation

All documentation is in the `docs/` folder:

- 📖 [START_HERE.md](docs/START_HERE.md) - Quick start guide
- 🗄️ [docs/README.md](docs/README.md) - Database migration documentation
- ⚙️ [SETUP_COMPLETE.md](docs/SETUP_COMPLETE.md) - Complete setup guide
- 🚀 [QUICKSTART.md](docs/QUICKSTART.md) - 3-step quick start
- 🎛️ [ADMIN.md](docs/ADMIN.md) - Admin panel documentation

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - **Database** (NEW!)
- [Cloudflare Pages](https://pages.cloudflare.com/) - Hosting

### Migrated Services

| Service | Previous | Now |
|---------|----------|-----|
| CMS | Contentful | ✅ D1 Database |
| Analytics | Supabase | ✅ D1 Database |
| Bookmarks | Raindrop.io | ✅ D1 Database |
| Submissions | Airtable | ✅ D1 Database |
| Analytics | Tinybird | ✅ Removed |

## 🎯 Next Steps

1. **Test Locally**: `npm run dev`
2. **Import Real Data**: Replace test data with your content
3. **Deploy**: Push to GitHub → Auto-deploy to Cloudflare Pages

See [docs/SETUP_COMPLETE.md](docs/SETUP_COMPLETE.md) for deployment guide.

## Repo Activity

![Alt](https://repobeats.axiom.co/api/embed/2d43636ebc156829d3e99c6f8c2b68d5aa6ebf93.svg 'Repobeats analytics image')

## License
