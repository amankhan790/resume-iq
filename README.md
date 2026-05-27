# ResumeIQ

![ResumeIQ banner](public/banner.png)

ResumeIQ is a resume upload and analysis app that scores your resume against a job description and stores the report for later review.

## What this app does
- Upload PDF, PNG, or JPG resumes and extract text client-side.
- Analyze the resume against a job description using a Supabase Edge Function and Gemini.
- Store analysis results in Supabase and display a detailed report.
- Provide Clerk-based authentication for sign-in and user sessions.
- Show featured resume examples on the landing page.

## How it works
1. The user signs in with Clerk and opens the upload flow.
2. The resume is parsed with `pdfjs-dist` on the client.
3. The app calls a Supabase Edge Function that sends the prompt to Gemini.
4. The response is saved to the `resumes` table and shown in the report view.

## Tech stack
- React 19 + Vite
- Tailwind CSS v4 + shadcn/ui primitives
- Clerk for auth
- Supabase for database + Edge Functions
- Gemini 2.5 Flash for analysis
- pdfjs-dist for resume text extraction

## Routes
- `/` Landing page
- `/upload` Resume upload form
- `/resume/:id` Resume report

## Environment variables
Create a `.env` file in the project root and set:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For the Supabase Edge Function, set this secret in your Supabase project:

```
GEMINI_API_KEY=your_gemini_api_key
```

## Supabase tables
The app expects these tables:

### resumes
- `user_id` (text)
- `file_name` (text)
- `resume_text` (text)
- `job_title` (text)
- `job_description` (text)
- `company_name` (text)
- `score` (number)
- `feedback` (json)

## Supabase Edge Function
The Edge Function lives in `supabase/functions/analyze-resume` and expects:

```
{
	"resumeText": "...",
	"jobTitle": "...",
	"jobDescription": "...",
	"companyName": "..."
}
```

It returns JSON with `score`, `summary`, `strengths`, `improvements`, and `keywords_missing`.

## Getting started
```
npm install
npm run dev
```

## Scripts
- `npm run dev` Start the dev server
- `npm run build` Build for production
- `npm run preview` Preview the production build
