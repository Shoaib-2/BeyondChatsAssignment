# Node.js Content Optimizer

A content optimization script that fetches articles from the Laravel API, searches for competitor content, and uses OpenAI to rewrite and improve articles.

## Features

- **Article Fetching**: Retrieves the latest article from Laravel API
- **Google Search**: Finds top 2 competitor articles (excludes social media, YouTube, forums)
- **Content Scraping**: Extracts title, body, headings, and code blocks from competitor URLs
- **LLM Optimization**: Uses OpenAI to rewrite content with SEO improvements
- **Automatic Updates**: Sends optimized content back to Laravel API

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Running Laravel API (from Phase 1)
- OpenAI API key
- SerpAPI key OR Google Custom Search API credentials

## Installation

1. Navigate to the nodejs-optimizer directory:
   ```bash
   cd nodejs-optimizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with your API keys.

## Configuration

Edit `.env` with your credentials:

```env
# Laravel API URL (must be running)
LARAVEL_API_URL=http://localhost:8000/api

# OpenAI API Key (required)
OPENAI_API_KEY=sk-your-openai-key-here

# Google Search - Option 1: SerpAPI (recommended)
SERPAPI_KEY=your-serpapi-key-here

# Google Search - Option 2: Google Custom Search API
# GOOGLE_API_KEY=your-google-api-key
# GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id

# Optional settings
MAX_COMPETITOR_RESULTS=2
REQUEST_TIMEOUT_MS=30000
DEBUG=false
```

### Getting API Keys

1. **OpenAI API Key**: 
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Create an API key in your dashboard

2. **SerpAPI Key** (recommended for Google search):
   - Sign up at [SerpAPI](https://serpapi.com/)
   - Free tier available (100 searches/month)

3. **Google Custom Search API** (alternative):
   - Create project in [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Custom Search API
   - Create a Custom Search Engine at [CSE](https://cse.google.com/cse/)

## Usage

### Ensure Laravel API is Running

Before running the optimizer, make sure your Laravel API is running:

```bash
# In the laravel-api directory
php artisan serve
```

### Run the Optimizer

```bash
npm start
```

Or with file watching (development):
```bash
npm run dev
```

## Workflow

The script follows this exact workflow:

1. **Step 1**: Fetch the latest article from Laravel API
2. **Step 2**: Search Google for `[article_title]`
3. **Step 3**: Scrape top 2 competitor articles
4. **Step 4**: Send to OpenAI for content optimization
5. **Step 5**: Update article via Laravel API with `is_updated = true`

## Project Structure

```
nodejs-optimizer/
├── src/
│   ├── index.js           # Main entry point / orchestrator
│   ├── config.js          # Configuration management
│   ├── laravelClient.js   # Laravel API communication
│   ├── googleSearch.js    # Google search functionality
│   ├── contentScraper.js  # Competitor content scraping
│   └── llmOptimizer.js    # OpenAI integration
├── .env.example           # Environment template
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Error Handling

The script handles errors gracefully:

- Missing articles: Exits with code 0
- Failed searches: Exits gracefully without crashing
- Scraping failures: Skips failed URLs, continues with others
- LLM errors: Reports error and exits
- Already optimized: Skips if `is_updated` is true

## Cost Considerations

- Uses `gpt-4o-mini` model for cost efficiency
- Content is truncated to 3000 chars per competitor to limit tokens
- Token usage is logged after each optimization
- Typical cost: ~$0.01-0.05 per article optimization

## Troubleshooting

### "No articles found"
- Ensure Laravel API is running
- Check that articles exist in the database
- Verify `LARAVEL_API_URL` in `.env`

### "Google search failed"
- Check your SerpAPI or Google API credentials
- Verify API quotas haven't been exceeded
- The script will fall back to Puppeteer-based search

### "OpenAI optimization failed"
- Verify your OpenAI API key
- Check your OpenAI account has credits
- Review error message for specific issues

### "Failed to scrape content"
- Some sites block scrapers
- Content may be behind JavaScript rendering
- The script will continue with available content

## License

MIT
