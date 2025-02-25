# PaperSphere

A modern application for exploring, summarizing, and discussing academic research papers from arXiv.

## Overview

PaperSphere fetches the latest papers from arXiv, generates concise AI summaries, and provides a social platform for researchers to discuss and share insights about academic publications.

## Features

- Browse the latest research papers from arXiv
- AI-generated summaries that make complex papers more accessible
- Like, dislike, comment, and share papers
- Infinite scroll for seamless browsing experience
- External links to original arXiv papers

## Tech Stack

### Backend
- FastAPI - Python web framework
- Supabase - Database storage
- OpenAI/LM Studio integration - AI-powered paper summaries
- arXiv API - Research paper data source

### Frontend
- React 19
- React Router 7
- TailwindCSS - Styling
- Lucide React - UI icons
- React Intersection Observer - Infinite scrolling

## Project Structure

```
└── jackgladowsky-papersphere/
    ├── README.md
    ├── backend/
    │   ├── database.py      # Supabase connection setup
    │   ├── fetch_papers.py  # arXiv API integration & AI summaries
    │   ├── main.py          # FastAPI endpoints
    │   └── test_db.py       # Database connection testing
    └── frontend/
        ├── public/          # Static assets
        └── src/
            ├── components/  # Reusable UI components
            │   ├── Navbar.jsx
            │   ├── PaperCard.jsx
            │   └── PaperList.jsx
            └── pages/       # Route components
                ├── PaperDetails.jsx
                ├── ProfilePage.jsx
                └── SearchPage.jsx
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Supabase account

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install fastapi uvicorn httpx feedparser python-dotenv supabase openai
   ```

4. Create a `.env` file with your credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   OPENROUTER_API_KEY=your_openai_key
   LM_STUDIO_URL=your_lm_studio_url  # Optional if using LM Studio
   ```

5. Run the FastAPI server:
   ```
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

## API Endpoints

- `GET /papers` - Fetch paginated papers
  - Query params:
    - `page` (default: 1) - Page number
    - `limit` (default: 10) - Results per page

## Database Schema

The `papers_test` table includes:
- `arxiv_id` - Unique paper identifier
- `title` - Paper title
- `authors` - Comma-separated list of authors
- `abstract` - Original paper abstract
- `summary` - AI-generated summary
- `category` - Paper category/subject
- `url` - Link to original arXiv paper
- `published_at` - Publication timestamp

## Future Enhancements

- User authentication and profiles
- Paper recommendations based on reading history
- Advanced search functionality
- Comments and discussion threads
- Paper collections/bookmarks

## License

MIT

## Contact

For questions or feedback, please open an issue on this repository.