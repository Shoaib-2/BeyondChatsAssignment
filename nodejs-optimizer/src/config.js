/**
 * Configuration module
 * Loads and validates environment variables
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

/**
 * Application configuration object
 */
const config = {
  // Laravel API
  laravelApiUrl: process.env.LARAVEL_API_URL || 'http://localhost:8000/api',

  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY || '',

  // Google Search - SerpAPI
  serpApiKey: process.env.SERPAPI_KEY || '',

  // Google Custom Search (alternative)
  googleApiKey: process.env.GOOGLE_API_KEY || '',
  googleSearchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID || '',

  // Scraping settings
  maxCompetitorResults: parseInt(process.env.MAX_COMPETITOR_RESULTS || '2', 10),
  requestTimeoutMs: parseInt(process.env.REQUEST_TIMEOUT_MS || '30000', 10),

  // Debug
  debug: process.env.DEBUG === 'true',
};

/**
 * Validates required configuration
 * @throws {Error} If required config is missing
 */
export function validateConfig() {
  const errors = [];

  if (!config.openaiApiKey) {
    errors.push('OPENAI_API_KEY is required');
  }

  // Check for at least one search method
  if (!config.serpApiKey && !config.googleApiKey) {
    errors.push('Either SERPAPI_KEY or GOOGLE_API_KEY is required for Google search');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join('\n')}`);
  }

  return true;
}

/**
 * Get search method based on available credentials
 */
export function getSearchMethod() {
  if (config.serpApiKey) {
    return 'serpapi';
  }
  if (config.googleApiKey && config.googleSearchEngineId) {
    return 'google-custom-search';
  }
  return 'puppeteer'; // Fallback to browser-based scraping
}

export default config;
