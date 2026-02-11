# SpeakToEva.com Website

Live website at speaktoeva.com. Auto-deploys via Vercel when you push to GitHub.

## Workflow

1. Edit files in this folder
2. Commit and push to GitHub
3. Vercel auto-deploys (~15 seconds)
4. Changes live at speaktoeva.com

**GitHub repo:** github.com/edwardtogher/speaktoeva-website

## Key Files to Edit

| File | What It Controls |
|------|------------------|
| `client/src/components/Hero.tsx` | Main landing page content |
| `client/src/components/EvaLogo.tsx` | Animated logo component |
| `client/src/components/VapiProvider.tsx` | Voice call integration |
| `client/src/config/vapi.ts` | VAPI keys and booking link |
| `.env.local` | Environment variables (VAPI keys) |

## Features

- **Login button** → dash.speaktoeva.com (Chat-Dash white label for Theo)
- **Talk to EVA button** → VAPI voice demo
- **Book a Call** → Cal.com link
- **Footer** → Copyright + LinkedIn link

## Tech Stack

- React + TypeScript
- Vite build
- Tailwind CSS
- VAPI for voice widget
- Hosted on Vercel

## Commands

```bash
# From this folder:
git add . && git commit -m "message" && git push   # Deploy changes
vercel                                              # Vercel CLI (logs, domains)
gh repo view                                        # GitHub info
```

## Blower — Cold Calling CRM (speaktoeva.com/call)

Mobile-first cold calling app for Ed and his team to blitz UK physio/chiro/osteo leads. Lives at `/call` route, installed as an iOS PWA.

### Architecture

100% client-side. No backend. All state in localStorage keyed by username. Lead data and user credentials compiled into the JS bundle. Auth is a simple client-side gate (not security-critical).

### Key Files

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
| `client/src/config/blower-leads.ts` | All leads + batch definitions (getBatches(), LEADS array) |
| `client/src/config/blower-users.ts` | User credentials + lead assignments |
| `client/src/hooks/use-blower-store.ts` | localStorage-backed state (dispositions, notes, stages, attempts, call log) |

### Home Screen Layout (top to bottom)

1. **Interested** (green) — Pipeline card. Tap to enter CRM pipeline view. Shows stage breakdown.
2. **Gold** (amber) — Follow-up leads (no-answer leads that need calling back). Tap to enter Gold dialler.
3. **Batches** (indigo) — Cold lead batches. Tap a batch to enter its dialler.

### Pipeline Stages

Interested leads progress: **Send Demo** → **Demo Sent** → **Booked** → **Won**. Leads can be moved via advance buttons or drag-and-drop (long-press 300ms to pick up).

### Multi-User System

- Each user defined in `blower-users.ts` with username, password, and `assignedLeadIds` ("all" or specific ID array)
- State is per-user in localStorage (keyed by username)
- **Known gap:** Batches show globally on home screen regardless of assigned leads. When onboarding new users, either filter batches to only show ones containing that user's leads, or add an `assignedBatches` field to user config.

### Adding Leads

Edit `blower-leads.ts`. Each lead: `{ id, name, type, town, phone, website, notes, batch }`. Add to appropriate batch in the batches array.

### Adding Users

Edit `blower-users.ts`. Add entry with `{ username, password, assignedLeadIds }`. Push to deploy.

### Design System

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

## Notes

- Originally built on Replit, migrated to GitHub/Vercel 14 Jan 2026
- Replit remnants in `.local/` folder (can ignore)
- `attached_assets/` has images used on the site
- `design_guidelines.md` has original design specs from Replit

## When Ed Says...

| Request | What to Do |
|---------|------------|
| "Update the website" | Edit relevant files, commit, push |
| "Change the headline" | Edit `client/src/components/Hero.tsx` |
| "Check if site is working" | Visit speaktoeva.com or run `vercel` |
| "Show me the code" | Read files in `client/src/` |
