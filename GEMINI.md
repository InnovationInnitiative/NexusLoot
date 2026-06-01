# GEMINI.md - NexusLoot Project

## 🤖 AI Instructions
**CRITICAL:** You MUST update this file after every significant turn or milestone.
- Maintain the "Current Status" and "Task Progress" sections accurately.
- Ensure the "Next Steps" are clearly defined.

## 🎯 Project Overview
Build a highly polished, single-page, multi-game tracker dashboard called "NexusLoot".
- **Concept:** 100% frontend-only dashboard using public REST APIs.
- **Tech Stack:** Single-file HTML5, Tailwind CSS (CDN), FontAwesome, Vanilla JS (Async Fetch).
- **Monetization:** Adsterra (Top Banner, Native Grids, Social Bar).
- **Hosting:** Vercel (Zero cost).

## 📊 Task Progress

### Phase 1: Workspace Cleanup [DONE]
- [x] Removed previous project files and logic.
- [x] Reset directory structure for single-file deployment.

### Phase 2: Core Dashboard Implementation [DONE]
- [x] Implement modern gaming dark-mode UI with Tailwind CSS.
- [x] Build multi-tab navigation (Loot Drop, Steam, Valorant).
- [x] Integrate Valorant API (Weapons + Bundles) with Skin Explorer Modal.
- [x] Integrate GamerPower API (Live Loot & Giveaways).
- [x] Implement robust CORS proxy engine (nexusFetch).

### Phase 3: Monetization & Polish [DONE]
- [x] Inject live Adsterra Top Banner (728x90).
- [x] Inject live Adsterra Native Grid into item loops.
- [x] Integrate Adsterra Social Bar globally.

### Phase 4: High-Traffic Utility Pivot [IN PROGRESS]
- [x] **Steam Market Cleanup:** Scrapped the unstable Steam Tracker due to API/CORS limitations.
- [x] **Stable Baseline:** Restored dual-tab architecture (Loot Drop + Valorant).
- [x] **Daily Games Hub:** Implemented 3-tab "Wordle-style" guessing game (Pokémon, LoL, Wordle).
- [ ] **Match Center:** Integrate live eSports schedules and results.
- [ ] **Drops Tracker:** Add a dedicated hub for active Twitch Drop campaigns.

## 📝 Latest Updates
- **Update 21:** Implemented "Daily Games Hub". Added three standalone guessing games with a deterministic daily target, 3D flip animations, and a neon arcade aesthetic.
- **Update 22:** Integrated the Games Hub into the main navigation. Restored stability while adding high-engagement client-side features.
- **Update 23:** Scrapped Fortnite Shop integration plan to focus on eSports and Drops trackers.

## 🚀 Priority 1 (Next Session)
1.  **eSports Schedule:** Research and implement a lightweight PandaScore or esport.is widget.
2.  **Drops Tracker:** Map out Twitch Drop API requirements for the next module.
3.  **Adsterra Check:** Review social bar impressions on the new 3-tab layout.

## 🏁 Final Handover Status
- **Domain:** `https://nexusloot.innovationinnitiative.in/` (LIVE)
- **Loot Drop:** 100% Operational (GamerPower API).
- **Valorant Arsenal:** 100% Operational (Valorant-API.com).
- **Steam Market:** DEPRECATED (Moved to Modular Expansion).
- **Stability:** HIGH (All CORS/API issues resolved).
- **Ads:** Active.
