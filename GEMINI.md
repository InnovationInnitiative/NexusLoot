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
- [x] **Stable Baseline:** Restored dual-tab architecture (Loot Drop + Valorant) for 100% uptime.
- [ ] **Modular Expansion:** Implement Fortnite Daily Shop as a standalone stable tab.
- [ ] **Match Center:** Integrate live eSports schedules and results.
- [ ] **Drops Tracker:** Add a dedicated hub for active Twitch Drop campaigns.

## 📝 Latest Updates
- **Update 19:** Finalized "Stable Baseline." Simplified the dashboard to two high-performance tabs (Giveaways and Valorant) to ensure 0% downtime for users.
- **Update 20:** Identified high-traffic alternatives (Fortnite Shop, eSports, Twitch Drops) to replace the Steam Market. Architecture changed to a "Modular Tab" approach for better stability.

## 🚀 Priority 1 (Next Session)
1.  **Fortnite Shop Tab:** Implement the `fortnite-api.com` integration as the 3rd standalone tab.
2.  **eSports Schedule:** Research and implement a lightweight PandaScore or esport.is widget.
3.  **Adsterra Check:** Review social bar impressions on the new dual-tab layout.

## 🏁 Final Handover Status
- **Domain:** `https://nexusloot.innovationinnitiative.in/` (LIVE)
- **Loot Drop:** 100% Operational (GamerPower API).
- **Valorant Arsenal:** 100% Operational (Valorant-API.com).
- **Steam Market:** DEPRECATED (Moved to Modular Expansion).
- **Stability:** HIGH (All CORS/API issues resolved).
- **Ads:** Active.
