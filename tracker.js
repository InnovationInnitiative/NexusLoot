/**
 * NexusLoot MMO Market Engine - Full Market Trade Helper
 */

class MarketTracker {
    constructor() {
        this.activeGame = 'osrs'; // 'osrs' or 'albion'
        this.isLoading = false;
        
        // OSRS State
        this.osrsMapping = null;
        this.osrsPrices = null;
        this.osrsMerged = [];
        
        // Albion State (Pre-defined watchlist of popular trading items)
        this.albionWatchlist = [
            "T4_BAG", "T5_BAG", "T6_BAG", "T7_BAG", "T8_BAG",
            "T4_MOUNT_HORSE", "T5_MOUNT_HORSE", "T8_MOUNT_HORSE",
            "T4_MEAL_STEW", "T6_MEAL_STEW", "T8_MEAL_STEW",
            "T4_POTION_HEAL", "T6_POTION_HEAL", "T8_POTION_HEAL",
            "T4_WOOD", "T5_WOOD", "T6_WOOD", "T7_WOOD", "T8_WOOD",
            "T4_ORE", "T5_ORE", "T6_ORE", "T7_ORE", "T8_ORE",
            "T4_MAIN_SWORD", "T5_MAIN_SWORD", "T6_MAIN_SWORD"
        ];
        this.albionMerged = [];

        this.searchTerm = '';
        this.sortBy = 'margin'; // 'margin', 'roi', 'volume' (if avail)
    }

    init(gameId) {
        this.activeGame = gameId;
        this.searchTerm = '';
        this.renderShell();
        
        if (!this.marketCache[gameId]) {
            this.fetchData();
        } else {
            this.renderTable();
        }
    }

    forceRefresh() {
        if (this.isLoading) return;
        // Don't clear mapping, just the prices cache
        this.marketCache[this.activeGame] = null;
        this.fetchData();
    }

    async fetchData() {
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
        // Fetch Mapping if not cached
        if (!this.osrsMapping) {
            const mapRes = await fetch("https://prices.runescape.wiki/api/v1/osrs/mapping");
            this.osrsMapping = await mapRes.json();
        }
        
        // Fetch Latest Prices for ALL items
        const priceRes = await fetch("https://prices.runescape.wiki/api/v1/osrs/latest");
        const json = await priceRes.json();
        this.osrsPrices = json.data;

        // Merge and compute
        this.osrsMerged = [];
        for (const item of this.osrsMapping) {
            const priceData = this.osrsPrices[item.id];
            if (priceData && priceData.high && priceData.low) {
                const margin = priceData.high - priceData.low;
                const roi = priceData.low > 0 ? (margin / priceData.low) * 100 : 0;
                
                // Only include items with a sensible limit and profit
                if (item.limit && margin > 0) {
                    this.osrsMerged.push({
                        id: item.id,
                        name: item.name,
                        icon: `https://oldschool.runescape.wiki/images/${item.icon.replace(/ /g, '_')}`,
                        high: priceData.high,
                        low: priceData.low,
                        margin: margin,
                        roi: roi,
                        limit: item.limit
                    });
                }
            }
        }
        this.renderTable();
    }

    async fetchAlbion() {
        const itemStr = this.albionWatchlist.join(',');
        const url = `https://west.albion-online-data.com/api/v2/stats/Prices/${itemStr}.json`;
        const res = await fetch(url);
        const json = await res.json();

        const aggregated = {};
        json.forEach(entry => {
            if (!aggregated[entry.item_id]) {
                aggregated[entry.item_id] = { high: 0, low: Infinity, name: entry.item_id.replace(/_/g, ' ') };
            }
            if (entry.buy_price_max > aggregated[entry.item_id].high) {
                aggregated[entry.item_id].high = entry.buy_price_max;
            }
            if (entry.sell_price_min > 0 && entry.sell_price_min < aggregated[entry.item_id].low) {
                aggregated[entry.item_id].low = entry.sell_price_min;
            }
        });

        this.albionMerged = [];
        for (const [id, data] of Object.entries(aggregated)) {
            if (data.high > 0 && data.low !== Infinity) {
                // In Albion: low sell order is what you BUY at (cost), high buy order is what you SELL at (revenue).
                // Wait, typical flipping: Buy via Buy Order (pay high buy_price_max), Sell via Sell Order (receive low sell_price_min).
                const buyOrder = data.high;
                const sellOrder = data.low;
                const margin = sellOrder - buyOrder; // Revenue - Cost
                const roi = buyOrder > 0 ? (margin / buyOrder) * 100 : 0;

                this.albionMerged.push({
                    id: id,
                    name: data.name,
                    icon: `https://render.albiononline.com/v1/item/${id}.png`,
                    buyOrder: buyOrder, // Cost to setup buy order
                    sellOrder: sellOrder, // Revenue from sell order
                    margin: margin,
                    roi: roi,
                    limit: 'N/A'
                });
            }
        }
        this.renderTable();
    }

