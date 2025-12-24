# BeyondChats Technical Assessment

A full-stack content optimization system that scrapes blog articles, enhances them using AI with competitor insights, and displays both original and optimized versions.

## 🌐 Live Demo

**Frontend**: [https://beyond-chats-assignment-shoaib.vercel.app/](https://beyond-chats-assignment-shoaib.vercel.app/)

> Note: The live demo runs in demo mode with sample data. For full functionality with the Laravel API, run locally.

---

## 📋 Overview

This project is a **3-part monorepo** system:

1. **Laravel API** - Backend for web scraping and CRUD operations
2. **Node.js Optimizer** - AI-powered content enhancement script
3. **React Frontend** - Article display with original/optimized toggle

### How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  BeyondChats    │     │   Laravel API    │     │  React Frontend │
│     Blogs       │────▶│   (Database)     │◀────│   (Display)     │
└─────────────────┘     └────────┬─────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │  Node Optimizer  │
                        │  (AI + Search)   │
                        └──────────────────┘
```

## 🔄 Data Flow Architecture

```
                              ┌─────────────────────────────────────────┐
                              │           PHASE 1: DATA INGESTION       │
                              └─────────────────────────────────────────┘
                                               │
    ┌──────────────────────────────────────────┼──────────────────────────────────────────┐
    │                                          │                                          │
    │   ┌─────────────────┐            ┌───────▼───────┐            ┌─────────────────┐   │
    │   │   BeyondChats   │   scrape   │               │   store    │                 │   │
    │   │   Blog Posts    │───────────▶│  Goutte/DOM   │───────────▶│     MySQL       │   │
    │   │   (Source)      │            │   Crawler     │            │   Database      │   │
    │   └─────────────────┘            └───────────────┘            └────────┬────────┘   │
    │                                                                        │            │
    │   LARAVEL API (php artisan scrape:articles)                           │            │
    └───────────────────────────────────────────────────────────────────────┼────────────┘
                                                                            │
                              ┌─────────────────────────────────────────────┘
                              │
                              │
                              ▼
                              ┌─────────────────────────────────────────┐
                              │          PHASE 2: AI OPTIMIZATION       │
                              └─────────────────────────────────────────┘
                                               │
    ┌──────────────────────────────────────────┼──────────────────────────────────────────┐
    │                                          │                                          │
    │   ┌─────────────────┐            ┌───────▼───────┐            ┌─────────────────┐   │
    │   │   Laravel API   │   fetch    │               │   search   │    SerpAPI      │   │
    │   │   GET /articles │───────────▶│  Node.js      │───────────▶│  (Google)       │   │
    │   │   (latest)      │            │  Optimizer    │            │                 │   │
    │   └─────────────────┘            └───────┬───────┘            └────────┬────────┘   │
    │                                          │                             │            │
    │                                          │   ┌─────────────────────────┘            │
    │                                          │   │                                      │
    │                                          ▼   ▼                                      │
    │                                  ┌───────────────┐                                  │
    │                                  │   Cheerio     │  scrape competitor content       │
    │                                  │   (Parser)    │                                  │
    │                                  └───────┬───────┘                                  │
    │                                          │                                          │
    │                                          ▼                                          │
    │                                  ┌───────────────┐                                  │
    │                                  │   OpenAI      │  rewrite with GPT-4             │
    │                                  │   GPT-4       │                                  │
    │                                  └───────┬───────┘                                  │
    │                                          │                                          │
    │   ┌─────────────────┐            ┌───────▼───────┐                                  │
    │   │   Laravel API   │   update   │   Enhanced    │                                  │
    │   │   PUT /articles │◀───────────│   Content +   │                                  │
    │   │                 │            │   References  │                                  │
    │   └─────────────────┘            └───────────────┘                                  │
    │                                                                                     │
    │   NODE.JS OPTIMIZER (npm start)                                                     │
    └─────────────────────────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
                              ┌─────────────────────────────────────────┐
                              │          PHASE 3: PRESENTATION          │
                              └─────────────────────────────────────────┘
                                               │
    ┌──────────────────────────────────────────┼──────────────────────────────────────────┐
    │                                          │                                          │
    │   ┌─────────────────┐            ┌───────▼───────┐            ┌─────────────────┐   │
    │   │   Laravel API   │   fetch    │               │   render   │                 │   │
    │   │   GET /articles │───────────▶│  React App    │───────────▶│     User        │   │
    │   │                 │            │  + Router     │            │   (Browser)     │   │
    │   └─────────────────┘            └───────┬───────┘            └─────────────────┘   │
    │                                          │                                          │
    │                                  ┌───────┴───────┐                                  │
    │                                  │   Features:   │                                  │
    │                                  │ • Article List│                                  │
    │                                  │ • Detail View │                                  │
    │                                  │ • Toggle View │                                  │
    │                                  │ • References  │                                  │
    │                                  │ • Animations  │                                  │
    │                                  └───────────────┘                                  │
    │                                                                                     │
    │   REACT FRONTEND (npm run dev)                                                      │
    └─────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Scrape** - Laravel scrapes oldest 5 articles from BeyondChats blog
2. **Store** - Articles saved to MySQL database via Eloquent ORM
3. **Optimize** - Node.js fetches articles, searches competitors, rewrites with OpenAI
4. **Display** - React frontend shows original + optimized content with toggle

---

## 🛠 Tech Stack

### Backend (Laravel API)
| Technology | Version | Purpose |
|------------|---------|---------|
| PHP | >= 8.1 | Runtime |
| Laravel | 10.x | Framework |
| MySQL | 8.0 | Database |
| Goutte/DomCrawler | - | Web scraping |

### Optimizer (Node.js)
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | >= 18 | Runtime |
| OpenAI API | GPT-4 | Content rewriting |
| SerpAPI | - | Google search |
| Cheerio | - | HTML parsing |
| Axios | - | HTTP client |

### Frontend (React)
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI library |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Styling |
| Framer Motion | 10.x | Animations |
| React Router | 6.x | Routing |

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- PHP >= 8.1 with required extensions
- Node.js >= 18
- MySQL 8.0
- Composer
- npm

### 1. Clone & Setup

```bash
git clone https://github.com/Shoaib-2/BeyondChatsAssignment.git
cd BeyondChatsAssignment
```

### 2. Laravel API Setup

```bash
cd laravel-api

# Install dependencies
composer install

# Configure environment
cp .env.example .env

# Edit .env with your database credentials
# DB_DATABASE=beyondchats
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate

# Scrape articles (run once)
php artisan scrape:articles

# Start server
php artisan serve --port=8000
```

### 3. Node.js Optimizer Setup

```bash
cd nodejs-optimizer

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env with your API keys
# OPENAI_API_KEY=sk-your-key
# SERPAPI_KEY=your-key

# Run optimizer (optimizes latest article)
npm start
```

### 4. React Frontend Setup

```bash
cd react-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000/api

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Response Format
All responses follow this structure:
```json
{
  "success": true,
  "data": {...},
  "message": "Human readable message"
}
```

### Endpoints

#### List Articles (Paginated)
```http
GET /api/articles?page=1
```

**Response:**
```json
{
  "success": true,
  "message": "Articles retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Article Title",
      "content": "Original content...",
      "original_url": "https://beyondchats.com/blogs/...",
      "published_at": "2024-01-15T10:00:00Z",
      "author": "Author Name",
      "is_updated": true,
      "optimized_content": "Enhanced content...",
      "references": [
        {"title": "Reference 1", "url": "https://..."}
      ],
      "created_at": "2024-01-20T10:00:00Z",
      "updated_at": "2024-01-20T12:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 5
  }
}
```

#### Get Single Article
```http
GET /api/articles/{id}
```

#### Create Article
```http
POST /api/articles
Content-Type: application/json

