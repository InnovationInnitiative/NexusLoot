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

### Phase 4: High-Traffic Utility Pivot [DONE]
- [x] **Steam Market Cleanup:** Scrapped the unstable Steam Tracker due to API/CORS limitations.
- [x] **Stable Baseline:** Restored dual-tab architecture (Loot Drop + Valorant).
- [x] **Daily Games Hub:** Implemented 3-tab "Wordle-style" guessing game (Pokémon, LoL, Wordle).
- [x] **Sens Converter:** Implemented a client-side Mouse Sensitivity converter and dynamic Crosshair Generator with local profile saving.
- [x] **MMO Market:** Implemented a live API-driven market tracker, explicitly split into dedicated OSRS and Albion Online tabs.

### Phase 5: Automated Marketing Engine [DONE]
- [x] **Auto-SEO Blog:** Created the `/blog` architecture and 42 SEO articles to capture long-tail search traffic.
- [x] **Twitter/X Bot:** Built a Node.js bot running on GitHub Actions to auto-tweet daily free games from GamerPower.
- [x] **SEO Routing:** Implemented client-side routing with clean URLs (`/freegame`, `/albion`, etc.) and Vercel rewrites.
- [x] **Blog Visibility:** Exposed the blog in the main navigation for better indexing and user access.
- [ ] **Drops Tracker:** Add a dedicated hub for active Twitch Drop campaigns.

## 📝 Latest Updates
- **Update 26:** Refactored the planned "Loot Tracker" into a live **MMO Market Tracker**. It fetches real-time GE prices for OSRS (using OSRS Wiki API) and Black Market/City prices for Albion Online (using Albion Data Project), displaying instant Buy/Sell margins.
- **Update 27:** Split the generic MMO Market tab into two dedicated, game-specific tabs: **⚔️ OSRS Market** and **🛡️ Albion Market**. This improves credibility for hardcore players and allows for targeted external promotion.
- **Update 28:** Resolved critical UI mounting bugs ("Sync Interrupted") on the new separated market tabs by fixing navigation passing arguments and restoring missing state references in the `MarketTracker` constructor.
- **Update 29:** Implemented **Clean URLs & SEO Routing**. Dedicated paths like `/albion` and `/freegame` now load specific tabs directly. Added a "Blog" link to the main navigation to improve indexability of the SEO articles.

## 🚀 Priority 1 (Next Session)
1.  **eSports Schedule:** Research and implement a lightweight PandaScore or esport.is widget.
2.  **Drops Tracker:** Map out Twitch Drop API requirements for the next module.
3.  **Adsterra Check:** Review social bar impressions on the new 5-tab layout.

## 🏁 Final Handover Status
- **Domain:** `https://nexusloot.innovationinnitiative.in/` (LIVE)
- **Loot Drop:** 100% Operational (GamerPower API).
- **Valorant Arsenal:** 100% Operational (Valorant-API.com).
- **Daily Games:** 100% Operational (Pokémon, LoL, Wordle).
- **Sens Converter:** 100% Operational (Cross-game math + Crosshair Studio).
- **MMO Market:** 100% Operational (Split OSRS and Albion Live Trackers).
- **Automated Marketing:** Twitter Bot deployed via GitHub Actions; Auto-SEO Blog live with 42 indexed pages.
- **Stability:** HIGH (All API fetch and rendering bugs resolved).
