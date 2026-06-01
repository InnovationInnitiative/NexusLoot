import axios from 'axios';
import admin from 'firebase-admin';

// --- CONFIGURATION ---
const STEAM_APP_ID = 730; 
const CURRENCY_ID = 1; 

// --- ASSET MAPPING (Community Database for 100% Reliable Images) ---
const ASSET_DB_URL = "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/all.json";

// --- FIREBASE INITIALIZATION ---
async function initFirebase() {
    try {
        console.log('Fetching Service Account from Environment...');
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

// --- CORE ENGINE ---
async function runOnce() {
    const db = await initFirebase();
    console.log('--- STARTING OPEN MARKET SYNC ---');

    try {
        // 1. Fetch High-Quality Image Database
        console.log('Fetching community asset database...');
        const assetRes = await axios.get(ASSET_DB_URL);
        const assetMap = new Map();
        assetRes.data.forEach(item => assetMap.set(item.name, item.image));
        console.log(`Loaded ${assetMap.size} asset definitions.`);

        // 2. Fetch Top 50 Trending Items (Official Steam Search)
        // This gets us 50 items in ONE call, ensuring the market is always "Hot"
        const trendingUrl = `https://steamcommunity.com/market/search/render/?query=&start=0&count=50&search_descriptions=0&sort_column=popular&sort_dir=desc&norender=1&appid=${STEAM_APP_ID}&currency=${CURRENCY_ID}`;
        
        console.log('Scanning Steam Community Hot-List...');
        const steamRes = await axios.get(trendingUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });

        const trendingItems = steamRes.data.results;
        if (!trendingItems || trendingItems.length === 0) {
            throw new Error('Steam returned empty trending list. Rate limit?');
        }

        const updates = {};
        console.log(`Processing ${trendingItems.length} trending assets...`);

        for (const item of trendingItems) {
            const name = item.hash_name || item.name;
            
            // Determine Category from Name
            let category = "Other";
            if (name.includes("Case")) category = "Case";
            else if (name.includes("AK-47") || name.includes("M4A4") || name.includes("M4A1-S")) category = "Rifle";
            else if (name.includes("AWP") || name.includes("SSG 08")) category = "Sniper";
            else if (name.includes("Glock-18") || name.includes("USP-S") || name.includes("Desert Eagle")) category = "Pistol";
            else if (name.includes("MP9") || name.includes("MAC-10")) category = "SMG";
            else if (name.includes("Knife") || name.includes("★")) category = "Knife";

            // Price & Volume Parsing
            const lowest = item.sell_price_text || "0";
            const volume = item.sell_listings || "0";
            
            const key = name.replace(/[.#$\[\]]/g, "_");
            updates[key] = {
                name: name,
                category: category,
                lowest_price: lowest,
                median_price: lowest, // Fallback
                volume: volume,
                icon_url: assetMap.get(name) || `https://community.cloudflare.steamstatic.com/economy/image/${item.asset_description.icon_url}/256fx256f`,
                market_url: `https://steamcommunity.com/market/listings/${STEAM_APP_ID}/${encodeURIComponent(name)}`,
                is_trending: true,
                timestamp: Date.now()
            };
        }

        // 3. Batch Update Firebase
        await db.ref('steam_market').set(updates);
        console.log(`--- SYNC COMPLETE: ${Object.keys(updates).length} ASSETS ONLINE ---`);

    } catch (err) {
        console.error('❌ Sync Failed:', err.message);
    }

    console.log('Workflow finished.');
    process.exit(0);
}

// Kick off the run
runOnce();