{
  "title": "Article Title",
  "content": "Article content",
  "original_url": "https://example.com/article"
}
```

#### Update Article
```http
PUT /api/articles/{id}
Content-Type: application/json

{
  "content": "Updated content",
  "is_updated": true
}
```

#### Delete Article
```http
DELETE /api/articles/{id}
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Server Error |

---

## 🏗 Project Structure

```
BeyondChatsAssignment/
├── laravel-api/              # Phase 1: Backend API
│   ├── app/
│   │   ├── Console/Commands/ # Artisan commands (scraper)
│   │   ├── Http/
│   │   │   ├── Controllers/  # API controllers
│   │   │   ├── Requests/     # Form validation
│   │   │   └── Resources/    # API resources
│   │   └── Models/           # Eloquent models
│   ├── database/migrations/  # Database schema
│   ├── routes/api.php        # API routes
│   └── .env.example
│
├── nodejs-optimizer/         # Phase 2: Content optimizer
│   ├── src/
│   │   ├── index.js          # Main entry point
│   │   ├── config.js         # Configuration
│   │   ├── laravelClient.js  # API client
│   │   ├── googleSearch.js   # Search functionality
│   │   ├── contentScraper.js # Web scraping
│   │   └── llmOptimizer.js   # OpenAI integration
│   └── .env.example
│
├── react-frontend/           # Phase 3: Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── App.jsx           # Root component
│   └── .env.example
│
├── README.md                 # This file
├── SETUP.md                  # Detailed setup guide
├── ARCHITECTURE.md           # System architecture
└── Instructions.md           # Original requirements
```

