/**
 * LLM Content Optimizer
 * Uses OpenAI to rewrite and optimize article content
 */

import OpenAI from 'openai';
import config from './config.js';

/**
 * Initialize OpenAI client
 */
let openaiClient = null;

function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }
  return openaiClient;
}

/**
 * Build the optimization prompt following the exact structure from instructions
 * @param {Object} originalArticle - Original article {title, content}
 * @param {Array} competitorContent - Array of competitor content
 * @returns {string} Formatted prompt
 */
function buildOptimizationPrompt(originalArticle, competitorContent) {
  // Build reference articles section
  let referenceSection = '';
  
  competitorContent.forEach((competitor, index) => {
    // Truncate content if too long to save tokens
    const truncatedBody = competitor.body.length > 3000 
      ? competitor.body.substring(0, 3000) + '...' 
      : competitor.body;
    
    referenceSection += `
${index + 1}. ${competitor.title || competitor.originalTitle}
${truncatedBody}

`;
  });

  // Build the exact prompt structure from instructions
  const prompt = `You are a content optimization expert.

Original Article:
Title: ${originalArticle.title}
Content: ${originalArticle.content}

Reference Articles:
${referenceSection}

Task:
- Rewrite the original article
- Preserve core meaning
- Match SEO depth & structure
- Improve readability
- Use proper headings
- Maintain professional tone

Return markdown only.`;

  return prompt;
}

/**
 * Optimize article content using OpenAI
 * @param {Object} originalArticle - Original article {title, content}
 * @param {Array} competitorContent - Array of competitor content [{title, body, url}]
 * @returns {Promise<Object>} Optimized content and references
 */
export async function optimizeContent(originalArticle, competitorContent) {
  console.log('🤖 Optimizing content with OpenAI...');
  
  if (!competitorContent || competitorContent.length === 0) {
    console.log('⚠️ No competitor content available, skipping optimization');
    return null;
  }

  try {
    const client = getOpenAIClient();
    
    // Build the prompt
    const prompt = buildOptimizationPrompt(originalArticle, competitorContent);
    
    if (config.debug) {
      console.log('\n--- DEBUG: Prompt ---');
      console.log(prompt.substring(0, 500) + '...');
      console.log('--- END DEBUG ---\n');
    }

    // Call OpenAI API
    console.log('   Sending request to OpenAI...');
    
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective model
      messages: [
        {
          role: 'system',
          content: 'You are a professional content writer and SEO expert. Output only markdown content without any explanations or meta-commentary. Do not use emojis. Do not add marketing fluff. Do not hallucinate facts.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const optimizedContent = completion.choices[0]?.message?.content;

    if (!optimizedContent) {
      throw new Error('No content returned from OpenAI');
    }

    // Build references array
    const references = competitorContent.map(comp => ({
      title: comp.title || comp.originalTitle,
      url: comp.url,
    }));

    // Log token usage for cost awareness
    const usage = completion.usage;
    console.log(`   📊 Tokens used: ${usage?.total_tokens || 'unknown'} (prompt: ${usage?.prompt_tokens || 'unknown'}, completion: ${usage?.completion_tokens || 'unknown'})`);
    
    console.log('✅ Content optimization complete');
    
    return {
      content: optimizedContent,
      references,
      tokensUsed: usage?.total_tokens || 0,
    };
  } catch (error) {
    console.error('❌ OpenAI optimization failed:', error.message);
    
    if (error.code === 'insufficient_quota') {
      console.error('   Your OpenAI API quota has been exceeded');
    } else if (error.code === 'invalid_api_key') {
      console.error('   Invalid OpenAI API key');
    }
    
    throw new Error(`LLM optimization failed: ${error.message}`);
  }
}

/**
 * Validate that the optimized content meets quality requirements
 * @param {string} content - Optimized content
 * @returns {Object} Validation result {valid: boolean, issues: string[]}
 */
export function validateOptimizedContent(content) {
  const issues = [];
  
  // Check minimum length
  if (content.length < 500) {
    issues.push('Content is too short (< 500 characters)');
  }
  
  // Check for emojis (not allowed per instructions)
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u;
  if (emojiRegex.test(content)) {
    issues.push('Content contains emojis (not allowed)');
  }
  
  // Check for proper headings
  if (!content.includes('#')) {
    issues.push('Content lacks proper markdown headings');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

export default {
  optimizeContent,
  validateOptimizedContent,
};
