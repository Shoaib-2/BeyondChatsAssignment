import { motion } from 'framer-motion'

/**
 * Content toggle component for switching between original and optimized content
 * Used on the article detail page
 */
function ContentToggle({ activeTab, onTabChange, hasOptimized }) {
  const tabs = [
    {
      id: 'original',
      label: 'Original',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'optimized',
      label: 'Optimized',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      disabled: !hasOptimized,
    },
  ]

  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg w-fit">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileHover={!tab.disabled ? { scale: 1.02 } : {}}
          whileTap={!tab.disabled ? { scale: 0.98 } : {}}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
          disabled={tab.disabled}
          className={`
            relative flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors
            ${tab.disabled 
              ? 'text-gray-400 cursor-not-allowed' 
              : activeTab === tab.id 
                ? 'text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }
          `}
          aria-current={activeTab === tab.id ? 'true' : undefined}
          aria-disabled={tab.disabled}
        >
          {/* Active indicator background */}
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-md shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          
          {/* Tab content */}
          <span className="relative flex items-center gap-2">
            {tab.icon}
            {tab.label}
            {tab.id === 'optimized' && hasOptimized && (
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            )}
          </span>
        </motion.button>
      ))}
    </div>
  )
}

export default ContentToggle
