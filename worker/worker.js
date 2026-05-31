import axios from 'axios';
import admin from 'firebase-admin';
import cron from 'node-cron';

// --- CONFIGURATION ---
const STEAM_APP_ID = 730; 
const CURRENCY_ID = 1; 
const ITEMS_TO_TRACK = [
    "AK-47 | Slate (Field-Tested)",
    "AK-47 | Redline (Field-Tested)",
    "Desert Eagle | Mecha Industries (Field-Tested)",
    "M4A4 | Spider Lily (Minimal Wear)",
    "Glock-18 | Water Elemental (Field-Tested)",
    "Prisma Case",
    "Fracture Case",
    "Recoil Case",
    "Revolution Case",
    "Dreams & Nightmares Case"
];

// --- FIREBASE INITIALIZATION ---
let db;
async function initFirebase() {
    try {
        console.log('Fetching Service Account from Environment...');
        const secret = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (!secret) throw new Error('CRITICAL: FIREBASE_SERVICE_ACCOUNT secret is missing or empty!');
        
        // Clean possible whitespace/formatting issues
        const cleanSecret = secret.trim();
        const serviceAccount = JSON.parse(cleanSecret);
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://nexusloot-9b305-default-rtdb.firebaseio.com"
        });
        console.log('Firebase handshake successful.');
        return admin.database();
    } catch (err) {
        console.error('Firebase Error:', err.message);
        process.exit(1);
    }
}

// --- SCRAPER ENGINE ---
async function fetchSteamPrice(itemName) {
    const url = `https://steamcommunity.com/market/priceoverview/?appid=${STEAM_APP_ID}&currency=${CURRENCY_ID}&market_hash_name=${encodeURIComponent(itemName)}`;
    try {
        const response = await axios.get(url, { timeout: 10000 });
        if (response.data.success) {
            console.log(`✓ ${itemName}: ${response.data.lowest_price}`);
            return {
                name: itemName,
                lowest_price: response.data.lowest_price || "0",
                median_price: response.data.median_price || response.data.lowest_price || "0",
                icon_url: `https://nexusloot.innovationinnitiative.in/favicon.ico`, 
                market_url: `https://steamcommunity.com/market/listings/${STEAM_APP_ID}/${encodeURIComponent(itemName)}`,
                timestamp: Date.now()
            };
        }
    } catch (err) {
        console.error(`✗ ${itemName} failed: ${err.response?.status === 429 ? 'Steam Rate Limit' : err.message}`);
    }
    return null;
}

async function updateMarket() {
    if (!db) db = await initFirebase();
    console.log('--- STARTING MARKET SCAN ---');
    const updates = {};
    
    for (const itemName of ITEMS_TO_TRACK) {
        const data = await fetchSteamPrice(itemName);
        if (data) {
            const key = itemName.replace(/[.#$\[\]]/g, "_");
            updates[key] = data;
        }
        await new Promise(r => setTimeout(r, 15000));
    }

    if (Object.keys(updates).length > 0) {
        await db.ref('steam_market').set(updates);
        console.log(`--- SYNC COMPLETE: ${Object.keys(updates).length} ITEMS UPDATED ---`);
    } else {
        console.warn('--- NO DATA FETCHED. STEAM MAY BE BLOCKING REQUESTS ---');
    }
    
    // In GitHub Actions environment, we exit manually to prevent lingering processes
    if (process.env.GITHUB_ACTIONS) {
        console.log('Exiting GitHub Action cycle.');
        process.exit(0);
    }
}

// Execution
updateMarket();
