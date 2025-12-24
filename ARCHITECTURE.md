# Architecture Documentation

System architecture for the BeyondChats Content Optimization Platform.

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BEYONDCHATS PLATFORM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │   React      │    │   Laravel    │    │   Node.js    │                  │
│  │   Frontend   │◀──▶│   API        │◀──▶│   Optimizer  │                  │
│  │   (Display)  │    │   (CRUD)     │    │   (AI)       │                  │
│  └──────────────┘    └──────┬───────┘    └──────┬───────┘                  │
│                             │                    │                          │
│                             ▼                    ▼                          │
│                      ┌──────────────┐    ┌──────────────┐                  │
│                      │   MySQL      │    │  External    │                  │
│                      │   Database   │    │  APIs        │                  │
│                      └──────────────┘    └──────────────┘                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### 1. Laravel API (Backend)

```
laravel-api/
├── app/
│   ├── Console/
│   │   └── Commands/
│   │       └── ScrapeArticles.php    # Artisan command for scraping
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── ArticleController.php # CRUD operations
│   │   │
│   │   ├── Requests/
│   │   │   ├── StoreArticleRequest.php
│   │   │   └── UpdateArticleRequest.php
│   │   │
│   │   └── Resources/
│   │       └── ArticleResource.php   # API response formatting
│   │
│   └── Models/
│       └── Article.php               # Eloquent model
│
├── database/
│   └── migrations/
│       └── create_articles_table.php
│
└── routes/
    └── api.php                       # API routes
```

#### Data Flow
```
HTTP Request → Route → Controller → Model → Database
                                          ↓
HTTP Response ← Resource ← Controller ←───┘
```

#### Database Schema
```sql
articles
├── id (bigint, primary key, auto-increment)
├── title (varchar 255)
├── content (longtext)
├── original_url (varchar 255, unique)
├── published_at (timestamp, nullable, indexed)
├── author (varchar 255, nullable)
├── is_updated (boolean, default false, indexed)
├── optimized_content (longtext, nullable)
├── references (json, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)
```

---

### 2. Node.js Optimizer

```
nodejs-optimizer/
└── src/
    ├── index.js           # Main entry point & orchestration
    ├── config.js          # Environment configuration
    ├── laravelClient.js   # Laravel API HTTP client
    ├── googleSearch.js    # SerpAPI integration
    ├── contentScraper.js  # Web page scraping
    └── llmOptimizer.js    # OpenAI GPT integration
```

#### Optimization Pipeline
```
┌─────────────────────────────────────────────────────────────────┐
│                    OPTIMIZATION WORKFLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: Fetch Article                                          │
│  ┌──────────────┐    ┌──────────────┐                          │
│  │ Laravel API  │───▶│ Get Latest   │                          │
│  │ GET /articles│    │ Article      │                          │
│  └──────────────┘    └──────┬───────┘                          │
│                             │                                    │
│  Step 2: Search Competitors │                                    │
│                             ▼                                    │
│  ┌──────────────┐    ┌──────────────┐                          │
│  │ SerpAPI      │───▶│ Top 2        │                          │
│  │ Google Search│    │ Results      │                          │
│  └──────────────┘    └──────┬───────┘                          │
│                             │                                    │
│  Step 3: Scrape Content     │                                    │
│                             ▼                                    │
│  ┌──────────────┐    ┌──────────────┐                          │
│  │ Cheerio      │───▶│ Extract      │                          │
│  │ HTML Parser  │    │ Body Text    │                          │
│  └──────────────┘    └──────┬───────┘                          │
│                             │                                    │
│  Step 4: AI Optimization    │                                    │
│                             ▼                                    │
│  ┌──────────────┐    ┌──────────────┐                          │
│  │ OpenAI GPT-4 │───▶│ Rewrite      │                          │
│  │ API          │    │ Content      │                          │
│  └──────────────┘    └──────┬───────┘                          │
│                             │                                    │
│  Step 5: Update Database    │                                    │
│                             ▼                                    │
│  ┌──────────────┐    ┌──────────────┐                          │
│  │ Laravel API  │◀───│ PUT /articles│                          │
│  │ Database     │    │ /{id}        │                          │
│  └──────────────┘    └──────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### LLM Prompt Structure
```
You are a content optimization expert.

Original Article:
Title: {{title}}
Content: {{content}}

Reference Articles:
1. {{competitor_title_1}}
{{competitor_content_1}}

2. {{competitor_title_2}}
{{competitor_content_2}}

Task:
- Rewrite the original article
- Preserve core meaning
- Match SEO depth & structure
- Improve readability
- Use proper headings
- Maintain professional tone

Return markdown only.
```

---

### 3. React Frontend

```
react-frontend/
└── src/
    ├── components/
    │   ├── Layout.jsx           # Main layout wrapper
    │   ├── Header.jsx           # Navigation header
    │   ├── Footer.jsx           # Site footer
    │   ├── ArticleCard.jsx      # Article preview card
    │   ├── ContentToggle.jsx    # Original/Optimized tabs
    │   ├── MarkdownRenderer.jsx # Markdown to HTML
    │   ├── ReferencesSection.jsx# Reference links
    │   ├── Pagination.jsx       # Page navigation
    │   ├── LoadingSkeleton.jsx  # Loading states
    │   └── ErrorState.jsx       # Error handling
    │
    ├── pages/
    │   ├── HomePage.jsx         # Article listing
    │   ├── ArticleDetailPage.jsx# Single article view
    │   └── NotFoundPage.jsx     # 404 page
    │
    ├── services/
    │   └── api.js               # Axios API client
    │
    ├── App.jsx                  # Routes & providers
    └── main.jsx                 # Entry point
