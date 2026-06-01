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
- [x] **Backend Worker:** Upgraded to fetch real item images (Steam Search API) and multi-API price verification.
- [x] **Frontend Integration:** Real-time listener with dynamic currency conversion (USD, INR, EUR, etc.).
- [x] **Advanced Filters:** User-controlled profit margin threshold slider (5% - 50%).
- [x] **Security:** Resolved "Access Denied" by configuring Public Read rules.

## 📝 Latest Updates
- **Update 12:** Implemented Full-Stack Currency Engine. Users can now view Steam prices in INR (Rupees) and other currencies with live exchange rates.
- **Update 13:** Fixed broken images. The backend worker now pulls official asset icons directly from Steam Community servers.
- **Update 14:** Added dynamic "Snipe Threshold" filter. Users can adjust the profit margin sensitivity in real-time.

## 🚀 Future Enhancements
1.  **Portfolio Tracking:** Allow users to "watch" specific items and get browser notifications on price drops.
2.  **Auto-Buy Handshake:** Integration with third-party marketplaces for one-click sniping.
3.  **Expanded Index:** Support for Dota 2 and Rust market assets.

## 🏁 Final Handover Status
- **Domain:** `https://nexusloot.innovationinnitiative.in/` (LIVE)
- **Loot Drop:** Working.
- **Valorant Arsenal:** Working (with Skin Explorer).
- **Steam Market:** FULLY OPERATIONAL (Images, Prices, Currencies, Filters).
- **Ads:** Active.
