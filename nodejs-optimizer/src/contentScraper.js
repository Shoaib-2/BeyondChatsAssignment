/**
 * Competitor Content Scraper
 * Extracts relevant content from competitor URLs
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import config from './config.js';

/**
 * Selectors that typically contain unwanted content
 */
const UNWANTED_SELECTORS = [
  'nav',
  'header',
  'footer',
  'aside',
  '.sidebar',
  '.advertisement',
  '.ad',
  '.ads',
  '.social-share',
  '.comments',
  '.related-posts',
  '.newsletter',
  '.popup',
  '.modal',
  'script',
  'style',
  'noscript',
  'iframe',
  '[role="navigation"]',
  '[role="banner"]',
  '[role="contentinfo"]',
];

/**
 * Selectors that typically contain main content
 */
const CONTENT_SELECTORS = [
  'article',
  '[role="main"]',
  'main',
  '.post-content',
  '.article-content',
  '.entry-content',
  '.content',
  '.post-body',
  '#content',
  '.blog-post',
  '.single-post',
];

/**
 * Clean and extract text from HTML content
 * @param {CheerioAPI} $ - Cheerio instance
 * @returns {Object} Extracted content
 */
function extractContent($) {
  // Remove unwanted elements
  UNWANTED_SELECTORS.forEach(selector => {
    $(selector).remove();
  });

  // Try to find main content container
  let $content = null;
  for (const selector of CONTENT_SELECTORS) {
    const element = $(selector).first();
    if (element.length > 0) {
      $content = element;
      break;
    }
  }

  // Fallback to body if no content container found
  if (!$content || $content.length === 0) {
    $content = $('body');
  }

  // Extract title
  const title = $('h1').first().text().trim() || 
                $('title').text().trim() || 
                '';

  // Extract headings
  const headings = [];
  $content.find('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const text = $(el).text().trim();
    if (text) {
      headings.push({
        level: el.tagName.toLowerCase(),
        text,
      });
    }
  });

  // Extract code blocks
  const codeBlocks = [];
  $content.find('pre, code').each((_, el) => {
    const code = $(el).text().trim();
    if (code && code.length > 20) { // Only include substantial code
      codeBlocks.push(code);
    }
  });

  // Extract main body text
  // Get all paragraphs and join them
  const paragraphs = [];
  $content.find('p').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 30) { // Filter out short paragraphs
      paragraphs.push(text);
    }
  });

  // Also get list items
  const listItems = [];
  $content.find('li').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 10) {
      listItems.push(text);
    }
  });

  // Combine body text
  const bodyText = paragraphs.join('\n\n');

  return {
    title,
    body: bodyText,
    headings,
    codeBlocks,
    rawTextLength: bodyText.length,
  };
}

/**
 * Scrape content using axios and cheerio (fast, for static sites)
 * @param {string} url - URL to scrape
 * @returns {Promise<Object>} Extracted content
 */
async function scrapeWithCheerio(url) {
  const response = await axios.get(url, {
    timeout: config.requestTimeoutMs,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
  });

  const $ = cheerio.load(response.data);
  return extractContent($);
}

/**
 * Scrape content using Puppeteer (for JavaScript-rendered sites)
 * @param {string} url - URL to scrape
 * @returns {Promise<Object>} Extracted content
 */
async function scrapeWithPuppeteer(url) {
  let browser = null;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: config.requestTimeoutMs,
    });
    
    // Wait a bit for any lazy-loaded content
    await page.waitForTimeout(2000);
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    return extractContent($);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Scrape competitor content from URL
 * Tries cheerio first, falls back to puppeteer if needed
 * @param {string} url - URL to scrape
 * @returns {Promise<Object|null>} Extracted content or null if failed
 */
export async function scrapeCompetitorContent(url) {
  console.log(`🌐 Scraping: ${url}`);
  
  try {
    // First try with cheerio (faster)
    let content = await scrapeWithCheerio(url);
    
    // If content is too short, try puppeteer
    if (content.rawTextLength < 200) {
      console.log('   Content too short, trying with browser rendering...');
      content = await scrapeWithPuppeteer(url);
    }
    
    if (content.rawTextLength < 100) {
      console.log('   ⚠️ Could not extract meaningful content');
      return null;
    }
    
    console.log(`   ✅ Extracted ${content.body.length} chars, ${content.headings.length} headings, ${content.codeBlocks.length} code blocks`);
    
    return {
      url,
      title: content.title,
      body: content.body,
      headings: content.headings,
      codeBlocks: content.codeBlocks,
    };
  } catch (error) {
    console.error(`   ❌ Failed to scrape ${url}:`, error.message);
    return null;
  }
}

/**
 * Scrape multiple competitor URLs
 * @param {Array<{title: string, url: string}>} searchResults - Search results to scrape
 * @returns {Promise<Array>} Array of scraped content
 */
export async function scrapeCompetitors(searchResults) {
  console.log(`\n📚 Scraping ${searchResults.length} competitor articles...`);
  
  const scrapedContent = [];
  
  for (const result of searchResults) {
    try {
      const content = await scrapeCompetitorContent(result.url);
      
      if (content) {
        scrapedContent.push({
          ...content,
          originalTitle: result.title, // Title from search result
        });
      }
    } catch (error) {
      console.error(`   ❌ Error processing ${result.url}:`, error.message);
      // Continue with next URL
    }
  }
  
  console.log(`✅ Successfully scraped ${scrapedContent.length} competitor articles\n`);
  
  return scrapedContent;
}

export default {
  scrapeCompetitorContent,
  scrapeCompetitors,
};
