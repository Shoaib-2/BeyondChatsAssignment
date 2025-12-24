/**
 * Laravel API Client
 * Handles communication with the Laravel backend
 */

import axios from 'axios';
import config from './config.js';

/**
 * Create axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: config.laravelApiUrl,
  timeout: config.requestTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Fetch the latest article from Laravel API
 * @returns {Promise<Object|null>} Latest article or null if none found
 */
export async function fetchLatestArticle() {
  try {
    console.log('📡 Fetching latest article from Laravel API...');
    
    // Fetch articles sorted by latest, limit to 1
    const response = await apiClient.get('/articles', {
      params: {
        per_page: 1,
        sort: 'desc',
      },
    });

    const { success, data } = response.data;

    if (!success || !data || data.length === 0) {
      console.log('⚠️ No articles found in the database');
      return null;
    }

    // data is an array of articles directly
    const article = Array.isArray(data) ? data[0] : (data.data ? data.data[0] : null);
    
    if (!article) {
      console.log('⚠️ No articles found in the database');
      return null;
    }
    
    console.log(`✅ Fetched article: "${article.title}" (ID: ${article.id})`);
    
    return article;
  } catch (error) {
    console.error('❌ Error fetching latest article:', error.message);
    
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    throw new Error(`Failed to fetch latest article: ${error.message}`);
  }
}

/**
 * Update an article with optimized content
 * @param {number} articleId - The article ID to update
 * @param {Object} updateData - Data to update
 * @param {string} updateData.content - Optimized content in markdown
 * @param {boolean} updateData.is_updated - Flag indicating optimization
 * @param {Array} updateData.references - Array of reference objects {title, url}
 * @returns {Promise<Object>} Updated article
 */
export async function updateArticle(articleId, updateData) {
  try {
    console.log(`📤 Updating article ID: ${articleId}...`);

    const response = await apiClient.put(`/articles/${articleId}`, {
      content: updateData.content,
      is_updated: updateData.is_updated,
      // Note: If Laravel API doesn't support references field, 
      // we'll need to adjust the API or store references differently
    });

    const { success, data, message } = response.data;

    if (!success) {
      throw new Error(message || 'Update failed');
    }

    console.log(`✅ Article updated successfully`);
    return data;
  } catch (error) {
    console.error('❌ Error updating article:', error.message);
    
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    throw new Error(`Failed to update article: ${error.message}`);
  }
}

/**
 * Fetch a single article by ID
 * @param {number} articleId - The article ID
 * @returns {Promise<Object>} Article data
 */
export async function fetchArticleById(articleId) {
  try {
    const response = await apiClient.get(`/articles/${articleId}`);
    const { success, data } = response.data;

    if (!success) {
      throw new Error('Article not found');
    }

    return data;
  } catch (error) {
    console.error(`❌ Error fetching article ${articleId}:`, error.message);
    throw new Error(`Failed to fetch article: ${error.message}`);
  }
}

export default {
  fetchLatestArticle,
  updateArticle,
  fetchArticleById,
};
