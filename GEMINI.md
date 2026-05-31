# GEMINI.md - NexusLoot Project

## 🤖 AI Instructions
**CRITICAL:** You MUST update this file after every significant turn or milestone.
- Maintain the "Current Status" and "Task Progress" sections accurately.
- Ensure the "Next Steps" are clearly defined.

## 🎯 Project Overview
Build a highly polished, single-page, multi-game tracker dashboard called "NexusLoot".
- **Concept:** 100% frontend-only dashboard using public REST APIs.
- **Tech Stack:** Single-file HTML5, Tailwind CSS (CDN), FontAwesome, Vanilla JS (Async Fetch).
- **Monetization:** Adsterra (Top Banner, Native Grids, Popunder Triggers).
- **Hosting:** Vercel (Zero cost).

## 📊 Task Progress

### Phase 1: Workspace Cleanup [DONE]
- [x] Removed previous project files and logic.
- [x] Reset directory structure for single-file deployment.

### Phase 2: Core Dashboard Implementation [DONE]
- [x] Implement modern gaming dark-mode UI with Tailwind CSS.
- [x] Build multi-tab navigation (Fortnite, Valorant, Giveaways).
- [x] Integrate Fortnite API (Live Shop + Countdown).
- [x] Integrate Valorant API (Weapons + Bundles).
- [x] Integrate GamerPower API (Live Loot & Giveaways).
- [x] Implement responsive grid layouts and shimmer loading states.

### Phase 3: Monetization & Polish [DONE]
- [x] Inject Adsterra Top Banner placeholders.
- [x] Inject Adsterra Native Grid placeholders into item loops.
- [x] Implement Popunder trigger framework on action buttons.

## 📝 Latest Updates
- **Initialization:** Created the complete "NexusLoot" dashboard as a single-file `index.html`.
- **API Integration:** Successfully mapped Fortnite shop, Valorant arsenal, and GamerPower loot drops.
- **UI/UX:** Added rarity-based coloring, hover glows, and a real-time UTC countdown timer.

## 🚀 Final Deployment Instructions
1. **Host:** This file is ready for Vercel. Simply push `index.html` to a repo and connect it.
2. **Ads:** Replace `ADSTERRA_BANNER_CODE_HERE` and other ad comments with your live Adsterra scripts.
3. **Popunder:** Add your script inside the `handlePopunder` function in `index.html`.