```

#### Component Hierarchy
```
App
└── Layout
    ├── Header
    ├── Routes
    │   ├── HomePage
    │   │   ├── ArticleCard (multiple)
    │   │   ├── Pagination
    │   │   ├── LoadingSkeleton
    │   │   └── ErrorState
    │   │
    │   ├── ArticleDetailPage
    │   │   ├── ContentToggle
    │   │   ├── MarkdownRenderer
    │   │   └── ReferencesSection
    │   │
    │   └── NotFoundPage
    │
    └── Footer
```

#### State Management
```
HomePage State:
├── articles: Article[]      # List of articles
├── meta: PaginationMeta     # Pagination info
├── currentPage: number      # Current page
├── isLoading: boolean       # Loading state
└── error: string | null     # Error message

ArticleDetailPage State:
├── article: Article | null  # Single article
├── isLoading: boolean       # Loading state
├── error: string | null     # Error message
└── activeTab: 'original' | 'optimized'
```

---

## Data Models

### Article Model

```typescript
interface Article {
  id: number;
  title: string;
  content: string;
  original_url: string;
  published_at: string | null;
  author: string | null;
  is_updated: boolean;
  optimized_content: string | null;
  references: Reference[] | null;
  created_at: string;
  updated_at: string;
}

interface Reference {
  title: string;
  url: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
```

---

## API Communication

### Request Flow
```
Frontend                    Backend                     Database
   │                          │                            │
   │  GET /api/articles       │                            │
   │─────────────────────────▶│                            │
   │                          │  SELECT * FROM articles    │
   │                          │───────────────────────────▶│
   │                          │                            │
   │                          │◀───────────────────────────│
   │                          │  [rows]                    │
   │◀─────────────────────────│                            │
   │  { success, data, meta } │                            │
   │                          │                            │
```

### Error Handling Strategy
```
┌─────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING LAYERS                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: API Client (Axios)                                │
│  ├── Network errors → Retry logic                           │
│  ├── Timeout errors → User feedback                         │
│  └── HTTP errors → Extract message                          │
│                                                              │
│  Layer 2: Component State                                    │
│  ├── Loading states → Skeleton UI                           │
│  ├── Error states → ErrorState component                    │
│  └── Empty states → EmptyState component                    │
│                                                              │
│  Layer 3: Laravel Validation                                 │
│  ├── Form Request validation                                │
│  └── 422 response with field errors                         │
│                                                              │
│  Layer 4: Laravel Exception Handler                          │
│  ├── 404 Not Found                                          │
│  ├── 500 Server Error                                       │
│  └── Consistent JSON response format                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Considerations

### Environment Variables
```
✓ API keys stored in .env files
✓ .env files excluded from git
✓ .env.example provided for each project
✗ No secrets in code or commits
```

### CORS Configuration
```php
// Laravel CORS settings
'allowed_origins' => [
    'http://localhost:3000',
    'http://localhost:5173',
],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

### Input Validation
```php
// Laravel Form Request
'title' => 'required|string|max:255',
'content' => 'required|string',
'original_url' => 'required|url|unique:articles,original_url',
```

---

## Scalability Considerations

### Current Limitations
- Single article optimization (no batch processing)
- Synchronous optimization (blocking)
- In-memory caching only

### Future Scaling
```
┌─────────────────────────────────────────────────────────────┐
│                    SCALED ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                 │
│  │ Load    │───▶│ Laravel │───▶│ Redis   │                 │
│  │ Balancer│    │ App x N │    │ Cache   │                 │
│  └─────────┘    └─────────┘    └─────────┘                 │
│                      │                                       │
│                      ▼                                       │
│  ┌─────────────────────────────┐                            │
│  │     Queue (Redis/SQS)       │                            │
│  └─────────────┬───────────────┘                            │
│                │                                             │
│       ┌────────┴────────┐                                   │
│       ▼                 ▼                                   │
│  ┌─────────┐      ┌─────────┐                              │
│  │ Worker  │      │ Worker  │                              │
│  │ Node x N│      │ Node x N│                              │
│  └─────────┘      └─────────┘                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend Framework | Laravel | Robust ORM, built-in validation, easy API resources |
| Database | MySQL | Reliable, well-supported, fits data model |
| Optimizer Runtime | Node.js | Async I/O, good for API calls, JS ecosystem |
| AI Provider | OpenAI | Best quality output, reliable API |
| Search API | SerpAPI | Reliable Google results, simple API |
| Frontend Framework | React | Component-based, large ecosystem |
| Build Tool | Vite | Fast HMR, modern bundling |
| Styling | Tailwind | Utility-first, rapid development |
| Animations | Framer Motion | Declarative, performant |

---

## Deployment Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐                                        │
│  │   CDN           │  Static assets (React build)           │
│  │   (CloudFlare)  │                                        │
│  └────────┬────────┘                                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────┐                                        │
│  │   Web Server    │  Nginx / Apache                        │
│  │                 │                                        │
│  └────────┬────────┘                                        │
│           │                                                  │
│    ┌──────┴──────┐                                          │
│    ▼             ▼                                          │
│  ┌─────────┐  ┌─────────┐                                  │
│  │ Laravel │  │ Node.js │  (Cron job / Worker)             │
│  │ PHP-FPM │  │ Process │                                  │
│  └────┬────┘  └─────────┘                                  │
│       │                                                      │
│       ▼                                                      │
│  ┌─────────────────┐                                        │
│  │   MySQL         │  Managed database                      │
│  │   (RDS/Cloud)   │                                        │
│  └─────────────────┘                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
