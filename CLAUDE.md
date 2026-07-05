# SpeakToEva.com — Website + Call App

This repo serves two things:
1. **Landing page** at speaktoeva.com (`/`)
2. **Blower call app** at speaktoeva.com/call (`/call`)

Auto-deploys via Vercel when you push to GitHub.

---

## Architecture (Three Layers)

```
speaktoeva.com/call (Vercel)          speaktoeva.com/ (Vercel)
   React frontend                       Landing page
        │
        ▼
blower-api-production.up.railway.app (Railway)
   Express backend — business logic, auth, API
        │
        ▼
Supabase (project zwtbcrkpdpwwptbkujxp, "blower" schema)
   PostgreSQL — leads, calls, dispositions, follow-ups, texts
   THIS IS THE CRM
```

**Frontend:** React + TypeScript + Vite + Tailwind, hosted on Vercel
**Backend:** Express.js on Railway (`blower-api-production.up.railway.app`)
**Database:** Supabase PostgreSQL (`blower` schema)

---

## Workflow

```bash
# Frontend changes (landing page or call app):
git add . && git commit -m "message" && git push   # Vercel auto-deploys (~15s)

# Backend changes: deployed separately on Railway
vercel                                              # Vercel CLI (logs, domains)
gh repo view                                        # GitHub info
```

**GitHub repo:** github.com/edwardtogher/speaktoeva-website

---

## Landing Page (/)

### Key Files

| File | What It Controls |
|------|------------------|
| `client/src/components/Hero.tsx` | Main landing page content |
| `client/src/components/EvaLogo.tsx` | Animated logo component |
| `client/src/components/EvaVoiceProvider.tsx` | Voice call integration (ElevenLabs) |
| `client/src/config/eva.ts` | ElevenLabs agent ID and booking link |
| `.env.local` | Environment variables (VAPI keys) |

### Features

- **Login button** -> dash.speaktoeva.com
- **Talk to EVA button** -> ElevenLabs voice demo
- **Book a Call** -> Cal.com link
- **Footer** -> Quick links + Legal links (Terms, Privacy, DPA) + Copyright + LinkedIn

### Legal Pages

| Route | File | Content |
|-------|------|---------|
| `/terms` | `client/src/pages/terms.tsx` | Terms of Service (17 sections) |
| `/privacy` | `client/src/pages/privacy.tsx` | Privacy Policy (13 sections) |
| `/dpa` | `client/src/pages/dpa.tsx` | Data Processing Addendum (13 sections) |

**Constants:** `client/src/lib/constants.ts` — `COMPANY_NAME`, `CONTACT_EMAIL`, `SITE_URL`, `JURISDICTION`, `LAST_UPDATED`. When the Ltd is registered, change `COMPANY_NAME` here and push — all three pages update automatically.

**Layout:** `client/src/components/legal/` — LegalLayout (shared wrapper with Navbar + Footer), TableOfContents (sticky sidebar desktop, collapsible mobile), ScrollToTop, BackToTop.

**Analytics:** Vercel Web Analytics is cookieless — no cookie banner needed. No cookies, localStorage, or fingerprinting. PECR does not apply.

**Navbar/Footer:** Nav links use `<a href="/#section">` format so they work from legal pages (not just scroll-to buttons).

---

## Blower Call App (/call)

Mobile-first cold calling app for Ed and his team to blitz UK physio/chiro/osteo leads. Installed as an iOS PWA.

### Key Files (Frontend)

| File | What It Does |
|------|-------------|
| `client/src/pages/blower.tsx` | Page shell (auth gate, renders BlowerLogin or BlowerApp) |
| `client/src/components/blower/BlowerApp.tsx` | Main orchestrator — 4 views: batches, dialler, history, pipeline |
| `client/src/components/blower/BlowerLogin.tsx` | Login screen |
| `client/src/components/blower/LeadCard.tsx` | Lead display + Call/Text buttons in dialler |
| `client/src/components/blower/LeadList.tsx` | Scrollable filtered lead list |
| `client/src/components/blower/CallingMode.tsx` | Full-screen overlay during a call — script, disposition buttons, notes |
| `client/src/components/blower/PipelineView.tsx` | CRM pipeline for interested leads (drag-and-drop between stages) |
| `client/src/components/blower/BatchCard.tsx` | Batch card on home screen |
| `client/src/components/blower/ProgressHeader.tsx` | Sticky header with stats, back button, logout |
| `client/src/components/blower/HistoryView.tsx` | Past call sessions with individual call log |
| `client/src/components/blower/MilestoneOverlay.tsx` | Celebration animations at call milestones |

