/**
 * NexusLoot Hub Engine v2.0
 * The "Brain" of the Next-Gen Gaming Hub
 */

class NexusHub {
    constructor() {
        this.socialEvents = [
            "User042 just claimed 2 Free Steam Keys!",
            "New Profit Lead: Albion Caerleon -> Martlock (12% margin)",
            "Legendary Guess: Someone solved Poké-Guess in 2.4s!",
            "Market Alert: OSRS Bond price dropped by 4.2%",
            "User_99 found an Exotic skin in the Valorant Library",
            "Daily Quest: 412 players completed today's Wordle challenge"
        ];
        this.liveMatches = [
            { game: 'Valorant', league: 'VCT Champions', t1: 'SEN', t2: 'FNC', score: '1 - 0', live: true },
            { game: 'CS2', league: 'ESL Pro League', t1: 'G2', t2: 'NAVI', score: '12 - 14', live: true },
            { game: 'LoL', league: 'LCK Summer', t1: 'T1', t2: 'GEN.G', score: '0 - 0', live: false, time: '20:00' }
        ];
        this.init();
    }

    init() {
        console.log("NexusHub v2.0 Initialized...");
        this.injectLayout();
        this.startPulse();
        this.renderLiveMatches();
        this.setupSearch();
    }

    injectLayout() {
        // Add Social Pulse Bar
        const nav = document.querySelector('nav');
        const pulseBar = document.createElement('div');
        pulseBar.id = 'nexus-pulse';
        pulseBar.className = 'bg-epic/10 border-b border-epic/20 py-2 overflow-hidden whitespace-nowrap relative';
        pulseBar.innerHTML = `
            <div class="flex items-center gap-4 animate-pulse-scroll">
                ${this.socialEvents.map(ev => `<span class="text-[8px] font-black uppercase tracking-[0.4em] text-white/60 px-8 flex items-center gap-2"><i class="fa-solid fa-satellite-dish text-epic"></i> ${ev}</span>`).join('')}
                ${this.socialEvents.map(ev => `<span class="text-[8px] font-black uppercase tracking-[0.4em] text-white/60 px-8 flex items-center gap-2"><i class="fa-solid fa-satellite-dish text-epic"></i> ${ev}</span>`).join('')}
            </div>
        `;
        nav.after(pulseBar);

        // Add Sidebar Mount
        const main = document.querySelector('main > div');
        if (main) {
            const container = document.createElement('div');
            container.className = 'grid grid-cols-1 xl:grid-cols-4 gap-12 mt-8';
            
            const contentArea = document.createElement('div');
            contentArea.id = 'nexus-content-main';
            contentArea.className = 'xl:col-span-3';
            
            const sidebar = document.createElement('div');
            sidebar.id = 'nexus-sidebar';
            sidebar.className = 'xl:col-span-1 space-y-8';
            sidebar.innerHTML = `
                <div class="glass-card bg-nexus-surface rounded-[2rem] p-8 border border-white/5">
                    <h3 class="font-display text-xs uppercase tracking-[0.3em] text-white/40 mb-6 flex items-center gap-2">
                        <i class="fa-solid fa-tower-broadcast text-epic"></i> Live Pro Pulse
                    </h3>
                    <div id="live-matches-mount" class="space-y-4"></div>
                </div>

                <div class="glass-card bg-nexus-surface rounded-[2rem] p-8 border border-white/5">
                    <h3 class="font-display text-xs uppercase tracking-[0.3em] text-white/40 mb-6 flex items-center gap-2">
                        <i class="fa-solid fa-list-check text-neon-cyan"></i> The Daily Grind
                    </h3>
                    <div class="space-y-4">
                        ${this.renderDailyTask('Claim Loot Drop', 'giveaways')}
                        ${this.renderDailyTask('Solve Poké-Guess', 'pokeguess')}
                        ${this.renderDailyTask('Check OSRS Margins', 'osrs')}
                        ${this.renderDailyTask('Scan Valorant Bundles', 'valorant')}
                    </div>
                </div>
                
                <!-- Adsterra Sidebar Widget -->
                <div class="rounded-3xl overflow-hidden border border-white/5 opacity-50 hover:opacity-100 transition-opacity">
                    <script type="text/javascript">
                        atOptions = {
                            'key' : '5b93a4944853444dddf3758e49112d9e',
                            'format' : 'iframe',
                            'height' : 300,
                            'width' : 160,
                            'params' : {}
                        };
                    </script>
                    <script type="text/javascript" src="https://www.highperformanceformat.com/5b93a4944853444dddf3758e49112d9e/invoke.js"></script>
                </div>
            `;

            // Move existing app-view into contentArea
            const appView = document.getElementById('app-view');
            const parent = appView.parentNode;
            parent.insertBefore(container, appView);
            container.appendChild(contentArea);
            container.appendChild(sidebar);
            contentArea.appendChild(appView);
        }
    }

