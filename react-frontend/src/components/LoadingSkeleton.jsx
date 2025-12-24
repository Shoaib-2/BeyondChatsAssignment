import { motion } from 'framer-motion'

/**
 * Loading skeleton component for article cards
 * Shows animated placeholder while content is loading
 */
function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="card p-6"
        >
          {/* Title skeleton */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="skeleton h-7 w-3/4 rounded-lg" />
            <div className="skeleton h-6 w-20 rounded-full" />
          </div>

          {/* Excerpt skeleton */}
          <div className="space-y-2 mb-4">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>

          {/* Footer skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-4 w-32 rounded" />
            </div>
            <div className="skeleton h-4 w-20 rounded" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/**
 * Loading spinner component for inline loading states
 */
export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <svg className="w-full h-full text-primary-600" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  )
}

/**
 * Full page loading state
 */
export function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-500">Loading...</p>
    </motion.div>
  )
}

export default LoadingSkeleton
