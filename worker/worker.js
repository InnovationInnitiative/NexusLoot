import axios from 'axios';
import admin from 'firebase-admin';
import cron from 'node-cron';

// --- CONFIGURATION ---
const STEAM_APP_ID = 730; // CS2
const CURRENCY_ID = 1; // USD
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
        console.log('Loading Service Account from Environment...');
        const secret = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (!secret) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT secret!');
        
        const serviceAccount = JSON.parse(secret);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://nexusloot-9b305-default-rtdb.firebaseio.com"
        });
        console.log('Firebase initialized successfully.');
        return admin.database();
    } catch (err) {
        console.error('Firebase Init Error:', err.message);
        process.exit(1);
    }
}

const db = await initFirebase();

// --- SCRAPER ENGINE ---
async function fetchSteamPrice(itemName) {
    const url = `https://steamcommunity.com/market/priceoverview/?appid=${STEAM_APP_ID}&currency=${CURRENCY_ID}&market_hash_name=${encodeURIComponent(itemName)}`;
    try {
        const response = await axios.get(url);
        if (response.data.success) {
            console.log(`Successfully fetched: ${itemName} (${response.data.lowest_price})`);
            return {
                name: itemName,
                lowest_price: response.data.lowest_price || "0",
                median_price: response.data.median_price || response.data.lowest_price || "0",
                icon_url: `https://nexusloot.innovationinnitiative.in/favicon.ico`, 
                market_url: `https://steamcommunity.com/market/listings/${STEAM_APP_ID}/${encodeURIComponent(itemName)}`,
                timestamp: Date.now()
            };
        }
        console.warn(`Steam returned success:false for ${itemName}`);
    } catch (err) {
        if (err.response && err.response.status === 429) {
            console.error(`RATE LIMITED by Steam for ${itemName}. Status 429.`);
        } else {
            console.error(`Error fetching ${itemName}:`, err.message);
        }
    }
    return null;
}

async function updateMarket() {
    console.log('--- Starting Market Update Cycle ---');
    const updates = {};
    
    for (const itemName of ITEMS_TO_TRACK) {
        console.log(`Syncing: ${itemName}...`);
        const data = await fetchSteamPrice(itemName);
        if (data) {
            const key = itemName.replace(/[.#$\[\]]/g, "_");
            updates[key] = data;
        }
        // Wait 15 seconds to be extremely safe
        await new Promise(resolve => setTimeout(resolve, 15000));
    }

    if (Object.keys(updates).length > 0) {
        await db.ref('steam_market').set(updates);
        console.log('--- Firebase Sync Successful. Total items updated:', Object.keys(updates).length, '---');
    } else {
        console.error('--- No items were updated. Skipping Firebase write. ---');
    }
}

// Scheduled run
cron.schedule('*/30 * * * *', () => updateMarket());

// Initial run
updateMarket();
