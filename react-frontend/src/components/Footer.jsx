import { motion } from 'framer-motion'

/**
 * Footer component with copyright and links
 */
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="bg-white border-t border-gray-100 mt-auto"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-gray-500 text-sm">
            © {currentYear} BeyondChats Technical Assessment. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <a 
              href="https://beyondchats.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
            >
              BeyondChats
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
