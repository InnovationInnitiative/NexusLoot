import fs from 'fs';
import path from 'path';

// --- CONFIGURATION ---
const blogDir = './blog';

const games = [
    { id: 'valorant', name: 'Valorant' },
    { id: 'cs2', name: 'CS2' },
    { id: 'apex-legends', name: 'Apex Legends' },
    { id: 'overwatch-2', name: 'Overwatch 2' },
    { id: 'rainbow-six-siege', name: 'Rainbow Six Siege' },
    { id: 'fortnite', name: 'Fortnite' },
    { id: 'call-of-duty', name: 'Call of Duty' }
];

const intelligenceArticles = [
    {
        id: 'osrs-flipping-guide',
        category: 'OSRS Market',
        title: 'OSRS Flipping Guide: How to Turn 1M into 10M',
        description: 'Master the art of flipping in Old School RuneScape. Learn how to identify high-margin items and use the NexusLoot OSRS Market Tracker for maximum profit.',
        content: `
            <p>Flipping is one of the most consistent ways to make money in Old School RuneScape (OSRS). Whether you are a F2P player trying to afford your first bond or a P2P veteran looking to fund a T-Bow, understanding the Grand Exchange (GE) cycles is crucial.</p>
            
            <h2>What is GE Flipping?</h2>
            <p>Flipping involves buying items at their "buy" price (the lowest price someone is willing to sell for instantly) and selling them at their "sell" price (the highest price someone is willing to buy for instantly). The difference between these two is your **margin**.</p>
            
            <h2>How to Find High Margin Items</h2>
            <p>Most players make the mistake of flipping items with huge volume but tiny margins (like Zulrah scales). While safe, these won't make you rich quickly. To turn 1M into 10M, you need to target items with higher variance.</p>
            <ul>
                <li><strong>Quest Items:</strong> Items needed for new or popular quests often have erratic pricing.</li>
                <li><strong>PvM Supplies:</strong> High-tier potions and food often see spikes during peak raiding hours.</li>
                <li><strong>Discontinued/Rare Items:</strong> Items with lower daily trade volume often have 5% to 10% margins.</li>
            </ul>

            <h2>Using the NexusLoot OSRS Tracker</h2>
            <p>Our <strong>⚔️ OSRS Market</strong> tab pulls live data directly from the OSRS Wiki API. It shows you the real-time buy and sell prices, calculates the exact margin, and even factors in the GE tax automatically.</p>
            <div class="bg-[#1f2833] p-8 rounded-3xl border border-white/5 my-8 text-center">
                <h3 class="font-display text-2xl uppercase tracking-tighter text-white mb-4">Start Flipping Now</h3>
                <p class="text-white/50 mb-6 text-sm">Access live GE margins and real-time price tracking for thousands of OSRS items.</p>
                <a href="../osrs" class="inline-block py-4 px-8 bg-neon-amber text-arcade-bg font-black rounded-2xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(245,176,65,0.3)] hover:scale-[1.05] transition-all">Launch OSRS Tracker</a>
            </div>
        `
    },
    {
        id: 'albion-black-market-guide',
        category: 'Albion Market',
        title: 'Albion Online Black Market Flipping Strategy',
        description: 'Learn how to use the Caerleon Black Market to make millions of silver. Use NexusLoot to compare city prices with Black Market buy orders.',
        content: `
            <p>The Black Market in Caerleon is the engine that drives Albion Online's economy. Unlike the Royal Cities, the Black Market doesn't sell to players—it buys items to distribute as loot in dungeons.</p>
            
            <h2>How the Black Market Works</h2>
            <p>When a player kills a mob and it drops a piece of gear, that gear was likely purchased by the Black Market from a player in Caerleon. If the Black Market needs an item and nobody is selling it, it increases its buy order price until someone fulfills it.</p>
            
            <h2>The Royal City Transport Strategy</h2>
            <p>The most common profit method is buying gear in Royal Cities (Martlock, Bridgewatch, etc.) where prices are low, and transporting it through the Red Zones to Caerleon to sell to the Black Market.</p>
            <ul>
                <li><strong>Check Tier 4-6 gear:</strong> These tiers have the highest turnover.</li>
                <li><strong>Look for "Excellent" quality:</strong> Higher quality items often have massive price gaps.</li>
                <li><strong>Risk vs Reward:</strong> Remember that transporting to Caerleon involves lethal PvP zones. Always scout your route.</li>
            </ul>

            <h2>Live Albion Price Tracking</h2>
            <p>Navigating the Red Zones is risky enough—don't do it blindly. Use our <strong>🛡️ Albion Market</strong> tab to check prices across different cities before you make the trip. We aggregate data from the Albion Data Project to give you the most accurate price snapshots available.</p>
            <div class="bg-[#1f2833] p-8 rounded-3xl border border-white/5 my-8 text-center">
                <h3 class="font-display text-2xl uppercase tracking-tighter text-white mb-4">Check Albion Prices</h3>
                <p class="text-white/50 mb-6 text-sm">Compare Caerleon Black Market prices with Royal City markets instantly.</p>
                <a href="../albion" class="inline-block py-4 px-8 bg-neon-green text-arcade-bg font-black rounded-2xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(69,162,158,0.3)] hover:scale-[1.05] transition-all">Launch Albion Tracker</a>
            </div>
        `
    },
    {
        id: 'free-steam-keys-2026',
        category: 'Free Loot',
        title: 'Free Steam Keys 2026: The Ultimate Daily List',
        description: 'Stop paying for games. We track every active giveaway for Steam, Epic Games, and GOG. Updated daily by the NexusLoot engine.',
        content: `
            <p>Gaming doesn't have to be an expensive hobby. Between developer promotions, store giveaways, and beta tests, there are dozens of free games available every single week—if you know where to look.</p>
            
            <h2>Where do Free Steam Keys come from?</h2>
            <p>Most free keys are distributed by developers through platforms like GamerPower or Alienware Arena to boost their player base or stress-test servers. Additionally, the Epic Games Store gives away at least one high-quality game every Thursday.</p>
            
            <h2>How to never miss a giveaway</h2>
            <ul>
                <li><strong>Set up Notifications:</strong> Follow developers on Twitter/X.</li>
                <li><strong>Join Alpha/Beta programs:</strong> Many games give a permanent key to early testers.</li>
                <li><strong>Use a Central Hub:</strong> Checking 10 different sites daily is exhausting.</li>
            </ul>

            <h2>The NexusLoot Advantage</h2>
            <p>Our <strong>Loot Drop</strong> tab uses the GamerPower API to aggregate every active giveaway across all major platforms. We filter out the "expired" junk so you only see what's actually available right now.</p>
            <div class="bg-[#1f2833] p-8 rounded-3xl border border-white/5 my-8 text-center">
                <h3 class="font-display text-2xl uppercase tracking-tighter text-white mb-4">Claim Free Games</h3>
                <p class="text-white/50 mb-6 text-sm">Browse the largest live database of free Steam keys and Epic Games giveaways.</p>
                <a href="../freegame" class="inline-block py-4 px-8 bg-epic text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.05] transition-all">Check Loot Drop</a>
            </div>
        `
    },
    {
        id: 'valorant-skin-economy',
        category: 'Valorant Arsenal',
        title: 'Valorant Skin Economy: Is Your Favorite Skin Coming Back?',
        description: 'Understand how the Valorant store rotations work. Learn how to track upcoming bundles and find rare skins in your Night Market using NexusLoot.',
        content: `
            <p>Valorant skins are more than just cosmetics; they are a status symbol. But with hundreds of skins in the game and only four daily slots in the store, finding the one you want can take months.</p>
            
            <h2>How the Store Rotations Work</h2>
            <p>The Valorant store consists of the **Featured Bundle** (new releases) and the **Daily Offers**. Daily offers are completely random for every player, meaning your friend might have the Reaver Vandal while you have a Smite Knife.</p>
            
            <h2>Tracking Upcoming Bundles</h2>
            <p>Riot Games typically releases a new major bundle every two weeks. By tracking the "Featured" timer, you can predict exactly when the next set of skins will drop.</p>
            
            <h2>Using the NexusLoot Arsenal</h2>
            <p>Our <strong>Valorant</strong> tab allows you to browse every skin currently in the game database. You can see high-resolution icons and check which bundles are currently featured without even opening the game client.</p>
            <div class="bg-[#1f2833] p-8 rounded-3xl border border-white/5 my-8 text-center">
                <h3 class="font-display text-2xl uppercase tracking-tighter text-white mb-4">Browse the Arsenal</h3>
                <p class="text-white/50 mb-6 text-sm">Explore every skin and active bundle in the Valorant universe.</p>
                <a href="../valorant" class="inline-block py-4 px-8 bg-free text-nexus-dark font-black rounded-2xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.05] transition-all">Launch Arsenal</a>
            </div>
        `
    },
    {
        id: 'daily-games-strategy',
        category: 'Daily Games',
        title: 'Daily Games Hub: How to Win Every Wordle & Pokémon Guess',
        description: 'Struggling with your daily streaks? Learn the optimal starting words and strategies for Wordle, LoLle, and Pokémon guessing games.',
        content: `
            <p>Daily "guess-the-thing" games have taken over the internet. Whether it is the classic Wordle or niche games like Pokedle, consistency is the key to maintaining your streak.</p>
            
            <h2>The Optimal Wordle Start</h2>
            <p>Statistically, starting with words like **ARISE**, **SLATE**, or **CRANE** gives you the highest probability of hitting common vowels and consonants. Avoid starting with words that have repeating letters.</p>
            
            <h2>Mastering the NexusLoot Games</h2>
            <p>We've integrated three distinct daily challenges into NexusLoot:</p>
            <ul>
                <li><strong>Wordle:</strong> The classic 5-letter word challenge.</li>
                <li><strong>Pokémon:</strong> Guess the creature based on its silhouette.</li>
                <li><strong>LoLle:</strong> Identify the League of Legends champion from their title.</li>
            </ul>
            <div class="bg-[#1f2833] p-8 rounded-3xl border border-white/5 my-8 text-center">
                <h3 class="font-display text-2xl uppercase tracking-tighter text-white mb-4">Start Your Streak</h3>
                <p class="text-white/50 mb-6 text-sm">Challenge your brain with our three integrated daily guessing games.</p>
                <a href="../games" class="inline-block py-4 px-8 bg-epic text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.05] transition-all">Play Daily Games</a>
            </div>
        `
    }
];