### Home Screen Layout (top to bottom)

1. **Interested** (green) — Pipeline card. Tap to enter CRM pipeline view. Shows stage breakdown.
2. **Gold** (amber) — Follow-up leads (no-answer leads that need calling back). Auto-calculated callbacks.
3. **Batches** (indigo) — Cold lead batches. Tap a batch to enter its dialler.

### Gold Section (Follow-Up Queue)

Leads who didn't answer get queued in Gold with auto-calculated callback times. The follow-up cadence is:

**7 calls + 3 texts over 14 days:**
- Day 0: Initial call
- Day 1: Text #1
- Day 2: Call #2
- Day 4: Call #3 + Text #2
- Day 7: Call #4
- Day 9: Call #5 + Text #3
- Day 11: Call #6
- Day 14: Call #7 (final attempt)

Leads cycle through Gold until the cadence completes or they pick up.

### Pipeline Stages

Interested leads progress: **Send Demo** -> **Demo Sent** -> **Booked** -> **Won**. Leads can be moved via advance buttons or drag-and-drop (long-press 300ms to pick up).

---

## CRM (Supabase — blower schema)

**Project:** zwtbcrkpdpwwptbkujxp
**Schema:** `blower`

When Ed says "CRM" he means this database. All leads, call history, dispositions, follow-up schedules, and text logs live here.

The Railway backend bridges the frontend to Supabase via `/api/state/:userId` endpoints.

**Note:** This is separate from Eva's CRM (`public` schema, contacts/interactions tables) which is for people Eva should recognise on inbound calls.

---

## Railway Backend

**URL:** blower-api-production.up.railway.app

Express server with business logic. Key endpoint pattern:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/state/:userId` | Fetch user's full state from Supabase |
| `POST /api/state/:userId` | Save user's state to Supabase |
| `POST /api/leads/import` | Bulk import new leads into the CRM |

### Adding New Lead Batches

1. Compile leads (from Indeed, Reed, Google Ads library, etc.)
2. Format as JSON array with required fields (name, phone, type, town, batch, etc.)
3. `POST /api/leads/import` to the Railway backend
4. Leads appear in the call app under the specified batch

---

## Multi-User System

- Each user has credentials stored in the backend
- State is per-user in Supabase (keyed by userId)
- **Known gap:** Batches show globally on home screen regardless of assigned leads. When onboarding new users, either filter batches to only show ones containing that user's leads, or add an `assignedBatches` field.

---

## Design System

Apple News-inspired iOS look:
- Background: `#F2F2F7` (iOS system gray)
- Cards: `bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]`
- Brand colour: `indigo-600` (Eva blue)
- Font: Inter
- Touch targets: min 44x44px
- Swipe-back gesture on all sub-views (left 50px edge)

### PWA Notes

- Manifest at `client/public/manifest.json` (standalone mode, start_url: /call)
- iOS standalone PWAs cache aggressively — users must delete and re-add from home screen to get updates
- No service worker — just iOS standalone mode behaviour

---

## Retired Predecessors

- **cold-call-crm/** (Python/Streamlit, SQLite, localhost:5001) — replaced by this app
- **uk-dialler/** (single HTML page, localStorage, 40 leads) — replaced by this app

---

## Notes

- Originally built on Replit, migrated to GitHub/Vercel 14 Jan 2026
- Replit remnants in `.local/` folder (can ignore)
- `attached_assets/` has images used on the site

## When Ed Says...

| Request | What to Do |
|---------|------------|
| "Update the website" | Edit relevant files, commit, push |
| "Change the headline" | Edit `client/src/components/Hero.tsx` |
| "Check if site is working" | Visit speaktoeva.com or run `vercel` |
| "Show me the code" | Read files in `client/src/` |
| "Add leads to the CRM" | Format JSON, POST /api/leads/import to Railway backend |
| "Check the CRM" | Query Supabase blower schema |
