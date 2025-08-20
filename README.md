## NoteSnap — Manage Your Notes

### Highlights

- **Desktop app**: create, edit (Markdown/TipTap), delete, and view notes
- **Companion link** per note: open on your phone, upload/take a photo
- **Real-time sync**: images appear live in the editor via Supabase Realtime
- **Auth**: Email/password and GitHub via Better Auth + MongoDB

---

## Architecture

- **Web**: Next.js (App Router), React, TipTap editor
- **Auth**: `better-auth` with `mongodbAdapter` (MongoDB)
- **Notes data**: MongoDB (Mongoose)
- **Images + real-time**: Supabase Storage + Realtime (Postgres)
- **Sync**: inserts in the `note_images` table trigger Realtime events consumed by desktop and companion

Main flow (photo → note):

1. Companion (mobile) sends `POST /api/upload-image` with `{ noteId, fileBase64, fileName }`
2. API converts base64 to a file and uploads to the `note-images` bucket
3. API inserts a row in `public.note_images` with `note_id` and `file_url`
4. Realtime channel `note-images-{noteId}` emits an `INSERT` event
5. Desktop editor listens to the channel and injects the image into TipTap

---

## Data Models

### Diagram (high level)

```text
[MongoDB]                         [Supabase]
 notes (collection)               public.note_images (table)
   _id  (ObjectId)   <----text----  note_id (text)
   title (string)                  file_url (text)
   ...                             created_at (timestamptz)

 Storage bucket: note-images
  notes/{noteId}/{timestamp}-{fileName}  -> public URL (file_url)
```

### MongoDB — Notes (`Note`)

```text
notes (collection)
- _id: ObjectId (PK)
- title: string (required)
- content: string | null
- tags: string[]
- images: string[]
- userId: ObjectId (ref User, required)
- createdAt: Date (default now)
- updatedAt: Date (default now)
```

Source: `src/models/note.model.ts`

### Supabase — Images table (`note_images`) and Storage

```text
public.note_images (table)
- id: bigint (PK, auto)           -- or uuid, if you prefer
- note_id: text (Mongo ObjectId as string)
- file_url: text (public URL from Storage)
- created_at: timestamptz (default now())

Storage bucket: note-images (public)
path: notes/{noteId}/{timestamp}-{fileName}
```

Reference SQL (adjust to your Supabase instance):

```sql
-- Table for Realtime events
create table if not exists public.note_images (
  id bigint generated always as identity primary key,
  note_id text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

-- Add table to Realtime publication (if needed)
alter publication supabase_realtime add table public.note_images;

-- Public storage bucket (for simplicity in this POC)
select storage.create_bucket('note-images', public => true);

-- Basic policies (public read/upload; tighten for production)
create policy "Public read note-images" on storage.objects
  for select using (bucket_id = 'note-images');

create policy "Public upload note-images" on storage.objects
  for insert with check (bucket_id = 'note-images');

create policy "Public update own note-images" on storage.objects
  for update using (bucket_id = 'note-images');
```

Note: For production, restrict access with proper RLS and/or use a service role on the backend. This project uses the `ANON_KEY` for simplicity.

---

## Environment Variables

Create a `.env.local` file at the project root (or set these in your hosting platform):

```bash
# MongoDB (Better Auth + app data)
DATABASE_URL="mongodb://localhost:27017/notesnap"

# Better Auth
BETTER_AUTH_SECRET=<JWT>
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Social auth (GitHub)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Supabase (Client/Anon)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Host/Port used to generate the Companion QR
NEXT_PUBLIC_HOST="http://localhost"
NEXT_PUBLIC_PORT="3000"
```

Tips:

- `DATABASE_URL` must point to a MongoDB instance reachable by the server
- For GitHub OAuth, create an app in GitHub `Settings → Developer settings → OAuth Apps` and configure the callback URL for your domain (Next.js Better Auth handler)
- In Supabase, create the `note-images` bucket and the `note_images` table as described above

---

## Run locally

Prerequisites:

- Node.js 20+
- MongoDB (local or remote). Docker tip:

```bash
docker run -d \
  --name notesnap-mongo \
  -p 27017:27017 \
  -v notesnap-mongo:/data/db \
  mongo:7
```

```bash
pnpx supabase start
```

Steps:

```bash
# 1) Install deps
pnpm install

# 2) Configure .env.local (see env section)

# 3) Run dev server
pnpm run dev

# 4) Open the app
# http://localhost:3000
```

Build and local production:

```bash
pnpm run build
pnpm run start
```

---

## Tests

- Unit tests with Vitest
- Mocks to avoid real calls to Mongo and Supabase

Commands:

```bash
# One-off (CI)
pnpm test

# Watch (dev)
pnpm run test:watch

# Coverage
pnpm run test:coverage
```

Tip: `src/__tests__/test.setup.ts` injects default env vars and Buffer into the test environment.

---

## Endpoints and main routes

- `POST /api/upload-image`

  - Body: `{ noteId: string, fileBase64: string, fileName: string }`
  - Effect: uploads to `note-images` (Storage) and inserts a row in `public.note_images`
  - Response: `{ fileUrl: string }`

- Main pages:
  - `GET /notes` — notes list and editor (desktop)
  - `GET /companion/[id]` — mobile companion for note `[id]`
  - `GET /(auth)/sign-in`, `GET /(auth)/sign-up` — authentication

---

## How to use (user flow)

1. Go to `/sign-up` and create an account (or sign in).
2. Navigate to `/notes`, create a note and open it.
3. Click "Snap" to reveal the Companion QR Code.
4. Scan the QR with your phone (or copy the link) to open `/companion/[noteId]` on mobile.
5. Take/select a photo on mobile; it appears in real time in the desktop editor.

Requirements for the QR to work locally:

- Set `NEXT_PUBLIC_HOST` and `NEXT_PUBLIC_PORT` (e.g., `http://localhost` and `3000`).
- Your phone must reach the host (use your machine's LAN IP if needed).

Local network example:

```env
NEXT_PUBLIC_HOST="http://192.168.0.10"
NEXT_PUBLIC_PORT="3000"
```

---

## Next Step

- Mongo indexes for `userId` queries
- UX improvements in companion (progress feedback, image compression)
- Support additional formats (HEIC → JPEG)