// --- TEMPLATES ---

const template = (title, description, category, content, themeColor = 'neon-cyan') => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | NexusLoot Intelligence</title>
    <meta name="description" content="${description}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../style.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lexend:wght@700;800&display=swap');
        body { background-color: #020617; color: #f8fafc; font-family: 'Inter', sans-serif; }
        .prose h2 { font-family: 'Lexend', sans-serif; color: #fff; font-size: 2rem; text-transform: uppercase; margin-top: 3rem; margin-bottom: 1rem; }
        .prose p { color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 1.5rem; font-size: 1.1rem; }
        .prose ul { color: rgba(255,255,255,0.7); list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .prose li { margin-bottom: 0.5rem; }
        .prose strong { color: ${themeColor === 'neon-cyan' ? '#66fcf1' : themeColor}; }
    </style>
</head>
<body>
    <nav class="sticky top-0 z-50 bg-nexus-dark/90 backdrop-blur-md border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <a href="../index.html" class="flex items-center gap-3 cursor-pointer">
                    <i class="fa-solid fa-bolt-lightning text-epic text-2xl drop-shadow-[0_0_8px_#8B5CF6]"></i>
                    <span class="font-display text-xl tracking-tighter italic uppercase text-white">Nexus<span class="text-epic">Loot</span> // Blog</span>
                </a>
                <a href="index.html" class="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">← Back to Articles</a>
            </div>
        </div>
    </nav>

    <main class="max-w-3xl mx-auto px-4 py-16">
        <div class="mb-12">
            <div class="flex items-center gap-4 mb-6">
                <span class="text-[8px] font-bold text-white uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full bg-white/5" style="border-color: ${themeColor}; color: ${themeColor}">${category}</span>
                <span class="text-[10px] text-white/30 font-mono">Published: June 2, 2026</span>
            </div>
            <h1 class="font-display text-5xl uppercase tracking-tighter italic text-white leading-tight">${title}</h1>
        </div>

        <div class="prose">
            ${content}
        </div>
    </main>

    <footer class="border-t border-white/5 py-16 mt-32 bg-black/40 text-center">
        <div class="max-w-7xl mx-auto px-4">
            <h4 class="font-display text-lg mb-4 italic uppercase">NEXUS<span class="text-epic">LOOT</span></h4>
            <p class="text-[9px] text-white/20 uppercase tracking-[0.2em]">© 2026 Innovation Initiative Hub</p>
        </div>
    </footer>
</body>
</html>`;

const indexTemplate = (linksHtml) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NexusLoot Intelligence // Gaming SEO Hub</title>
    <meta name="description" content="Discover the latest gaming strategies, sensitivity conversion guides, and free loot updates from the NexusLoot AI system.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../style.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lexend:wght@700;800&display=swap');
        body { background-color: #020617; color: #f8fafc; font-family: 'Inter', sans-serif; }
    </style>
</head>
<body>
    <nav class="sticky top-0 z-50 bg-nexus-dark/90 backdrop-blur-md border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <a href="../index.html" class="flex items-center gap-3 cursor-pointer">
                    <i class="fa-solid fa-bolt-lightning text-epic text-2xl drop-shadow-[0_0_8px_#8B5CF6]"></i>
                    <span class="font-display text-xl tracking-tighter italic uppercase text-white">Nexus<span class="text-epic">Loot</span> // Blog</span>
                </a>
                <a href="../index.html" class="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">← Back to Dashboard</a>
            </div>
        </div>
    </nav>

    <main class="max-w-5xl mx-auto px-4 py-12">
        <div class="text-center mb-16">
            <h1 class="font-display text-5xl uppercase tracking-tighter italic text-white mb-4">Neural <span class="text-neon-cyan">Archives</span></h1>
            <p class="text-white/40 uppercase tracking-[0.3em] text-xs">Automated SEO Intelligence Feed</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${linksHtml}
        </div>
    </main>

    <footer class="border-t border-white/5 py-16 mt-32 bg-black/40 text-center">
        <div class="max-w-7xl mx-auto px-4">
            <h4 class="font-display text-lg mb-4 italic uppercase">NEXUS<span class="text-epic">LOOT</span></h4>
            <p class="text-[9px] text-white/20 uppercase tracking-[0.2em]">© 2026 Innovation Initiative Hub</p>
        </div>
    </footer>
</body>
</html>`;

// --- GENERATION LOGIC ---

async function generate() {
    console.log("🚀 Generating Expanded SEO Articles...");
    let linksHtml = '';
    let count = 0;

    // 1. Generate Intelligence Articles
    intelligenceArticles.forEach(art => {
        const fileName = `${art.id}.html`;
        const filePath = path.join(blogDir, fileName);
        
        let themeColor = '#66fcf1'; // Default cyan
        if (art.category.includes('OSRS')) themeColor = '#f5b041'; // Amber
        if (art.category.includes('Albion')) themeColor = '#45a29e'; // Green
        if (art.category.includes('Free')) themeColor = '#8B5CF6'; // Epic Purple

        const html = template(art.title, art.description, art.category, art.content, themeColor);
        fs.writeFileSync(filePath, html);

        linksHtml += `
            <a href="${fileName}" class="glass-card bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-white/20 transition-all group block">
                <div class="flex items-center gap-4 mb-4">
                    <span class="text-[8px] font-bold uppercase tracking-widest border px-3 py-1 rounded-full" style="border-color: ${themeColor}40; color: ${themeColor}; background: ${themeColor}10">${art.category}</span>
                    <span class="text-[10px] text-white/20 uppercase tracking-widest italic">Intelligence Report</span>
                </div>
                <h2 class="font-display text-3xl uppercase tracking-tighter mb-4 group-hover:text-white transition-colors text-white/80">${art.title}</h2>
                <p class="text-xs text-white/40 leading-relaxed mb-6 line-clamp-2">${art.description}</p>
                <span class="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] group-hover:pl-2 group-hover:text-white transition-all">Execute Analysis →</span>
            </a>`;
        count++;
    });

    // 2. Generate Sensitivity Converters (Legacy)
    for (let i = 0; i < games.length; i++) {
        for (let j = 0; j < games.length; j++) {
            if (i === j) continue;
            const source = games[i];
            const target = games[j];
            const fileName = `${source.id}-to-${target.id}-sens-converter.html`;
            const filePath = path.join(blogDir, fileName);

            // Re-using the simplified template logic or just stick to the original content
            const content = `
                <p>Switching your main game from ${source.name} to ${target.name}? Maintain your muscle memory with our mathematical conversion guide.</p>
                <h2>Precision Conversion</h2>
                <p>To keep the same cm/360, you must apply the correct engine multiplier. Our calculator does this instantly.</p>
                <div class="bg-[#1f2833] p-8 rounded-3xl border border-white/5 my-8 text-center">
                    <h3 class="font-display text-2xl uppercase tracking-tighter text-white mb-4">Launch Converter</h3>
                    <a href="../sens" class="inline-block py-4 px-8 bg-neon-cyan text-arcade-bg font-black rounded-2xl uppercase tracking-[0.2em]">Start Calculation</a>
                </div>
            `;
            const html = template(`How to Convert ${source.name} Sens to ${target.name}`, `Learn the exact multiplier for ${source.name} to ${target.name} sensitivity.`, 'Sensitivity Guide', content);
            fs.writeFileSync(filePath, html);

            linksHtml += `
                <a href="${fileName}" class="glass-card bg-white/[0.02] rounded-2xl p-6 border border-white/5 hover:border-neon-cyan/30 transition-all group block">
                    <div class="flex items-center gap-4 mb-3">
                        <span class="text-[8px] font-bold text-neon-cyan uppercase tracking-widest border border-neon-cyan/20 px-2 py-1 rounded-full bg-neon-cyan/5">Sens Guide</span>
                    </div>
                    <h2 class="font-display text-xl uppercase tracking-tighter mb-2 group-hover:text-neon-cyan transition-colors text-white/60">${source.name} to ${target.name}</h2>
                    <span class="text-[10px] font-bold text-white/20 uppercase tracking-widest group-hover:pl-2 group-hover:text-white transition-all">Read Guide →</span>
                </a>`;
            count++;
        }
    }

    // 3. Write Index
    const indexPath = path.join(blogDir, 'index.html');
    fs.writeFileSync(indexPath, indexTemplate(linksHtml));
    
    console.log(`✅ Success! ${count} total articles are live in the Neural Archives.`);
}

generate();