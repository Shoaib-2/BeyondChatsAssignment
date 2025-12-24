/**
 * Node.js Content Optimizer - Main Entry Point
 * 
 * Workflow:
 * 1. Fetch latest article from Laravel API
 * 2. Search Google for article title
 * 3. Scrape top 2 competitor articles
 * 4. Use LLM to rewrite/optimize content
 * 5. Update article via Laravel API
 */

import config, { validateConfig } from './config.js';
import { fetchLatestArticle, updateArticle } from './laravelClient.js';
import { searchGoogle } from './googleSearch.js';
import { scrapeCompetitors } from './contentScraper.js';
import { optimizeContent, validateOptimizedContent } from './llmOptimizer.js';

/**
 * Main optimization workflow
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('     BeyondChats Content Optimizer - Node.js');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Step 0: Validate configuration
    console.log('📋 Step 0: Validating configuration...');
    validateConfig();
    console.log('✅ Configuration valid\n');

    // Step 1: Fetch latest article from Laravel API
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 Step 1: Fetching latest article from Laravel API');
    console.log('═══════════════════════════════════════════════════════════');
    
    const article = await fetchLatestArticle();
    
    if (!article) {
      console.log('\n⚠️ No articles found. Exiting gracefully.');
      process.exit(0);
    }

    // Check if article is already optimized
    if (article.is_updated) {
      console.log('\n⚠️ Latest article is already optimized. Exiting.');
      process.exit(0);
    }

    console.log(`\n📄 Article Details:`);
    console.log(`   ID: ${article.id}`);
    console.log(`   Title: ${article.title}`);
    console.log(`   Content Length: ${article.content?.length || 0} characters`);
    console.log(`   Original URL: ${article.original_url || 'N/A'}`);

    // Step 2: Google Search
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📋 Step 2: Searching Google for related content');
    console.log('═══════════════════════════════════════════════════════════');
    
    const searchResults = await searchGoogle(article.title);
    
    if (searchResults.length === 0) {
      console.log('\n⚠️ No competitor articles found. Cannot proceed with optimization.');
      console.log('   Exiting gracefully.');
      process.exit(0);
    }

    // Step 3: Scrape competitor content
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📋 Step 3: Scraping competitor articles');
    console.log('═══════════════════════════════════════════════════════════');
    
    const competitorContent = await scrapeCompetitors(searchResults);
    
    if (competitorContent.length === 0) {
      console.log('\n⚠️ Failed to scrape any competitor content. Cannot proceed.');
      console.log('   Exiting gracefully.');
      process.exit(0);
    }

    // Step 4: LLM Optimization
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📋 Step 4: Optimizing content with LLM');
    console.log('═══════════════════════════════════════════════════════════');
    
    const optimizationResult = await optimizeContent(
      { title: article.title, content: article.content },
      competitorContent
    );

    if (!optimizationResult) {
      console.log('\n⚠️ Optimization failed. Exiting gracefully.');
      process.exit(0);
    }

    // Validate optimized content
    const validation = validateOptimizedContent(optimizationResult.content);
    if (!validation.valid) {
      console.log('\n⚠️ Content validation warnings:');
      validation.issues.forEach(issue => console.log(`   - ${issue}`));
    }

    console.log(`\n📝 Optimized Content Preview:`);
    console.log('   ' + optimizationResult.content.substring(0, 200).replace(/\n/g, '\n   ') + '...');
    
    console.log(`\n📚 References:`);
    optimizationResult.references.forEach((ref, i) => {
      console.log(`   ${i + 1}. ${ref.title}`);
      console.log(`      ${ref.url}`);
    });

    // Step 5: Update Laravel API
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📋 Step 5: Updating article in Laravel API');
    console.log('═══════════════════════════════════════════════════════════');
    
    await updateArticle(article.id, {
      content: optimizationResult.content,
      is_updated: true,
      references: optimizationResult.references,
    });

    // Success summary
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ OPTIMIZATION COMPLETE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   Article ID: ${article.id}`);
    console.log(`   Title: ${article.title}`);
    console.log(`   Original Length: ${article.content?.length || 0} chars`);
    console.log(`   Optimized Length: ${optimizationResult.content.length} chars`);
    console.log(`   Tokens Used: ${optimizationResult.tokensUsed}`);
    console.log(`   References: ${optimizationResult.references.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    
    if (config.debug) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

// Run the main function
main();