    renderDailyTask(label, tab) {
        return `
            <div onclick="switchTab('${tab}')" class="flex items-center justify-between p-4 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group">
                <span class="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white">${label}</span>
                <i class="fa-solid fa-chevron-right text-[8px] text-white/20"></i>
            </div>
        `;
    }

    renderLiveMatches() {
        const mount = document.getElementById('live-matches-mount');
        if (!mount) return;

        mount.innerHTML = this.liveMatches.map(m => `
            <div class="p-4 bg-nexus-dark/50 rounded-2xl border ${m.live ? 'border-epic/30' : 'border-white/5'}">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-[8px] font-black uppercase tracking-widest ${m.live ? 'text-epic' : 'text-white/20'}">
                        ${m.live ? '<i class="fa-solid fa-circle text-[6px] animate-pulse mr-1"></i> LIVE' : m.time} // ${m.game}
                    </span>
                    <span class="text-[7px] text-white/20 uppercase font-bold">${m.league}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="font-display text-xs text-white">${m.t1}</span>
                    <span class="font-mono text-sm font-black ${m.live ? 'text-white' : 'text-white/40'}">${m.score}</span>
                    <span class="font-display text-xs text-white">${m.t2}</span>
                </div>
            </div>
        `).join('');
    }

    startPulse() {
        // Randomly inject new events to simulate life
        setInterval(() => {
            const users = ["Viper_7", "RadiantX", "LootGamer", "ShadowHunter", "Ace_Player"];
            const actions = [
                "just checked Albion city-to-city profits",
                "found a rare Vandal skin in the archives",
                "is on a 5-day streak in Wordle!",
                "claimed a free Epic Games mystery title",
                "successfully ported their Sens to CS2"
            ];
            const event = `${users[Math.floor(Math.random()*users.length)]} ${actions[Math.floor(Math.random()*actions.length)]}`;
            
            const ticker = document.querySelector('.animate-pulse-scroll');
            if (ticker) {
                const span = document.createElement('span');
                span.className = 'text-[8px] font-black uppercase tracking-[0.4em] text-white/60 px-8 flex items-center gap-2';
                span.innerHTML = `<i class="fa-solid fa-satellite-dish text-epic"></i> ${event}`;
                ticker.appendChild(span);
                if (ticker.children.length > 20) ticker.removeChild(ticker.children[0]);
            }
        }, 8000);
    }

    setupSearch() {
        // Global Command Search (Future expansion)
        console.log("Global Command Search ready...");
    }
}

// Global Styles Injection
const hubStyles = document.createElement('style');
hubStyles.textContent = `
    @keyframes pulse-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
    .animate-pulse-scroll {
        display: inline-flex;
        animation: pulse-scroll 40s linear infinite;
    }
    #nexus-pulse:hover .animate-pulse-scroll {
        animation-play-state: paused;
    }
    .glass-card {
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(12px);
    }
`;
document.head.appendChild(hubStyles);

window.nexusHub = new NexusHub();
