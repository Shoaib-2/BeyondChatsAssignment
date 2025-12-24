import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
    console.error('API Error:', errorMessage)
    return Promise.reject(error)
  }
)

/**
 * Fetch paginated list of articles
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export const getArticles = async (page = 1) => {
  try {
    const response = await api.get('/articles', {
      params: { page },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch articles')
  }
}

/**
 * Fetch a single article by ID
 * @param {number|string} id - Article ID
 * @returns {Promise<Object>}
 */
export const getArticle = async (id) => {
  try {
    const response = await api.get(`/articles/${id}`)
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Article not found')
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch article')
  }
}

export default api
