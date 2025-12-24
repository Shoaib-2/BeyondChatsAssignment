import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import ArticleCard from '../components/ArticleCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorState, { EmptyState } from '../components/ErrorState'
import Pagination from '../components/Pagination'
import { getArticles } from '../services/api'

/**
 * Home page component
 * Displays a paginated list of articles with loading and error states
 */
function HomePage() {
  const [articles, setArticles] = useState([])
  const [meta, setMeta] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch articles from API
  const fetchArticles = useCallback(async (page) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await getArticles(page)
      setArticles(response.data || [])
      setMeta(response.meta || null)
    } catch (err) {
      setError(err.message || 'Failed to load articles')
      setArticles([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch articles on mount and page change
  useEffect(() => {
    fetchArticles(currentPage)
  }, [currentPage, fetchArticles])

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle retry
  const handleRetry = () => {
    fetchArticles(currentPage)
  }

  // Calculate stats for header
  const optimizedCount = articles.filter(a => a.is_updated).length
  const totalCount = meta?.total || articles.length

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Articles
        </h1>
        <p className="text-gray-600">
          Browse our collection of articles from BeyondChats blog
        </p>
        
        {/* Stats */}
        {!isLoading && !error && articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mt-4 text-sm"
          >
            <span className="text-gray-500">
              {totalCount} article{totalCount !== 1 ? 's' : ''} total
            </span>
            {optimizedCount > 0 && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {optimizedCount} optimized
                </span>
              </>
            )}
          </motion.div>
        )}
      </motion.header>

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton count={5} />
      ) : error ? (
        <ErrorState
          title="Failed to load articles"
          message={error}
          onRetry={handleRetry}
          showHomeLink={false}
        />
      ) : articles.length === 0 ? (
        <EmptyState
          title="No articles found"
          message="There are no articles available at the moment. Please check back later."
        />
      ) : (
        <>
          {/* Article List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {articles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={index}
              />
            ))}
          </motion.div>

          {/* Pagination */}
          {meta && (
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  )
}

export default HomePage
