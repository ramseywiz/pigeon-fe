# CougarCS Pigeon

This repo serves as the frontend for CougarCS's Pigeon, an event management system. Learn more about CougarCS here: https://cougarcs.com. The backend repository contains details about the API, reminder scheduling, and Discord integrations.

Built using Vite, TypeScript, 

## Running Locally

Create a `.env` file at the project root with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5058
```

Then install dependencies and start the dev server:

```
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## FAQ

**Q: How does authentication work?**
A: Users sign in with Google OAuth through Supabase. The login page rejects non-CougarCS accounts at the OAuth redirect level. The Supabase session token is attached as a `Bearer` header on every API request to the backend. If you need access, reach out to the President or WebMaster.
