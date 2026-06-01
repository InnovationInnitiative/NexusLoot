/**
 * NexusLoot MMO Market Tracker
 */

class MarketTracker {
    constructor() {
        this.data = MMO_DATA;
        this.activeGame = 'osrs'; // Default game
        this.marketCache = { osrs: null, albion: null };
        this.isLoading = false;
    }

    init() {
        this.render();
        this.fetchMarketData();
    }

    switchGame(gameId) {
        if (this.activeGame === gameId || this.isLoading) return;
        this.activeGame = gameId;
        this.render();
        if (!this.marketCache[gameId]) {
            this.fetchMarketData();
        } else {
            this.renderMarketGrid();
        }
    }

    async fetchMarketData() {
        this.isLoading = true;
        this.renderLoading();

        try {
            if (this.activeGame === 'osrs') {
                await this.fetchOSRS();
            } else if (this.activeGame === 'albion') {
                await this.fetchAlbion();
            }
        } catch (err) {
            console.error("Market fetch failed:", err);
            this.renderError();
        } finally {
            this.isLoading = false;
        }
    }

    async fetchOSRS() {
        const itemIds = this.data.osrs.items.map(i => i.id).join('&id=');
        const url = `${this.data.osrs.api}${itemIds}`;
        // OSRS Wiki API generally allows CORS, try direct fetch
        const response = await fetch(url);
        const json = await response.json();
        this.marketCache.osrs = json.data;
        this.renderMarketGrid();
    }

    async fetchAlbion() {
        const itemIds = this.data.albion.items.map(i => i.id).join(',');
        const url = `${this.data.albion.api}${itemIds}.json`;
        // Albion Data API allows CORS, try direct fetch
        const response = await fetch(url);
        const json = await response.json();
        
        // Albion returns an array. We need to aggregate by item ID across cities.
        // We will just take the highest buy order and lowest sell order across any city for simplicity.
        const aggregated = {};
        json.forEach(entry => {
            if (!aggregated[entry.item_id]) {
                aggregated[entry.item_id] = { high: 0, low: Infinity };
            }
            if (entry.buy_price_max > aggregated[entry.item_id].high) {
                aggregated[entry.item_id].high = entry.buy_price_max;
            }
            if (entry.sell_price_min > 0 && entry.sell_price_min < aggregated[entry.item_id].low) {
                aggregated[entry.item_id].low = entry.sell_price_min;
            }
        });
        
        this.marketCache.albion = aggregated;
        this.renderMarketGrid();
    }

    formatNumber(num) {
        if (num === Infinity || num === 0 || !num) return "N/A";
        return num.toLocaleString();
    }

    render() {
        const mount = document.getElementById('tracker-mount');
        if (!mount) return;

        mount.innerHTML = `
            <div class="game-container animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div class="text-center mb-12">
                    <h1 class="neon-title text-4xl mb-2">MMO Market Live</h1>
                    <p class="text-white/30 text-[10px] uppercase tracking-[0.3em]">Real-time Grand Exchange & Black Market Data</p>
                </div>

                <div class="flex justify-center gap-4 mb-10 border-b border-white/5 pb-4">
                    <button onclick="window.marketTracker.switchGame('osrs')" class="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${this.activeGame === 'osrs' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/50' : 'bg-white/5 text-white/40 hover:bg-white/10'}">
                        <i class="fa-solid fa-coins mr-2"></i> OSRS
                    </button>
                    <button onclick="window.marketTracker.switchGame('albion')" class="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${this.activeGame === 'albion' ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/50' : 'bg-white/5 text-white/40 hover:bg-white/10'}">
                        <i class="fa-solid fa-ring mr-2"></i> Albion
                    </button>
                </div>

                <div id="market-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Market items injected here -->
                </div>
            </div>
        `;
    }

    renderLoading() {
        const grid = document.getElementById('market-grid');
        if (!grid) return;
        grid.innerHTML = Array(8).fill(0).map(() => `
            <div class="h-48 bg-white/[0.02] rounded-3xl shimmer border border-white/5"></div>
        `).join('');
    }

    renderError() {
        const grid = document.getElementById('market-grid');
        if (!grid) return;
        grid.innerHTML = `
            <div class="col-span-full py-20 text-center">
                <i class="fa-solid fa-triangle-exclamation text-neon-red text-4xl mb-4"></i>
                <p class="text-white/50 text-sm uppercase tracking-widest">Market API Offline or CORS Blocked.</p>
            </div>
        `;
    }

    renderMarketGrid() {
        const grid = document.getElementById('market-grid');
        if (!grid) return;

        const game = this.data[this.activeGame];
        const cache = this.marketCache[this.activeGame];

        let html = '';
        game.items.forEach(item => {
            const data = cache[item.id];
            
            let high = 0, low = 0, margin = 0;

            if (this.activeGame === 'osrs' && data) {
                // OSRS: high = instantly buy price, low = instantly sell price
                high = data.high;
                low = data.low;
                margin = high - low;
            } else if (this.activeGame === 'albion' && data) {
                // Albion: high = highest buy order, low = lowest sell order
                high = data.low; // To buy it instantly, you pay the lowest sell order
                low = data.high; // To sell it instantly, you sell to the highest buy order
                margin = high - low;
            }

            html += `
                <div class="glass-card bg-[#1f2833] rounded-3xl p-6 border border-white/5 hover:border-${game.color.slice(1)}/40 transition-all group flex flex-col justify-between">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-12 h-12 rounded-xl bg-nexus-dark border border-white/10 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                            <img src="${item.img}" alt="${item.name}" class="max-w-full max-h-full object-contain filter drop-shadow-[0_0_5px_${game.color}80]">
                        </div>
                        <div>
                            <h3 class="text-white font-bold text-sm leading-tight">${item.name}</h3>
                            <span class="text-[8px] text-white/40 uppercase tracking-widest">ID: ${item.id}</span>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div class="flex justify-between items-center bg-nexus-dark/50 p-2.5 rounded-lg border border-neon-red/10">
                            <span class="text-[9px] text-neon-red uppercase tracking-widest font-bold">Insta-Buy</span>
                            <span class="text-white text-xs font-mono">${this.formatNumber(high)} <span class="text-white/30 text-[8px]">${game.currency}</span></span>
                        </div>
                        <div class="flex justify-between items-center bg-nexus-dark/50 p-2.5 rounded-lg border border-neon-green/10">
                            <span class="text-[9px] text-neon-green uppercase tracking-widest font-bold">Insta-Sell</span>
                            <span class="text-white text-xs font-mono">${this.formatNumber(low)} <span class="text-white/30 text-[8px]">${game.currency}</span></span>
                        </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                        <span class="text-[8px] text-white/40 uppercase tracking-widest">Est. Margin</span>
                        <span class="text-[10px] font-bold ${margin > 0 ? 'text-neon-cyan' : 'text-white/30'}">${this.formatNumber(margin)}</span>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
    }
}

window.marketTracker = new MarketTracker();