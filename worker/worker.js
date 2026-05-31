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
// Security Fix: Using Environment Variable instead of hardcoded JSON
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nexusloot-9b305-default-rtdb.firebaseio.com"
});

const db = admin.database();

// --- SCRAPER ENGINE ---
async function fetchSteamPrice(itemName) {
    const url = `https://steamcommunity.com/market/priceoverview/?appid=${STEAM_APP_ID}&currency=${CURRENCY_ID}&market_hash_name=${encodeURIComponent(itemName)}`;
    try {
        const response = await axios.get(url);
        if (response.data.success) {
            return {
                name: itemName,
                lowest_price: response.data.lowest_price,
                median_price: response.data.median_price || response.data.lowest_price,
                icon_url: `https://nexusloot.innovationinnitiative.in/favicon.ico`, 
                market_url: `https://steamcommunity.com/market/listings/${STEAM_APP_ID}/${encodeURIComponent(itemName)}`,
                timestamp: Date.now()
            };
        }
    } catch (err) {
        console.error(`Error fetching ${itemName}:`, err.message);
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
        await new Promise(resolve => setTimeout(resolve, 15000));
    }

    if (Object.keys(updates).length > 0) {
        await db.ref('steam_market').set(updates);
        console.log('--- Firebase Sync Successful ---');
    }
}

cron.schedule('*/30 * * * *', () => updateMarket());
updateMarket();
console.log('NexusLoot Worker Active. Monitoring Steam Market...');
