import axios from 'axios';
import admin from 'firebase-admin';

// --- CONFIGURATION ---
const STEAM_APP_ID = 730; 
const CURRENCY_ID = 1; 

const ALL_ITEMS = [
    // --- CASES ---
    { name: "Prisma Case", category: "Case" },
    { name: "Fracture Case", category: "Case" },
    { name: "Recoil Case", category: "Case" },
    { name: "Revolution Case", category: "Case" },
    { name: "Dreams & Nightmares Case", category: "Case" },
    { name: "Snakebite Case", category: "Case" },
    { name: "Operation Phoenix Weapon Case", category: "Case" },
    { name: "Clutch Case", category: "Case" },
    { name: "Danger Zone Case", category: "Case" },
    { name: "Horizon Case", category: "Case" },
    { name: "Spectrum 2 Case", category: "Case" },
    { name: "Gamma 2 Case", category: "Case" },
    { name: "Chroma 3 Case", category: "Case" },
    { name: "Revolver Case", category: "Case" },
    { name: "Shadow Case", category: "Case" },
    { name: "Falchion Case", category: "Case" },

    // --- RIFLES ---
    { name: "AK-47 | Slate (Field-Tested)", category: "Rifle" },
    { name: "AK-47 | Redline (Field-Tested)", category: "Rifle" },
    { name: "AK-47 | Ice Coaled (Minimal Wear)", category: "Rifle" },
    { name: "AK-47 | Nightwish (Field-Tested)", category: "Rifle" },
    { name: "AK-47 | Asiimov (Field-Tested)", category: "Rifle" },
    { name: "M4A4 | Spider Lily (Minimal Wear)", category: "Rifle" },
    { name: "M4A4 | Etch Lord (Minimal Wear)", category: "Rifle" },
    { name: "M4A4 | Desolate Space (Field-Tested)", category: "Rifle" },
    { name: "M4A1-S | Decimator (Field-Tested)", category: "Rifle" },
    { name: "M4A1-S | Nightmare (Field-Tested)", category: "Rifle" },
    { name: "M4A1-S | Leaden Glass (Minimal Wear)", category: "Rifle" },
    { name: "AWP | Atheris (Minimal Wear)", category: "Sniper" },
    { name: "AWP | Mortis (Minimal Wear)", category: "Sniper" },
    { name: "AWP | Neo-Noir (Field-Tested)", category: "Sniper" },
    { name: "AWP | PAW (Minimal Wear)", category: "Sniper" },
    { name: "AWP | Exoskeleton (Minimal Wear)", category: "Sniper" },

    // --- PISTOLS ---
    { name: "Desert Eagle | Mecha Industries (Field-Tested)", category: "Pistol" },
    { name: "Desert Eagle | Code Red (Field-Tested)", category: "Pistol" },
    { name: "Desert Eagle | Light Rail (Minimal Wear)", category: "Pistol" },
    { name: "Glock-18 | Water Elemental (Field-Tested)", category: "Pistol" },
    { name: "Glock-18 | Vogue (Field-Tested)", category: "Pistol" },
    { name: "USP-S | Cyrex (Field-Tested)", category: "Pistol" },
    { name: "USP-S | Neo-Noir (Field-Tested)", category: "Pistol" },
    { name: "USP-S | Blueprint (Minimal Wear)", category: "Pistol" },
    { name: "USP-S | Cortex (Field-Tested)", category: "Pistol" },
    { name: "P250 | See Ya Later (Field-Tested)", category: "Pistol" },

    // --- SMGs / OTHER ---
    { name: "MP9 | Food Chain (Field-Tested)", category: "SMG" },
    { name: "MP9 | Mount Fuji (Minimal Wear)", category: "SMG" },
    { name: "MAC-10 | Disco Tech (Field-Tested)", category: "SMG" },
    { name: "P90 | Nostalgia (Field-Tested)", category: "SMG" },
    { name: "SSG 08 | Dragonfire (Field-Tested)", category: "Sniper" },
    { name: "SSG 08 | Turbo Peek (Field-Tested)", category: "Sniper" }
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
async function fetchSteamPrice(item) {
    const itemName = item.name;
    const itemCategory = item.category;

    // 1. Fetch Price & Metadata from Search API (for Image & Current Price)
    const searchUrl = `https://steamcommunity.com/market/search/render/?query=${encodeURIComponent(itemName)}&start=0&count=1&appid=${STEAM_APP_ID}&norender=1&currency=${CURRENCY_ID}`;
    const overviewUrl = `https://steamcommunity.com/market/priceoverview/?appid=${STEAM_APP_ID}&currency=${CURRENCY_ID}&market_hash_name=${encodeURIComponent(itemName)}`;
    
    try {
        console.log(`Scanning [${itemCategory}]: ${itemName}`);
        
        const searchRes = await axios.get(searchUrl, { 
            timeout: 15000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });

        await new Promise(r => setTimeout(r, 6000)); // Safer gap

        const overviewRes = await axios.get(overviewUrl, { 
            timeout: 15000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });

        const searchData = searchRes.data.results?.[0];
        const overviewData = overviewRes.data;

        if (searchData) {
            const iconUrl = searchData.asset_description?.icon_url 
                ? `https://community.cloudflare.steamstatic.com/economy/image/${searchData.asset_description.icon_url}/256fx256f`
                : `https://nexusloot.innovationinnitiative.in/favicon.ico`;

            console.log(`✓ Got Metadata for ${itemName}`);

            return {
                name: itemName,
                category: itemCategory,
                lowest_price: searchData.sell_price_text || overviewData.lowest_price || "0",
                median_price: overviewData.median_price || searchData.sell_price_text || "0",
                icon_url: iconUrl,
                market_url: `https://steamcommunity.com/market/listings/${STEAM_APP_ID}/${encodeURIComponent(itemName)}`,
                timestamp: Date.now()
            };
        } else {
            console.warn(`! Search API returned no results for ${itemName}`);
        }
    } catch (err) {
        if (err.response?.status === 429) {
            console.error(`!! RATE LIMITED by Steam for ${itemName}.`);
        } else {
            console.error(`✗ ${itemName} failed: ${err.message}`);
        }
    }
    return null;
}

async function runOnce() {
    const db = await initFirebase();
    console.log('--- STARTING MARKET SCAN (MICRO-BATCH) ---');
    
    // --- MICRO-BATCHING LOGIC ---
    // Instead of scanning all 50, we scan 12 items per run based on the current hour.
    // This allows for high-frequency runs (every 30 mins) without hitting global IP bans.
    const BATCH_SIZE = 12;
    const currentHour = new Date().getHours();
    const startIndex = (currentHour * 2) % ALL_ITEMS.length; // Simple rotation logic
    const batchItems = ALL_ITEMS.slice(startIndex, startIndex + BATCH_SIZE);
    
    // If we reach end of array, wrap around
    if (batchItems.length < BATCH_SIZE) {
        const remaining = BATCH_SIZE - batchItems.length;
        batchItems.push(...ALL_ITEMS.slice(0, remaining));
    }

    console.log(`Queueing ${batchItems.length} items starting from index ${startIndex}`);
    
    const updates = {};
    for (const item of batchItems) {
        const data = await fetchSteamPrice(item);
        if (data) {
            const key = item.name.replace(/[.#$\[\]]/g, "_");
            // Use update() to merge with existing data in Firebase instead of set()
            await db.ref(`steam_market/${key}`).update(data);
            console.log(`-> Sync'd ${item.name} to Cloud Node`);
        }
        // Very conservative delay for GitHub IPs
        await new Promise(r => setTimeout(r, 25000));
    }

    console.log('Workflow cycle finished. Exiting.');
    process.exit(0);
}

// Kick off the run
runOnce();
