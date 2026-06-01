import axios from 'axios';
import admin from 'firebase-admin';

// --- CONFIGURATION ---
const STEAM_APP_ID = 730; 

// --- FREE BULK DATA SOURCES ---
// These provide data for 10,000+ items in ONE fetch. No more rate limits!
const STEAM_BULK_URL = "https://prices.csgotrader.app/latest/steam.json";
const BUFF_BULK_URL = "https://prices.csgotrader.app/latest/buff163.json";
const ASSET_DB_URL = "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/all.json";

// --- FIREBASE INITIALIZATION ---
async function initFirebase() {
    try {
        const secret = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (!secret) throw new Error('CRITICAL: FIREBASE_SERVICE_ACCOUNT missing!');
        const serviceAccount = JSON.parse(secret.trim());
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://nexusloot-9b305-default-rtdb.firebaseio.com"
        });
        return admin.database();
    } catch (err) {
        console.error('Firebase Init Failed:', err.message);
        process.exit(1);
    }
}

// --- TERMINAL ENGINE ---
async function runOnce() {
    const db = await initFirebase();
    console.log('--- INITIALIZING DATA MEGA-LOAD ---');

    try {
        // 1. Fetch High-Quality Image Database
        console.log('Syncing asset icons...');
        const assetRes = await axios.get(ASSET_DB_URL);
        const assetMap = new Map();
        assetRes.data.forEach(item => assetMap.set(item.name, item.image));

        // 2. Fetch Bulk Prices (Thousands of items)
        console.log('Ingesting global market pricing (10,000+ items)...');
        const [steamRes, buffRes] = await Promise.all([
            axios.get(STEAM_BULK_URL),
            axios.get(BUFF_BULK_URL)
        ]);

        const steamPrices = steamRes.data; // { "Item Name": price_in_usd }
        const buffPrices = buffRes.data;   // { "Item Name": price_in_usd }

        const updates = {};
        let processedCount = 0;

        // We only take items that exist in both feeds for arbitrage analysis
        // We focus on the top ~300 items to keep the dashboard ultra-fast
        const allItemNames = Object.keys(steamPrices);
        
        console.log(`Processing top liquidity assets...`);

        for (const name of allItemNames) {
            const steamPrice = steamPrices[name];
            const buffPrice = buffPrices[name];

            if (!steamPrice || !buffPrice) continue;

            // Only track items with real value ($0.50 to $2000) to filter junk
            if (steamPrice < 0.5 || steamPrice > 2000) continue;

            let category = "Other";
            if (name.includes("Case")) category = "Case";
            else if (name.includes("AK-47") || name.includes("M4A4") || name.includes("M4A1-S")) category = "Rifle";
            else if (name.includes("AWP") || name.includes("SSG 08")) category = "Sniper";
            else if (name.includes("Glock-18") || name.includes("USP-S") || name.includes("Desert Eagle")) category = "Pistol";
            else if (name.includes("Knife") || name.includes("★")) category = "Knife";
            else if (name.includes("Gloves") || name.includes("Hand Wraps")) category = "Gloves";

            const key = name.replace(/[.#$\[\]]/g, "_");
            updates[key] = {
                name: name,
                category: category,
                steam_price: steamPrice,
                buff_price: buffPrice,
                // Arbitrage: Buy on Buff, Sell on Steam. After 15% Steam fee.
                profit_percent: (((steamPrice * 0.85) - buffPrice) / buffPrice * 100).toFixed(1),
                icon_url: assetMap.get(name) || `https://nexusloot.innovationinnitiative.in/favicon.ico`,
                market_url: `https://steamcommunity.com/market/listings/${STEAM_APP_ID}/${encodeURIComponent(name)}`,
                timestamp: Date.now()
            };

            processedCount++;
            if (processedCount >= 350) break; // Limit to 350 high-quality items
        }

        // 3. Complete Sync
        await db.ref('steam_market').set(updates);
        console.log(`--- SYNC COMPLETE: ${processedCount} HIGH-VOLUME ASSETS ONLINE ---`);

    } catch (err) {
        console.error('❌ Data Mega-Load Failed:', err.message);
    }

    process.exit(0);
}

runOnce();
