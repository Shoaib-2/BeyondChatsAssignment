# BeyondChats Frontend

A React-based frontend for displaying original and optimized articles from BeyondChats blog.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering

## Features

### Home Page
- Paginated list of articles
- Article cards showing title, excerpt, date, and author
- "Optimized" badge for AI-enhanced articles
- Smooth animations and transitions
- Loading skeletons for better UX
- Error handling with retry functionality

### Article Detail Page
- Full article content with markdown rendering
- Toggle between original and optimized content
- Reference sources section (for optimized articles)
- Responsive typography
- Back navigation

### UI/UX
- Fully responsive design
- Accessible HTML structure
- Loading states with skeleton animations
- Error states with retry options
- Smooth page transitions

## Setup

### Prerequisites
- Node.js >= 18
- Laravel API running on `http://localhost:8000`

### Installation

```bash
# Navigate to frontend directory
cd react-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Available Scripts

```bash
npm run dev      # Start development server on port 3000
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ArticleCard.jsx      # Article preview card
│   ├── ContentToggle.jsx    # Original/Optimized toggle
│   ├── ErrorState.jsx       # Error display component
│   ├── Footer.jsx           # Site footer
│   ├── Header.jsx           # Site header with navigation
│   ├── Layout.jsx           # Main layout wrapper
│   ├── LoadingSkeleton.jsx  # Loading placeholders
│   ├── MarkdownRenderer.jsx # Markdown content renderer
│   ├── Pagination.jsx       # Page navigation
│   └── ReferencesSection.jsx # Reference sources display
├── pages/               # Page components
│   ├── HomePage.jsx         # Articles listing
│   ├── ArticleDetailPage.jsx # Single article view
│   └── NotFoundPage.jsx     # 404 page
├── services/            # API services
│   └── api.js               # Axios API client
├── App.jsx              # Root component with routes
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## API Integration

The frontend connects to the Laravel API at the configured base URL:

### Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | Get paginated articles |
| GET | `/api/articles/{id}` | Get single article |

### Response Format

```json
{
  "success": true,
  "data": {...},
  "message": "Human readable message",
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 5
  }
}
```

## Styling

The app uses Tailwind CSS with custom configuration:

- Custom color palette (primary blue shades)
- Custom typography settings for article content
- Responsive breakpoints
- Custom utility classes for common patterns

## Animations

Framer Motion is used for:
- Page transitions
- Card hover effects
- Loading states
- Content toggle animations
- Error/empty state reveals

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
