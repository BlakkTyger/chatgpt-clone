# ChatGPT Clone

The ChaGPT Clone features robust user authentication, persistent chat history.

## Setup

Follow these steps to set up and run the project on your local machine. This guide is compatible with macOS, Windows (using WSL), and Linux.
1. Prerequisites
- Node.js (v18 or later)
- npm or yarn

2. Installation & Setup

**Clone the Repository:**
```
git clone https://github.com/BlakkTyger/chatgpt-clone.git
cd chatgpt-clone
```

**Install Dependencies:**
```
npm install
```

**Set Up Environment Variables:** Create a file named `.env.local` in the root of your project and add the following keys. Replace the placeholder values with your actual API keys.

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-public-anon-key>
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
```

**Set Up Supabase Database:** Go to the SQL Editor in your Supabase dashboard and run the following scripts to create the necessary tables and security policies.

```
Script 1: Create Tables

-- Create the 'chats' table
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create the 'messages' table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


Script 2: Set Up Row Level Security (RLS)

-- Policies for 'chats' table
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own chats." ON public.chats FOR ALL USING (auth.uid() = user_id);

-- Policies for 'messages' table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in their own chats." ON public.messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert messages in their own chats." ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);


Script 3: Enable Real-time

-- Create a publication for real-time updates
CREATE PUBLICATION supabase_realtime FOR TABLE public.chats, public.messages;

```
    
Configure Supabase Auth:
1. In your Supabase dashboard, go to Authentication -> Providers.
2. Enable the Email and GitHub providers.
3. For GitHub, you will need to provide a Client ID and Secret, which you can get by creating a new OAuth App in your GitHub developer settings. Set the callback URL to: https://<your-project-id>.supabase.co/auth/v1/callback.

**Run the Development Server:**
```
npm run dev
```

Open http://localhost:3000 in your browser to see the application.

---

## Features

- Multi-LLM Support: Seamlessly switch between different AI models (GPT-4, Gemini 1.5 Flash) for each chat session.
- Real-time Chat Interface: Messages appear instantly for a smooth, modern user experience, powered by Supabase Real-time subscriptions.
- Robust Authentication: Secure user sign-up and login using both email/password and social providers (GitHub), managed by Supabase Auth.
- Persistent Chat History: All authenticated chat sessions are saved to a Postgres database, allowing users to continue conversations later.
- Anonymous Chat Mode: A "no-login-required" chat mode that stores the conversation locally in the browser. This session is temporary and is cleared upon exit, ensuring privacy and not affecting the global memory.
- Efficient Message Loading: Chat history uses pagination (infinite scroll) to load messages on demand, ensuring fast initial load times even for very long conversations.
- Markdown & Code Rendering: AI responses are beautifully rendered with support for markdown, including styled code blocks with a "copy to clipboard" functionality.

## Tech Stack & Major Libraries
- Framework: Next.js (App Router)
- Backend & Database: Supabase (Postgres, Auth, Real-time)
- Styling: Tailwind CSS with shadcn/ui for components.
- LLM Providers: OpenAI, Google AI
- UI State Management: React Hooks (useState, useEffect, useCallback)
- Notifications: sonner for toast notifications.
- Markdown Rendering: react-markdown with react-syntax-highlighter.

---

## Project Structure

📁 Project Structure

```
.
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # Server-side API for LLM & Mem0 calls
│   ├── auth/
│   │   └── ...                 # Authentication pages & logic
│   ├── chat/
│   │   └── [chatId]/      # Unified route for new & existing chats
│   │       ├── _components/    # Components for the chat page
│   │       └── page.tsx        # Main chat page component
│   ├── anonymous-chat/
│   │   ├── _components/        # Components for anonymous chat
│   │   └── page.tsx            # Anonymous chat page component
│   └── page.tsx                # Root homepage
├── components/
│   ├── sidebar/                # Sidebar components (chat list, user menu)
│   └── ui/                     # Reusable UI components (shadcn/ui)
├── hooks/
│   ├── use-api-mutation.ts     # Hook for managing API loading states
│   └── useUser.ts              # Hook for getting the current Supabase user
├── lib/
│   └── types.ts                # Global TypeScript definitions
├── utils/
│   └── index.ts                # Supabase client helpers
├── types/
|   └── index.ts/               # Databse Schema Definitions
├── .env.local                  # Environment variables (KEEP SECRET)
└── middleware.ts               # Protects routes from unauthenticated access
```


## Architecture

### High Level Architecture

The application is built on a modern, server-centric architecture using the Next.js App Router.

- Frontend: The UI is built with React Server Components (for initial page loads) and Client Components (for interactive elements). This hybrid approach provides excellent performance and a dynamic user experience.
- Backend-as-a-Service (BaaS): Supabase serves as the core backend, handling the database, user authentication, and real-time messaging. This significantly simplifies development by abstracting away complex backend infrastructure.
- API Layer: A dedicated Next.js API Route (/api/chat) acts as a secure orchestrator.
- Decision: All LLM and Mem0 API calls are made from this server-side route. This was a crucial security decision to avoid exposing sensitive API keys on the client-side.
- Anonymous vs. Authenticated Logic:
  - Authenticated: The API uses the user's Supabase UID to fetch and save global memories and the chatId for session-specific memories.
  - Anonymous: The userId is null. The frontend generates a temporary sessionId which is passed to the API. This ensures that anonymous chats only interact with session-specific memory and do not pollute the global context.


### Security
- Row Level Security (RLS): RLS is enabled on all tables, ensuring that users can only access and modify their own data. This is the cornerstone of the application's data security.
- Environment Variables: All sensitive API keys are stored in .env.local and are only accessed on the server-side, preventing them from being exposed to the client.
- Server-Side API: All interactions with external services (OpenAI, Google, Mem0) are handled through a dedicated API route, which acts as a secure proxy.

### Performance and Scalability
- Pagination: The chat history is paginated, loading only the most recent messages first. This keeps the initial bundle size small and the UI responsive, even for very long conversations.
- Serverless Architecture: By leveraging Next.js and Supabase, the application is deployed on a serverless infrastructure that can automatically scale to handle traffic spikes without manual intervention.
- Optimistic UI Updates: When a user sends a message, it appears in the UI instantly while the backend processing happens in the background. This provides a fast, responsive feel.

### Error Handling
- API Layer: The /api/chat route uses try...catch blocks to handle potential failures from LLM or Mem0 services, returning a structured JSON error with a 500 status code.
- Frontend: The frontend uses try...catch blocks when making fetch requests. User-facing errors are displayed using non-intrusive toast notifications (sonner).

### Future Improvements
1. Response Streaming
2. Mem0 based memory layer for global context and session-based context
3. Think Longer, Web Search and Deep Research
4. File uploads and Simple Retrieval pipeline
5. Google Drive and One Drive File System integrations
6. Search Chat feature
7. More Models (Groq, HuggingFace etc)
8. Follow Up Questions
9. Greater Observability on frontend (verbose like "Thinking...", "Fetching information from wikipedia" etc)
10. Voice Input
11. Copy Response
12. Like/Dislike Response
13. Read Aloud
14. Switch Model and regenerate