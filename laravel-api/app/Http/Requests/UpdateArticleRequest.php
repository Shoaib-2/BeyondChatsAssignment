<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateArticleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $articleId = $this->route('article');

        return [
            'title' => 'sometimes|required|string|max:500',
            'content' => 'sometimes|required|string',
            'original_url' => [
                'sometimes',
                'required',
                'url',
                Rule::unique('articles', 'original_url')->ignore($articleId),
            ],
            'published_at' => 'nullable|date',
            'author' => 'nullable|string|max:255',
            'is_updated' => 'sometimes|boolean',
            'optimized_content' => 'nullable|string',
            'references' => 'nullable|array',
            'references.*.title' => 'required_with:references|string',
            'references.*.url' => 'required_with:references|url',
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Article title is required.',
            'content.required' => 'Article content is required.',
            'original_url.required' => 'Original URL is required.',
            'original_url.url' => 'Original URL must be a valid URL.',
            'original_url.unique' => 'An article with this URL already exists.',
            'published_at.date' => 'Published date must be a valid date.',
            'is_updated.boolean' => 'is_updated must be a boolean value.',
            'references.array' => 'References must be an array.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'data' => $validator->errors()
        ], 422));
    }
}
