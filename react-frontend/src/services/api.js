import axios from 'axios'

// Demo mode - uses sample data when API is unavailable (for Vercel deployment)
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

// Sample data for demo mode
const DEMO_ARTICLES = [
  {
    id: 1,
    title: "Choosing the Right AI Chatbot: A Comprehensive Guide",
    content: "# Choosing the Right AI Chatbot: A Comprehensive Guide\n\nSelecting an AI chatbot can be a daunting task, primarily due to the overwhelming number of options available. Each platform claims to offer advanced features, but the key is to identify which aligns best with your specific needs.\n\n## Understanding Your Requirements\n\nBefore diving into the selection process, it's crucial to understand your requirements:\n\n- **Customer Support**: Do you need 24/7 automated responses?\n- **Lead Generation**: Will the chatbot qualify leads?\n- **Integration**: Does it need to work with your existing CRM?\n\n## Key Features to Look For\n\n### 1. Natural Language Processing\nA good chatbot should understand context and intent, not just keywords.\n\n### 2. Customization Options\nLook for platforms that allow you to customize responses and workflows.\n\n### 3. Analytics Dashboard\nData-driven insights help improve chatbot performance over time.\n\n## Conclusion\n\nChoosing the right AI chatbot requires careful consideration of your business needs, budget, and technical requirements.",
    original_url: "https://beyondchats.com/blogs/choosing-the-right-ai-chatbot/",
    published_at: "2025-11-28T16:12:23+00:00",
    author: "BeyondChats Team",
    is_updated: true,
    optimized_content: "# Choosing the Right AI Chatbot: A Comprehensive Guide\n\nSelecting an AI chatbot can be a daunting task, primarily due to the overwhelming number of options available. Each platform claims to offer advanced features, but the key is to identify which aligns best with your specific needs.\n\n## Understanding Your Requirements\n\nBefore diving into the selection process, it's crucial to understand your requirements:\n\n- **Customer Support**: Do you need 24/7 automated responses?\n- **Lead Generation**: Will the chatbot qualify leads?\n- **Integration**: Does it need to work with your existing CRM?\n- **Scalability**: Can it handle growing traffic?\n\n## Key Features to Evaluate\n\n### 1. Natural Language Processing (NLP)\nA sophisticated chatbot should understand context, intent, and sentiment—not just keywords. Look for AI that can handle complex queries and maintain conversation context.\n\n### 2. Customization & Branding\nThe best platforms allow you to customize:\n- Response tone and style\n- Visual appearance\n- Conversation workflows\n- Fallback behaviors\n\n### 3. Analytics & Reporting\nData-driven insights are essential for continuous improvement:\n- Conversation success rates\n- User satisfaction scores\n- Common query patterns\n- Drop-off points\n\n### 4. Integration Capabilities\nEnsure seamless integration with:\n- CRM systems (Salesforce, HubSpot)\n- Help desk software (Zendesk, Freshdesk)\n- Communication tools (Slack, Teams)\n\n## Making the Final Decision\n\nConsider running a pilot program before full deployment. This allows you to:\n1. Test real-world performance\n2. Gather user feedback\n3. Identify optimization opportunities\n\n## Conclusion\n\nChoosing the right AI chatbot requires careful consideration of your business needs, budget, and technical requirements. Take time to evaluate multiple options and don't hesitate to request demos.",
    references: [
      { title: "AI Chatbot Selection Guide", url: "https://example.com/chatbot-guide" },
      { title: "Best Practices for Chatbot Implementation", url: "https://example.com/chatbot-practices" }
    ],
    created_at: "2025-11-28T16:12:23+00:00",
    updated_at: "2025-12-25T10:00:00+00:00"
  },
  {
    id: 2,
    title: "Google Ads: Are You Wasting Money on Clicks?",
    content: "# Google Ads: Are You Wasting Money on Clicks?\n\nMany businesses pour money into Google Ads without seeing the expected returns. The problem often isn't the platform—it's the strategy.\n\n## Common Mistakes\n\n### 1. Poor Keyword Selection\nBroad keywords attract irrelevant traffic and drain your budget.\n\n### 2. Ignoring Negative Keywords\nNot excluding irrelevant searches means paying for clicks that won't convert.\n\n### 3. Weak Landing Pages\nEven perfect ads fail if the landing page doesn't deliver.\n\n## How to Optimize\n\n- Use long-tail keywords for better targeting\n- Regularly review search term reports\n- A/B test your ad copy\n- Ensure landing page relevance\n\n## Conclusion\n\nSmart Google Ads management can significantly improve your ROI. Focus on relevance and continuous optimization.",
    original_url: "https://beyondchats.com/blogs/google-ads-optimization/",
    published_at: "2025-04-10T04:03:57+00:00",
    author: "Marketing Team",
    is_updated: false,
    optimized_content: null,
    references: null,
    created_at: "2025-04-10T04:03:57+00:00",
    updated_at: "2025-04-10T04:03:57+00:00"
  },
  {
    id: 3,
    title: "Should You Trust AI in Healthcare?",
    content: "# Should You Trust AI in Healthcare?\n\nThe integration of artificial intelligence in healthcare has sparked widespread debate. While AI promises revolutionary improvements, concerns about accuracy and ethics remain.\n\n## Benefits of AI in Healthcare\n\n### Diagnostic Accuracy\nAI can analyze medical images with remarkable precision, often detecting issues human eyes might miss.\n\n### Operational Efficiency\nAutomated scheduling, billing, and administrative tasks free up healthcare professionals.\n\n### Personalized Treatment\nMachine learning algorithms can suggest personalized treatment plans based on patient data.\n\n## Concerns and Limitations\n\n- **Data Privacy**: Patient data must be protected\n- **Bias in Algorithms**: Training data can introduce biases\n- **Human Oversight**: AI should assist, not replace, medical professionals\n\n## Conclusion\n\nAI in healthcare offers tremendous potential when implemented responsibly with proper oversight.",
    original_url: "https://beyondchats.com/blogs/ai-in-healthcare/",
    published_at: "2025-04-08T22:31:19+00:00",
    author: "Health Tech Writer",
    is_updated: false,
    optimized_content: null,
    references: null,
    created_at: "2025-04-08T22:31:19+00:00",
    updated_at: "2025-04-08T22:31:19+00:00"
  },
  {
    id: 4,
    title: "Chatbots Magic: A Beginner's Guidebook",
    content: "# Chatbots Magic: A Beginner's Guidebook\n\nChatbots have transformed how businesses interact with customers. This guide will help you understand the basics and get started.\n\n## What is a Chatbot?\n\nA chatbot is a software application designed to simulate human conversation. They can be:\n- **Rule-based**: Follow predefined scripts\n- **AI-powered**: Use machine learning to understand context\n\n## Benefits for Business\n\n1. **24/7 Availability**: Never miss a customer query\n2. **Cost Reduction**: Handle multiple conversations simultaneously\n3. **Consistency**: Deliver uniform responses every time\n4. **Data Collection**: Gather valuable customer insights\n\n## Getting Started\n\n### Step 1: Define Your Goals\nWhat do you want your chatbot to achieve?\n\n### Step 2: Choose a Platform\nSelect a chatbot builder that fits your needs and budget.\n\n### Step 3: Design Conversations\nMap out common user journeys and responses.\n\n### Step 4: Test and Iterate\nContinuously improve based on user feedback.\n\n## Conclusion\n\nChatbots are powerful tools that can enhance customer experience and streamline operations. Start small and scale as you learn.",
    original_url: "https://beyondchats.com/blogs/chatbots-beginners-guide/",
    published_at: "2023-12-05T18:31:19+00:00",
    author: "BeyondChats Team",
    is_updated: false,
    optimized_content: null,
    references: null,
    created_at: "2023-12-05T18:31:19+00:00",
    updated_at: "2023-12-05T18:31:19+00:00"
  }
]

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
  // Return demo data if in demo mode
  if (DEMO_MODE) {
    return {
      success: true,
      message: 'Demo articles retrieved',
      data: DEMO_ARTICLES,
      meta: { current_page: 1, last_page: 1, per_page: 10, total: DEMO_ARTICLES.length }
    }
  }

  try {
    const response = await api.get('/articles', {
      params: { page },
    })
    return response.data
  } catch (error) {
    // Fallback to demo data if API is unavailable (e.g., production without backend)
    console.warn('API unavailable, falling back to demo data')
    return {
      success: true,
      message: 'Demo articles (API unavailable)',
      data: DEMO_ARTICLES,
      meta: { current_page: 1, last_page: 1, per_page: 10, total: DEMO_ARTICLES.length }
    }
  }
}

/**
 * Fetch a single article by ID
 * @param {number|string} id - Article ID
 * @returns {Promise<Object>}
 */
export const getArticle = async (id) => {
  // Return demo data if in demo mode
  if (DEMO_MODE) {
    const article = DEMO_ARTICLES.find(a => a.id === parseInt(id))
    if (!article) throw new Error('Article not found')
    return { success: true, message: 'Demo article retrieved', data: article }
  }

  try {
    const response = await api.get(`/articles/${id}`)
    return response.data
  } catch (error) {
    // Fallback to demo data if API is unavailable
    console.warn('API unavailable, falling back to demo data')
    const article = DEMO_ARTICLES.find(a => a.id === parseInt(id))
    if (!article) throw new Error('Article not found')
    return { success: true, message: 'Demo article (API unavailable)', data: article }
  }
}

export default api
