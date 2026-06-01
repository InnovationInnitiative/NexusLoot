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

### Phase 4: Full-Stack Steam Tracker [DONE]
- [x] **Database Setup:** Initialized Firebase Realtime Database.
- [x] **Backend Worker:** Upgraded to high-reactivity "Micro-Batching" engine with ~50 liquid assets.
- [x] **Frontend Integration:** Open Market UX with live search, category chips, and clickable sort columns.
- [x] **Advanced Filters:** Profit sensitivity slider and global currency conversion (INR, EUR, etc.).
- [x] **Stability:** Sequential API calls and 25s delays to prevent Steam IP bans.

## 📝 Latest Updates
- **Update 15:** Launched "Open Market" Expansion. The item index grew from 10 to ~50 assets including Rifles, Snipers, and Cases.
- **Update 16:** Implemented Micro-Batching. The worker now scans a subset of the market every 30 minutes, ensuring the dashboard stays reactive without being rate-limited.
- **Update 17:** Revamped Steam UI. Added a live search bar, category navigation chips, and clickable table headers for multi-axis sorting (Name, Price, Profit).
- **Update 18:** Launched "Pro Trading Terminal". Ingested 10,000+ item bulk data feed (Steam + Buff163), added interactive Price History charts (Lightweight Charts), and implemented arbitrage profit analysis.

## 🚀 Future Enhancements
1.  **Market Depth Visualization:** Add buy/sell order book histograms for high-tier skins.
2.  **User Watchlists:** Persistent local-storage based watchlists for tracking specific "dream" skins.
3.  **Cross-Market Sniping:** Integration with direct API links for Skinport and DMarket.

## 🏁 Final Handover Status
- **Domain:** `https://nexusloot.innovationinnitiative.in/` (LIVE)
- **Loot Drop:** Working.
- **Valorant Arsenal:** Working (with Skin Explorer).
- **Steam Market:** PRO TERMINAL OPERATIONAL (Multi-Market Data, Charts, Arbitrage).
- **Ads:** Active.
