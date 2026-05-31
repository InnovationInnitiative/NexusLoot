import axios from 'axios';
import admin from 'firebase-admin';

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
async function initFirebase() {
    try {
        console.log('Fetching Service Account from Environment...');
        const secret = process.env.FIREBASE_SERVICE_ACCOUNT;
        
        if (!secret || secret.trim().length === 0) {
            throw new Error('CRITICAL: FIREBASE_SERVICE_ACCOUNT secret is missing or empty!');
        }
        
        const serviceAccount = JSON.parse(secret.trim());
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://nexusloot-9b305-default-rtdb.firebaseio.com"
        });
        
        console.log('Firebase handshake successful.');
        return admin.database();
    } catch (err) {
        console.error('Firebase Initialization Failed:', err.message);
        // Special check: If JSON is invalid, log a clearer hint
        if (err.message.includes('Unexpected token')) {
            console.error('HINT: Your GitHub Secret is likely not valid JSON. Ensure you pasted the WHOLE file including { }');
        }
        process.exit(1);
    }
}

// --- SCRAPER ENGINE ---
async function fetchSteamPrice(itemName) {
    const url = `https://steamcommunity.com/market/priceoverview/?appid=${STEAM_APP_ID}&currency=${CURRENCY_ID}&market_hash_name=${encodeURIComponent(itemName)}`;
    try {
        const response = await axios.get(url, { 
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (response.data && response.data.success) {
            console.log(`✓ ${itemName}: ${response.data.lowest_price}`);
            return {
                name: itemName,
                lowest_price: response.data.lowest_price || "0",
                median_price: response.data.median_price || response.data.lowest_price || "0",
                icon_url: `https://nexusloot.innovationinnitiative.in/favicon.ico`, 
                market_url: `https://steamcommunity.com/market/listings/${STEAM_APP_ID}/${encodeURIComponent(itemName)}`,
                timestamp: Date.now()
            };
        } else {
            console.warn(`! Steam returned success:false for ${itemName}`);
        }
    } catch (err) {
        const status = err.response?.status;
        if (status === 429) {
            console.error(`!! RATE LIMITED by Steam for ${itemName}. Status 429.`);
        } else {
            console.error(`✗ ${itemName} failed: ${err.message}`);
        }
    }
    return null;
}

async function runOnce() {
    const db = await initFirebase();
    console.log('--- STARTING MARKET SCAN ---');
    const updates = {};
    
    for (const itemName of ITEMS_TO_TRACK) {
        const data = await fetchSteamPrice(itemName);
        if (data) {
            const key = itemName.replace(/[.#$\[\]]/g, "_");
            updates[key] = data;
        }
        // Wait 10-15 seconds between items to prevent ban
        await new Promise(r => setTimeout(r, 12000));
    }

    if (Object.keys(updates).length > 0) {
        await db.ref('steam_market').set(updates);
        console.log(`--- SYNC COMPLETE: ${Object.keys(updates).length} ITEMS UPDATED ---`);
    } else {
        console.warn('--- NO DATA FETCHED. STEAM IS BLOCKING GITHUB ACTIONS IPS ---');
    }
    
    console.log('Workflow cycle finished. Exiting.');
    process.exit(0);
}

// Kick off the run
runOnce();
