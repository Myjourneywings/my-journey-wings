# My Journey Wings Travel Services — Website Starter

This is the first frontend starter for `mjwtrading.com`. It uses React + Vite and Supabase Auth/Database, and is designed for static hosting on Cloudflare Pages.

## Included
- Branded responsive login page
- Supabase email/password authentication
- Authenticated dashboard shell
- Summary cards and recent verification cases
- Navigation for four verification modules
- Team, reports, leaderboard and settings placeholders

Some navigation sections are placeholders. Case creation/editing, staff administration, document upload and full reports must be implemented and tested in later development steps.

## Configure Supabase
1. In Supabase, open Project Settings → API.
2. Copy the Project URL and the publishable key (or legacy anon/public key).
3. Copy `.env.example` to `.env.local`.
4. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Never put a `service_role` or secret key in this frontend.

## Run locally
Install Node.js 20 or newer:
```bash
npm install
npm run dev
```
For a production build:
```bash
npm run build
```
The static output is in `dist/`.

## Upload to GitHub
Extract this ZIP. In your GitHub repository choose **Add file → Upload files**, drag the extracted files and folders into the page, then commit to the main branch. Include `.gitignore` and `.env.example`. Do not upload `.env.local`.

## Deploy to Cloudflare Pages
1. Cloudflare → Workers & Pages → Create application → Pages → Connect to Git.
2. Select your GitHub repository.
3. Framework preset: Vite.
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Pages environment variables.
7. Deploy.

Then Pages → Custom domains → add `mjwtrading.com` and follow Cloudflare's prompts.

## Before production
- Set Supabase Auth Site URL and allowed redirect URLs to the final domain.
- Review and test Row Level Security on every table and Storage bucket.
- Test role boundaries with admin, manager, agent and viewer accounts.
- Use private storage and short-lived signed URLs for document access.
- Do not use real customer data until security tests pass.
