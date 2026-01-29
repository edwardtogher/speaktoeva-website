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