---

## 🧪 Testing the System

### 1. Verify Laravel API
```bash
# Check if articles exist
curl http://localhost:8000/api/articles

# Should return JSON with success: true
```

### 2. Verify Node Optimizer
```bash
cd nodejs-optimizer
npm start

# Should output:
# ✓ Fetched latest article
# ✓ Found competitor articles
# ✓ Optimized content with AI
# ✓ Updated article in database
```

### 3. Verify React Frontend
- Open http://localhost:3000
- Should see list of articles
- Click an article to see detail view
- If optimized, toggle between Original/Optimized tabs

---

## 💡 Challenges & Solutions

### 1. Web Scraping Reliability
**Challenge**: BeyondChats blog structure may change, breaking the scraper.

**Solution**: 
- Used flexible CSS selectors with fallbacks
- Wrapped scraping in try/catch blocks
- Skip articles with missing critical data instead of crashing

### 2. Google Search Rate Limits
**Challenge**: Google blocks frequent search requests.

**Solution**:
- Integrated SerpAPI for reliable search results
- Limited to 2 competitor results to minimize API calls
- Added request timeouts and graceful error handling

### 3. LLM Token Costs
**Challenge**: OpenAI API costs can escalate quickly.

**Solution**:
- Truncate competitor content to relevant excerpts
- Use efficient prompts with clear instructions
- Process one article at a time to monitor costs

### 4. CORS Configuration
**Challenge**: Frontend couldn't connect to Laravel API.

**Solution**:
- Configured Laravel CORS middleware
- Allowed localhost:3000 and localhost:5173 origins
- Set proper headers for JSON responses

---

## 🔮 Future Improvements

### Short-term
- [ ] Add batch optimization for multiple articles
- [ ] Implement article search/filtering on frontend
- [ ] Add user authentication for admin operations
- [ ] Cache competitor search results

### Long-term
- [ ] Queue-based optimization with progress tracking
- [ ] A/B testing for original vs optimized content
- [ ] Analytics dashboard for content performance
- [ ] Support for multiple content sources

---

## ⏱ Time Spent

| Phase | Task | Time |
|-------|------|------|
| **Phase 1** | Laravel setup, migrations, scraper | ~3 hours |
| **Phase 2** | Node optimizer, search, LLM integration | ~4 hours |
| **Phase 3** | React frontend, components, styling | ~3 hours |
| **Docs** | README, SETUP, ARCHITECTURE | ~1 hour |
| **Total** | | **~11 hours** |

---

## 📄 License

This project is created for the BeyondChats Technical Assessment.

---

## 🤝 Author

Created as part of the BeyondChats Technical Product Manager Assessment.
