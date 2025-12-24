import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MarkdownRenderer from '../components/MarkdownRenderer'
import ContentToggle from '../components/ContentToggle'
import ReferencesSection from '../components/ReferencesSection'
import ErrorState from '../components/ErrorState'
import { PageLoader } from '../components/LoadingSkeleton'
import { getArticle } from '../services/api'

/**
 * Article detail page component
 * Displays full article content with toggle between original and optimized versions
 */
function ArticleDetailPage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('original')

  // Fetch article from API
  const fetchArticle = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await getArticle(id)
      setArticle(response.data)
      
      // Auto-switch to optimized tab if available
      if (response.data?.is_updated && response.data?.optimized_content) {
        setActiveTab('optimized')
      }
    } catch (err) {
      setError(err.message || 'Failed to load article')
      setArticle(null)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  // Fetch article on mount
  useEffect(() => {
    fetchArticle()
  }, [fetchArticle])

  // Handle retry
  const handleRetry = () => {
    fetchArticle()
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Loading state
  if (isLoading) {
    return <PageLoader />
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState
          title="Article not found"
          message={error}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  // No article found
  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState
          title="Article not found"
          message="The article you're looking for doesn't exist or has been removed."
        />
      </div>
    )
  }

  const {
    title,
    content,
    optimized_content,
    original_url,
    published_at,
    author,
    is_updated,
    references,
  } = article

  const hasOptimized = is_updated && optimized_content
  const displayContent = activeTab === 'optimized' && hasOptimized ? optimized_content : content

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Articles
        </Link>
      </motion.div>

      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          {author && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {author}
            </span>
          )}
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(published_at)}
          </span>
          {original_url && (
            <a
              href={original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Original
            </a>
          )}
        </div>

        {/* Optimized Badge */}
        {is_updated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-6"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>
              <strong>Optimized</strong> — This article has been enhanced using AI with competitor insights
            </span>
          </motion.div>
        )}

        {/* Content Toggle */}
        {hasOptimized && (
          <ContentToggle
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hasOptimized={hasOptimized}
          />
        )}
      </motion.header>

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card p-6 sm:p-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Content Type Indicator */}
            {hasOptimized && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
                {activeTab === 'optimized' ? (
                  <>
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Viewing <strong>optimized</strong> content</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Viewing <strong>original</strong> content</span>
                  </>
                )}
              </div>
            )}

            {/* Markdown Content */}
            <MarkdownRenderer content={displayContent} />
          </motion.div>
        </AnimatePresence>

        {/* References Section (only show when viewing optimized content) */}
        {activeTab === 'optimized' && hasOptimized && (
          <ReferencesSection references={references} />
        )}
      </motion.article>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex justify-center"
      >
        <Link
          to="/"
          className="btn btn-secondary"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to All Articles
        </Link>
      </motion.div>
    </div>
  )
}

export default ArticleDetailPage
