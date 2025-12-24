<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'original_url' => $this->original_url,
            'published_at' => $this->published_at?->toIso8601String(),
            'author' => $this->author,
            'is_updated' => $this->is_updated,
            'optimized_content' => $this->optimized_content,
            'references' => $this->references,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }

    /**
     * Customize the response for the resource.
     */
    public function with(Request $request): array
    {
        return [
            'success' => true,
        ];
    }
}
