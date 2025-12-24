<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'content',
        'original_url',
        'published_at',
        'author',
        'is_updated',
        'optimized_content',
        'references',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'published_at' => 'datetime',
        'is_updated' => 'boolean',
        'references' => 'array',
    ];

    /**
     * Scope to get only updated/optimized articles.
     */
    public function scopeOptimized($query)
    {
        return $query->where('is_updated', true);
    }

    /**
     * Scope to get articles ordered by most recent publication date first.
     */
    public function scopeLatestFirst($query)
    {
        return $query->orderBy('published_at', 'desc');
    }
}
