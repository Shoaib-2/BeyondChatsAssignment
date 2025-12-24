<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\Article;
use Carbon\Carbon;

class ScrapeArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'articles:scrape {--limit=5 : Number of articles to scrape}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scrape the oldest articles from BeyondChats blog';

    /**
     * Base URL for the blog.
     */
    private const BLOG_BASE_URL = 'https://beyondchats.com/blogs/';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $limit = (int) $this->option('limit');
        $this->info("Starting to scrape {$limit} oldest articles from BeyondChats blog...");

        try {
            // Step 1: Find the last page of the blog
            $lastPageUrl = $this->findLastPage();
            
            if (!$lastPageUrl) {
                $this->error('Could not determine the last page of the blog.');
                return Command::FAILURE;
            }

            $this->info("Found last page: {$lastPageUrl}");

            // Step 2: Get article URLs from the last page
            $articleUrls = $this->getArticleUrlsFromPage($lastPageUrl, $limit);

            if (empty($articleUrls)) {
                $this->error('No articles found on the last page.');
                return Command::FAILURE;
            }

            $this->info("Found " . count($articleUrls) . " article(s) to scrape.");

            // Step 3: Scrape each article
            $successCount = 0;
            $skipCount = 0;

            foreach ($articleUrls as $index => $url) {
                $this->line("Processing article " . ($index + 1) . "/" . count($articleUrls) . ": {$url}");

                try {
                    $articleData = $this->scrapeArticle($url);

                    if ($articleData && $this->saveArticle($articleData)) {
                        $this->info("  ✓ Saved: {$articleData['title']}");
                        $successCount++;
                    } else {
                        $this->warn("  ⚠ Skipped (already exists or missing data)");
                        $skipCount++;
                    }
                } catch (\Exception $e) {
                    $this->error("  ✗ Error: {$e->getMessage()}");
                    $skipCount++;
                }

                // Be polite to the server
                sleep(1);
            }

            $this->newLine();
            $this->info("Scraping completed!");
            $this->info("  Saved: {$successCount}");
            $this->info("  Skipped: {$skipCount}");

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error("Fatal error during scraping: {$e->getMessage()}");
            return Command::FAILURE;
        }
    }

    /**
     * Find the URL of the last page of the blog.
     */
    private function findLastPage(): ?string
    {
        try {
            $response = Http::timeout(30)->get(self::BLOG_BASE_URL);

            if (!$response->successful()) {
                $this->error("Failed to fetch blog page. Status: {$response->status()}");
                return null;
            }

            $crawler = new Crawler($response->body());

            // Try to find pagination links and get the last page
            // Common pagination patterns: .pagination, .page-numbers, nav.pagination
            $paginationSelectors = [
                '.pagination a',
                '.page-numbers',
                'nav.pagination a',
                '.wp-pagenavi a',
                'a.page-numbers',
            ];

            $lastPageNumber = 1;
            $lastPageUrl = self::BLOG_BASE_URL;

            foreach ($paginationSelectors as $selector) {
                try {
                    $links = $crawler->filter($selector);
                    
                    if ($links->count() > 0) {
                        $links->each(function (Crawler $node) use (&$lastPageNumber, &$lastPageUrl) {
                            $href = $node->attr('href');
                            $text = trim($node->text());

                            // Check if it's a page number
                            if (is_numeric($text) && (int)$text > $lastPageNumber) {
                                $lastPageNumber = (int)$text;
                                $lastPageUrl = $href;
                            }

                            // Check for "last" or "»" links
                            if (preg_match('/page\/(\d+)/', $href, $matches)) {
                                $pageNum = (int)$matches[1];
                                if ($pageNum > $lastPageNumber) {
                                    $lastPageNumber = $pageNum;
                                    $lastPageUrl = $href;
                                }
                            }
                        });
                        
                        if ($lastPageNumber > 1) {
                            break;
                        }
                    }
                } catch (\Exception $e) {
                    continue;
                }
            }

            // If no pagination found, assume single page
            if ($lastPageNumber === 1) {
                $this->warn("No pagination found. Using the main blog page.");
                return self::BLOG_BASE_URL;
            }

            return $lastPageUrl;

        } catch (\Exception $e) {
            $this->error("Error finding last page: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Get article URLs from a blog listing page.
     */
    private function getArticleUrlsFromPage(string $pageUrl, int $limit): array
    {
        try {
            $response = Http::timeout(30)->get($pageUrl);

            if (!$response->successful()) {
                return [];
            }

            $crawler = new Crawler($response->body());
            $articleUrls = [];

            // Common selectors for article links in blog listings
            $articleSelectors = [
                'article a[href*="/blog"]',
                '.post a[href*="/blog"]',
                '.blog-post a',
                'h2 a',
                '.entry-title a',
                'article h2 a',
                '.post-title a',
                'a[href*="beyondchats.com"][href*="blog"]',
            ];

            foreach ($articleSelectors as $selector) {
                try {
                    $links = $crawler->filter($selector);
                    
                    if ($links->count() > 0) {
                        $links->each(function (Crawler $node) use (&$articleUrls, $limit) {
                            if (count($articleUrls) >= $limit) {
                                return;
                            }

                            $href = $node->attr('href');
                            
                            // Validate URL and avoid duplicates
                            if ($href && 
                                !in_array($href, $articleUrls) && 
                                strpos($href, 'beyondchats.com') !== false &&
                                !preg_match('/\/(category|tag|author|page)\//', $href)) {
                                $articleUrls[] = $href;
                            }
                        });

                        if (count($articleUrls) >= $limit) {
                            break;
                        }
                    }
                } catch (\Exception $e) {
                    continue;
                }
            }

            // Take the oldest articles (last ones in the list from last page)
            return array_slice($articleUrls, -$limit);

        } catch (\Exception $e) {
            $this->error("Error getting article URLs: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Scrape a single article page.
     */
    private function scrapeArticle(string $url): ?array
    {
        try {
            $response = Http::timeout(30)->get($url);

            if (!$response->successful()) {
                return null;
            }

            $crawler = new Crawler($response->body());

            // Extract title
            $title = $this->extractTitle($crawler);
            if (!$title) {
                $this->warn("  Could not extract title from: {$url}");
                return null;
            }

            // Extract content
            $content = $this->extractContent($crawler);
            if (!$content) {
                $this->warn("  Could not extract content from: {$url}");
                return null;
            }

            // Extract optional fields
            $author = $this->extractAuthor($crawler);
            $publishedAt = $this->extractPublishedDate($crawler);

            return [
                'title' => $title,
                'content' => $content,
                'original_url' => $url,
                'author' => $author,
                'published_at' => $publishedAt,
            ];

        } catch (\Exception $e) {
            $this->error("Error scraping article: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Extract the article title.
     */
    private function extractTitle(Crawler $crawler): ?string
    {
        $selectors = [
            'h1.entry-title',
            'article h1',
            '.post-title',
            'h1.post-title',
            '.blog-post h1',
            'h1',
        ];

        foreach ($selectors as $selector) {
            try {
                $element = $crawler->filter($selector)->first();
                if ($element->count() > 0) {
                    $title = trim($element->text());
                    if (!empty($title)) {
                        return $title;
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        return null;
    }

    /**
     * Extract the article content.
     */
    private function extractContent(Crawler $crawler): ?string
    {
        $selectors = [
            '.entry-content',
            'article .content',
            '.post-content',
            '.blog-content',
            'article',
            '.post-body',
        ];

        foreach ($selectors as $selector) {
            try {
                $element = $crawler->filter($selector)->first();
                if ($element->count() > 0) {
                    // Get HTML content and clean it
                    $html = $element->html();
                    $content = $this->cleanContent($html);
                    
                    if (!empty($content) && strlen($content) > 100) {
                        return $content;
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        return null;
    }

    /**
     * Clean HTML content - remove scripts, styles, and convert to clean text.
     */
    private function cleanContent(string $html): string
    {
        // Remove scripts and styles
        $html = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $html);
        $html = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', '', $html);
        
        // Remove navigation, footer, and sidebar elements
        $html = preg_replace('/<nav\b[^>]*>(.*?)<\/nav>/is', '', $html);
        $html = preg_replace('/<footer\b[^>]*>(.*?)<\/footer>/is', '', $html);
        $html = preg_replace('/<aside\b[^>]*>(.*?)<\/aside>/is', '', $html);
        
        // Remove social share buttons and related post sections
        $html = preg_replace('/<div[^>]*class="[^"]*share[^"]*"[^>]*>(.*?)<\/div>/is', '', $html);
        $html = preg_replace('/<div[^>]*class="[^"]*social[^"]*"[^>]*>(.*?)<\/div>/is', '', $html);
        $html = preg_replace('/<div[^>]*class="[^"]*related[^"]*"[^>]*>(.*?)<\/div>/is', '', $html);

        // Convert HTML to text while preserving some structure
        $html = preg_replace('/<br\s*\/?>/i', "\n", $html);
        $html = preg_replace('/<\/p>/i', "\n\n", $html);
        $html = preg_replace('/<\/h[1-6]>/i', "\n\n", $html);
        $html = preg_replace('/<\/li>/i', "\n", $html);

        // Strip remaining tags
        $text = strip_tags($html);
        
        // Clean up whitespace
        $text = preg_replace('/[ \t]+/', ' ', $text);
        $text = preg_replace('/\n{3,}/', "\n\n", $text);
        
        // Remove trailing standalone numbers (like share counts: "110", "25", etc.)
        $text = preg_replace('/(\n\s*\d{1,4}\s*)+$/s', '', $text);
        
        // Final trim
        $text = trim($text);

        return $text;
    }

    /**
     * Extract the author name.
     */
    private function extractAuthor(Crawler $crawler): ?string
    {
        $selectors = [
            '.author-name',
            '.post-author',
            '.entry-author',
            '[rel="author"]',
            '.byline',
            '.author a',
        ];

        foreach ($selectors as $selector) {
            try {
                $element = $crawler->filter($selector)->first();
                if ($element->count() > 0) {
                    $author = trim($element->text());
                    if (!empty($author) && strlen($author) < 100) {
                        return $author;
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        return null;
    }

    /**
     * Extract the published date.
     */
    private function extractPublishedDate(Crawler $crawler): ?Carbon
    {
        $selectors = [
            'time[datetime]',
            '.post-date',
            '.entry-date',
            '.published',
            'meta[property="article:published_time"]',
        ];

        foreach ($selectors as $selector) {
            try {
                $element = $crawler->filter($selector)->first();
                if ($element->count() > 0) {
                    // Try datetime attribute first
                    $datetime = $element->attr('datetime') ?? $element->attr('content');
                    
                    if ($datetime) {
                        return Carbon::parse($datetime);
                    }

                    // Try text content
                    $text = trim($element->text());
                    if (!empty($text)) {
                        return Carbon::parse($text);
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        return null;
    }

    /**
     * Save article to database, avoiding duplicates.
     */
    private function saveArticle(array $data): bool
    {
        // Check if article already exists
        $exists = Article::where('original_url', $data['original_url'])->exists();
        
        if ($exists) {
            return false;
        }

        Article::create($data);
        return true;
    }
}
