# Setup Guide

Complete setup instructions for the BeyondChats Technical Assessment project.

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software
| Software | Minimum Version | Download |
|----------|-----------------|----------|
| PHP | 8.1+ | [php.net](https://www.php.net/downloads) |
| Composer | 2.0+ | [getcomposer.org](https://getcomposer.org/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| npm | 9+ | Included with Node.js |
| MySQL | 8.0+ | [mysql.com](https://www.mysql.com/downloads/) |

### PHP Extensions Required
- OpenSSL
- PDO
- Mbstring
- Tokenizer
- XML
- Ctype
- JSON
- BCMath
- cURL

### API Keys Required
| Service | Purpose | Get Key |
|---------|---------|---------|
| OpenAI | Content optimization | [platform.openai.com](https://platform.openai.com/) |
| SerpAPI | Google search | [serpapi.com](https://serpapi.com/) |

---

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd BeyondChatsAssignment
```

---

## Step 2: Database Setup

### Create MySQL Database

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE beyondchats CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'beyondchats'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON beyondchats.* TO 'beyondchats'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

---

## Step 3: Laravel API Setup

### Navigate to Laravel Directory
```bash
cd laravel-api
```

### Install PHP Dependencies
```bash
composer install
```

### Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Edit .env File
Open `.env` and update these values:

```env
APP_NAME="BeyondChats API"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=beyondchats
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

FRONTEND_URL=http://localhost:3000
```

### Run Database Migrations
```bash
php artisan migrate
```

### Scrape Initial Articles
```bash
# This scrapes the oldest 5 articles from BeyondChats blog
php artisan scrape:articles
```

### Start the Server
```bash
php artisan serve --port=8000
```

### Verify API is Working
```bash
# In a new terminal
curl http://localhost:8000/api/articles

# Should return JSON with articles
```

---

## Step 4: Node.js Optimizer Setup

### Navigate to Optimizer Directory
```bash
cd ../nodejs-optimizer
```

### Install Dependencies
```bash
npm install
```

### Configure Environment
```bash
cp .env.example .env
```

### Edit .env File
```env
# Laravel API URL (must match your Laravel server)
LARAVEL_API_URL=http://localhost:8000/api

# OpenAI API Key (required for content optimization)
OPENAI_API_KEY=sk-your-openai-api-key-here

# SerpAPI Key (required for Google search)
SERPAPI_KEY=your-serpapi-key-here

# Optional settings
MAX_COMPETITOR_RESULTS=2
REQUEST_TIMEOUT_MS=30000
DEBUG=false
```

### Getting API Keys

#### OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy and paste into `.env`

#### SerpAPI Key
1. Go to [serpapi.com](https://serpapi.com/)
2. Sign up for free account (100 searches/month free)
3. Find your API key in dashboard
4. Copy and paste into `.env`

### Run the Optimizer
```bash
# Make sure Laravel API is running first!
npm start
```

### Expected Output
```
🚀 Starting Content Optimizer...
📰 Fetching latest article from Laravel API...
✓ Found article: "Article Title"
🔍 Searching for competitor content...
✓ Found 2 competitor articles
📝 Optimizing content with AI...
✓ Content optimized successfully
💾 Updating article in database...
✓ Article updated with optimized content
✅ Optimization complete!
```

---

## Step 5: React Frontend Setup

### Navigate to Frontend Directory
```bash
cd ../react-frontend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment
```bash
cp .env.example .env
```

### Edit .env File
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Start Development Server
```bash
npm run dev
```

### Access the Frontend
Open your browser and go to: **http://localhost:3000**

---

## Running All Services

For the complete system, you need 3 terminal windows:

### Terminal 1: Laravel API
```bash
cd laravel-api
php artisan serve --port=8000
```

### Terminal 2: React Frontend
```bash
cd react-frontend
npm run dev
```

### Terminal 3: Optimizer (run as needed)
```bash
cd nodejs-optimizer
npm start
```

---

## Troubleshooting

### Common Issues

#### 1. "SQLSTATE[HY000] [1049] Unknown database"
**Solution**: Create the database first
```bash
mysql -u root -p -e "CREATE DATABASE beyondchats"
```

#### 2. "CORS error" in browser console
**Solution**: Ensure Laravel CORS is configured
```php
// config/cors.php should include:
'allowed_origins' => ['http://localhost:3000'],
```

#### 3. "npm ERR! Missing script: dev"
**Solution**: Check package.json has scripts defined
```bash
npm install
npm run dev
```

#### 4. "OpenAI API rate limit exceeded"
**Solution**: Wait a minute, or check your API quota at platform.openai.com

#### 5. "SerpAPI: Invalid API key"
**Solution**: Verify your API key at serpapi.com/dashboard

#### 6. "Connection refused" on API calls
**Solution**: Make sure Laravel server is running on port 8000
```bash
php artisan serve --port=8000
```

---

## Environment Files Summary

Each project has a `.env.example` file. Here's what each needs:

### laravel-api/.env
```env
DB_DATABASE=beyondchats
DB_USERNAME=root
DB_PASSWORD=your_password
```

### nodejs-optimizer/.env
```env
LARAVEL_API_URL=http://localhost:8000/api
OPENAI_API_KEY=sk-your-key
SERPAPI_KEY=your-key
```

### react-frontend/.env
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## Production Deployment Notes

For production deployment:

1. **Laravel**: Use proper web server (Nginx/Apache), set `APP_ENV=production`
2. **Node.js**: Consider running optimizer as a cron job or queue worker
3. **React**: Build with `npm run build`, serve static files
4. **Database**: Use managed MySQL service with proper backups
5. **Environment**: Never commit `.env` files, use secure secrets management