    handleSearch(val) {
        this.searchTerm = val.toLowerCase();
        this.renderTable();
    }

    handleSort(val) {
        this.sortBy = val;
        this.renderTable();
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'm';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toLocaleString();
    }

    renderShell() {
        const mount = document.getElementById('tracker-mount');
        if (!mount) return;

        const gameName = this.data[this.activeGame].name;

        mount.innerHTML = `
            <div class="game-container animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 class="neon-title text-4xl mb-1">${gameName} Market</h1>
                        <p class="text-white/30 text-[10px] uppercase tracking-[0.3em]">Live Trade Helper & Margin Calculator</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="window.marketTracker.forceRefresh()" class="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest bg-white/5 text-white/40 hover:bg-white/10 transition-all">
                            <i class="fa-solid fa-arrows-rotate mr-2"></i> Refresh Data
                        </button>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4 mb-6">
                    <input type="text" placeholder="Search items..." oninput="window.marketTracker.handleSearch(this.value)" class="flex-1 bg-[#1f2833] border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-neon-cyan">
                    <select onchange="window.marketTracker.handleSort(this.value)" class="bg-[#1f2833] border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-neon-cyan min-w-[200px]">
                        <option value="margin">Sort by Highest Margin</option>
                        <option value="roi">Sort by Highest ROI %</option>
                    </select>
                </div>

                <div class="glass-card bg-[#1f2833] rounded-3xl border border-white/5 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm whitespace-nowrap">
                            <thead class="bg-nexus-dark/50 text-white/40 uppercase tracking-widest text-[10px]">
                                <tr>
                                    <th class="p-4 rounded-tl-3xl">Item</th>
                                    <th class="p-4">${this.activeGame === 'osrs' ? 'Insta-Buy' : 'Buy Order (Cost)'}</th>
                                    <th class="p-4">${this.activeGame === 'osrs' ? 'Insta-Sell' : 'Sell Order (Rev)'}</th>
                                    <th class="p-4">Margin</th>
                                    <th class="p-4">ROI</th>
                                    <th class="p-4 rounded-tr-3xl">Limit</th>
                                </tr>
                            </thead>
                            <tbody id="market-tbody" class="text-white/80">
                                <!-- Data inject -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderLoading() {
        const tbody = document.getElementById('market-tbody');
        if (!tbody) return;
        tbody.innerHTML = Array(5).fill(0).map(() => `
            <tr class="border-t border-white/5">
                <td colspan="6" class="p-4"><div class="h-8 bg-white/[0.02] rounded-lg shimmer"></div></td>
            </tr>
        `).join('');
    }

    renderError() {
        const tbody = document.getElementById('market-tbody');
        if (!tbody) return;
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="p-12 text-center">
                    <i class="fa-solid fa-triangle-exclamation text-neon-red text-4xl mb-4"></i>
                    <p class="text-white/50 text-sm uppercase tracking-widest">Market API Offline or CORS Blocked.</p>
                </td>
            </tr>
        `;
    }

    renderTable() {
        const tbody = document.getElementById('market-tbody');
        if (!tbody) return;

        let data = this.activeGame === 'osrs' ? [...this.osrsMerged] : [...this.albionMerged];

        // Filter
        if (this.searchTerm) {
            data = data.filter(d => d.name.toLowerCase().includes(this.searchTerm));
        }

        // Sort
        if (this.sortBy === 'margin') {
            data.sort((a, b) => b.margin - a.margin);
        } else if (this.sortBy === 'roi') {
            data.sort((a, b) => b.roi - a.roi);
        }

        // Slice top 100 for performance
        data = data.slice(0, 100);

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-white/30 italic">No items found.</td></tr>`;
            return;
        }

        const curr = this.activeGame === 'osrs' ? 'GP' : 'S';

        tbody.innerHTML = data.map(item => {
            const cost = this.activeGame === 'osrs' ? item.high : item.buyOrder;
            const rev = this.activeGame === 'osrs' ? item.low : item.sellOrder;

            return `
                <tr class="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td class="p-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded bg-nexus-dark flex items-center justify-center p-1 border border-white/10">
                                <img src="${item.icon}" onerror="this.style.display='none'" class="max-w-full max-h-full">
                            </div>
                            <span class="font-bold text-white truncate max-w-[200px]">${item.name}</span>
                        </div>
                    </td>
                    <td class="p-4 font-mono text-neon-red">${this.formatNumber(cost)}</td>
                    <td class="p-4 font-mono text-neon-green">${this.formatNumber(rev)}</td>
                    <td class="p-4 font-mono text-neon-cyan font-bold">${this.formatNumber(item.margin)}</td>
                    <td class="p-4 font-mono text-white/60">${item.roi.toFixed(1)}%</td>
                    <td class="p-4 font-mono text-white/40">${item.limit}</td>
                </tr>
            `;
        }).join('');
    }
}

window.marketTracker = new MarketTracker();