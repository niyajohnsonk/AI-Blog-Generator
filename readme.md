# YT Blog Generator

Turn any YouTube video into a full blog post using AI.

Paste a YouTube link, and the app fetches the video transcript, sends it to Gemini, and generates a structured blog post — which gets saved to your personal dashboard.

## Features

- Generate a blog post from any YouTube video with captions
- User authentication (sign up / log in)
- Personal dashboard to view all past generated blogs

## Tech Stack

- **Frontend & Backend** — Next.js (App Router)
- **Styling** — Tailwind CSS
- **AI** — Google Gemini API
- **Database & Auth** — Supabase
- **Deployment** — Vercel

## Getting Started

1. Clone the repo
2. Install dependencies with `npm install`
3. Create a `.env.local` file in the root with the following:
```
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Where to get it |
|---|---|
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings → API |
