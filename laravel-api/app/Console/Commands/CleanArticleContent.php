<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Article;

class CleanArticleContent extends Command
{
    protected $signature = 'articles:clean';
    protected $description = 'Clean trailing numbers and whitespace from article content';

    public function handle(): int
    {
        $this->info('Cleaning article content...');
        
        $articles = Article::all();
        $cleaned = 0;
        
        foreach ($articles as $article) {
            $original = $article->content;
            
            // Remove trailing standalone numbers (share counts, etc.)
            $content = preg_replace('/(\n\s*\d{1,4}\s*)+$/s', '', trim($article->content));
            
            if ($content !== $original) {
                $article->content = $content;
                $article->save();
                $cleaned++;
                $this->info("  ✓ Cleaned: {$article->title}");
            }
        }
        
        $this->info("Done! Cleaned {$cleaned} article(s).");
        return Command::SUCCESS;
    }
}
