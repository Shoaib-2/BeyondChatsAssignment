/**
 * Google Search Module
 * Searches Google for article-related content and extracts organic results
 */

import axios from 'axios';
import puppeteer from 'puppeteer';
import config, { getSearchMethod } from './config.js';

/**
 * Domains to exclude from search results
 */
const EXCLUDED_DOMAINS = [
  'beyondchats.com',
  'youtube.com',
  'youtu.be',
  'facebook.com',
  'twitter.com',
  'x.com',
  'instagram.com',
  'linkedin.com',
  'reddit.com',
  'quora.com',
  'pinterest.com',
  'tiktok.com',
];

/**
 * Check if a URL should be excluded
 * @param {string} url - URL to check
 * @returns {boolean} True if should be excluded
 */
function shouldExcludeUrl(url) {
  const lowerUrl = url.toLowerCase();
  return EXCLUDED_DOMAINS.some(domain => lowerUrl.includes(domain));
}

/**
 * Search using SerpAPI
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of search results
 */
async function searchWithSerpApi(query) {
  try {
    console.log('🔍 Searching with SerpAPI...');
    
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: config.serpApiKey,
        engine: 'google',
        num: 10, // Get more results to filter
      },
      timeout: config.requestTimeoutMs,
    });

    const organicResults = response.data.organic_results || [];
    
    // Filter and map results
    const filteredResults = organicResults
      .filter(result => !shouldExcludeUrl(result.link))
      .slice(0, config.maxCompetitorResults)
      .map(result => ({
        title: result.title,
        url: result.link,
        snippet: result.snippet || '',
      }));

    return filteredResults;
  } catch (error) {
    console.error('❌ SerpAPI search failed:', error.message);
    throw error;
  }
}

/**
 * Search using Google Custom Search API
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of search results
 */
async function searchWithGoogleCustomSearch(query) {
  try {
    console.log('🔍 Searching with Google Custom Search API...');
    
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        q: query,
        key: config.googleApiKey,
        cx: config.googleSearchEngineId,
        num: 10,
      },
      timeout: config.requestTimeoutMs,
    });

    const items = response.data.items || [];
    
    // Filter and map results
    const filteredResults = items
      .filter(item => !shouldExcludeUrl(item.link))
      .slice(0, config.maxCompetitorResults)
      .map(item => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet || '',
      }));

    return filteredResults;
  } catch (error) {
    console.error('❌ Google Custom Search failed:', error.message);
    throw error;
  }
}

/**
 * Search using Puppeteer (fallback - scrapes Google directly)
 * Note: This may violate Google's ToS, use with caution
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of search results
 */
async function searchWithPuppeteer(query) {
  let browser = null;
  
  try {
    console.log('🔍 Searching with Puppeteer (browser-based)...');
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    // Navigate to Google search
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: config.requestTimeoutMs });
    
    // Wait for search results
    await page.waitForSelector('#search', { timeout: 10000 });
    
    // Extract search results
    const results = await page.evaluate(() => {
      const searchResults = [];
      const resultElements = document.querySelectorAll('#search .g');
      
      resultElements.forEach(element => {
        const linkElement = element.querySelector('a');
        const titleElement = element.querySelector('h3');
        const snippetElement = element.querySelector('.VwiC3b');
        
        if (linkElement && titleElement) {
          searchResults.push({
            title: titleElement.textContent || '',
            url: linkElement.href || '',
            snippet: snippetElement ? snippetElement.textContent : '',
          });
        }
      });
      
      return searchResults;
    });
    
    // Filter results
    const filteredResults = results
      .filter(result => result.url && !shouldExcludeUrl(result.url))
      .slice(0, config.maxCompetitorResults);
    
    return filteredResults;
  } catch (error) {
    console.error('❌ Puppeteer search failed:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Search Google for the given query
 * Uses the best available search method based on configuration
 * @param {string} articleTitle - Article title to search for
 * @returns {Promise<Array>} Array of search results {title, url, snippet}
 */
export async function searchGoogle(articleTitle) {
  const searchMethod = getSearchMethod();
  console.log(`📋 Search query: "${articleTitle}"`);
  console.log(`🔧 Using search method: ${searchMethod}`);
  
  try {
    let results = [];
    
    switch (searchMethod) {
      case 'serpapi':
        results = await searchWithSerpApi(articleTitle);
        break;
      case 'google-custom-search':
        results = await searchWithGoogleCustomSearch(articleTitle);
        break;
      case 'puppeteer':
      default:
        results = await searchWithPuppeteer(articleTitle);
        break;
    }
    
    if (results.length === 0) {
      console.log('⚠️ No suitable search results found');
      return [];
    }
    
    console.log(`✅ Found ${results.length} competitor results:`);
    results.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.title}`);
      console.log(`      URL: ${result.url}`);
    });
    
    return results;
  } catch (error) {
    console.error('❌ Google search failed:', error.message);
    // Return empty array instead of throwing - graceful degradation
    return [];
  }
}

export default {
  searchGoogle,
};
