/**
 * NexusLoot RPG Tracker & Farming Calculator
 */

class LootTracker {
    constructor() {
        this.data = RPG_DATA;
        this.state = this.loadState();
        this.checkResets();
    }

    loadState() {
        const defaultState = {
            dailies: {}, // { id: boolean }
            weeklies: {},
            inventory: {
                'green_crystal': 0, 'blue_crystal': 0, 'purple_crystal': 0, 
                'gold_crystal': 0, 'boss_token': 0, 'credits': 0
            },
            lastDailyReset: new Date().toDateString(),
            nextWeeklyReset: this.getUpcomingMonday().getTime(),
            calcCurrentLevel: 1,
            calcTargetLevel: 90
        };

        const stored = localStorage.getItem('nexus_rpg_tracker');
        return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
    }

    saveState() {
        localStorage.setItem('nexus_rpg_tracker', JSON.stringify(this.state));
        this.updateProgressBar();
        this.updateCalcTotals();
    }

    getUpcomingMonday() {
        const d = new Date();
        d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
        d.setHours(0, 0, 0, 0);
        return d;
    }

    checkResets() {
        const todayStr = new Date().toDateString();
        let changed = false;

        // Daily Reset
        if (this.state.lastDailyReset !== todayStr) {
            this.state.dailies = {};
            this.state.lastDailyReset = todayStr;
            changed = true;
            console.log('NexusTracker: Daily Reset triggered.');
        }

        // Weekly Reset
        const now = new Date().getTime();
        if (now >= this.state.nextWeeklyReset) {
            this.state.weeklies = {};
            this.state.nextWeeklyReset = this.getUpcomingMonday().getTime();
            changed = true;
            console.log('NexusTracker: Weekly Reset triggered.');
        }

        if (changed) this.saveState();
    }

    toggleTask(type, id) {
        this.state[type][id] = !this.state[type][id];
        this.saveState();
        this.renderChecklists(); // re-render to update classes
    }

    updateInventory(matId, delta) {
        this.state.inventory[matId] = Math.max(0, (this.state.inventory[matId] || 0) + delta);
        this.saveState();
        this.renderCalculator(); // re-render inputs
    }

    updateLevels() {
        this.state.calcCurrentLevel = parseInt(document.getElementById('rpg-curr-lvl').value);
        this.state.calcTargetLevel = parseInt(document.getElementById('rpg-tar-lvl').value);
        
        if (this.state.calcCurrentLevel >= this.state.calcTargetLevel) {
            this.state.calcTargetLevel = this.data.levels[this.data.levels.indexOf(this.state.calcCurrentLevel) + 1] || this.state.calcCurrentLevel;
            document.getElementById('rpg-tar-lvl').value = this.state.calcTargetLevel;
        }

        this.saveState();
        this.renderCalculator();
    }

    calculateRequiredMaterials() {
        const reqs = {};
        let counting = false;

        for (const tier of this.data.levelMap) {
            if (tier.level === this.state.calcCurrentLevel) counting = true;
            if (counting) {
                for (const [mat, qty] of Object.entries(tier.req)) {
                    reqs[mat] = (reqs[mat] || 0) + qty;
                }
            }
            if (tier.to === this.state.calcTargetLevel) break;
        }
        return reqs;
    }

    init() {
        this.render();
        this.updateProgressBar();
    }

    render() {
        const mount = document.getElementById('tracker-mount');
        if (!mount) return;

        mount.innerHTML = `
            <div class="game-container animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div class="text-center mb-12">
                    <h1 class="neon-title text-4xl mb-2">Loot Tracker</h1>
                    <p class="text-white/30 text-[10px] uppercase tracking-[0.3em]">Daily Routing & Ascension Protocol</p>
                </div>

                <!-- Master Progress -->
                <div class="mb-12">
                    <div class="flex justify-between items-end mb-2">
                        <span class="text-[10px] uppercase tracking-widest text-white/50">Completion Protocol</span>
                        <span id="tracker-percent" class="text-neon-cyan font-bold text-sm">0%</span>
                    </div>
                    <div class="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div id="tracker-bar" class="h-full bg-neon-cyan transition-all duration-500 shadow-[0_0_10px_#66fcf1]" style="width: 0%"></div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <!-- Left: Checklists -->
                    <div class="space-y-8" id="checklists-mount"></div>

                    <!-- Right: Calculator -->
                    <div class="glass-card bg-[#1f2833] p-8 rounded-3xl border border-white/5 flex flex-col h-full">
                        <h2 class="text-neon-amber uppercase font-bold text-xs mb-6 tracking-widest">Ascension Calculator</h2>
                        
                        <div class="flex gap-4 mb-8">
                            <div class="flex-1">
                                <label class="block text-[8px] uppercase text-white/40 mb-2">Current Level</label>
                                <select id="rpg-curr-lvl" class="w-full bg-nexus-dark border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-neon-amber">
                                    ${this.data.levels.slice(0, -1).map(l => `<option value="${l}" ${this.state.calcCurrentLevel === l ? 'selected' : ''}>Lv. ${l}</option>`).join('')}
                                </select>
                            </div>
                            <div class="flex items-center pt-6 text-white/20"><i class="fa-solid fa-arrow-right"></i></div>
                            <div class="flex-1">
                                <label class="block text-[8px] uppercase text-white/40 mb-2">Target Level</label>
                                <select id="rpg-tar-lvl" class="w-full bg-nexus-dark border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-neon-amber">
                                    ${this.data.levels.slice(1).map(l => `<option value="${l}" ${this.state.calcTargetLevel === l ? 'selected' : ''}>Lv. ${l}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <div id="calc-mount" class="flex-1"></div>
                    </div>
                </div>
            </div>
        `;

        this.renderChecklists();
        this.renderCalculator();

        document.getElementById('rpg-curr-lvl').addEventListener('change', () => this.updateLevels());
        document.getElementById('rpg-tar-lvl').addEventListener('change', () => this.updateLevels());
    }

    renderChecklists() {
        const mount = document.getElementById('checklists-mount');
        if (!mount) return;

        const renderList = (title, items, type, colorClass) => `
            <div class="glass-card bg-[#1f2833] p-6 rounded-3xl border border-white/5">
                <h2 class="${colorClass} uppercase font-bold text-xs mb-4 tracking-widest">${title}</h2>
                <div class="space-y-2">
                    ${items.map(item => {
                        const checked = this.state[type][item.id];
                        return `
                        <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group" onclick="window.lootTracker.toggleTask('${type}', '${item.id}')">
                            <div class="w-5 h-5 rounded border ${checked ? 'border-neon-green bg-neon-green/20 text-neon-green' : 'border-white/20 text-transparent'} flex items-center justify-center transition-all">
                                <i class="fa-solid fa-check text-[10px]"></i>
                            </div>
                            <span class="text-sm ${checked ? 'text-white/30 line-through' : 'text-white/80'} transition-all">${item.label}</span>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        mount.innerHTML = 
            renderList('Daily Routines', this.data.dailies, 'dailies', 'text-neon-green') +
            renderList('Weekly Directives', this.data.weeklies, 'weeklies', 'text-epic');
            
        this.updateProgressBar();
    }

    renderCalculator() {
        const mount = document.getElementById('calc-mount');
        if (!mount) return;

        const required = this.calculateRequiredMaterials();
        const mats = Object.keys(required);

        if (mats.length === 0) {
            mount.innerHTML = `<div class="h-full flex items-center justify-center text-white/20 text-xs uppercase tracking-widest italic">Target reached.</div>`;
            return;
        }

        let html = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`;

        mats.forEach(matId => {
            const reqQty = required[matId];
            const invQty = this.state.inventory[matId] || 0;
            const isComplete = invQty >= reqQty;
            const matDef = this.data.materials[matId];

            html += `
                <div class="bg-nexus-dark p-4 rounded-2xl border ${isComplete ? 'border-neon-green bg-neon-green/5' : 'border-white/5'} transition-colors relative overflow-hidden group">
                    <div class="flex items-center gap-3 mb-3 relative z-10">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: ${matDef.color}20; color: ${matDef.color}">
                            <i class="fa-solid ${matDef.icon}"></i>
                        </div>
                        <div class="flex-1">
                            <div class="text-[9px] text-white/40 uppercase tracking-wider">${matDef.name}</div>
                            <div class="text-white font-bold text-sm"><span class="${isComplete ? 'text-neon-green' : 'text-white'}">${invQty}</span> / ${reqQty}</div>
                        </div>
                    </div>
                    
                    <div class="flex gap-1 relative z-10">
                        <button onclick="window.lootTracker.updateInventory('${matId}', -1)" class="flex-1 bg-white/5 hover:bg-white/10 text-white/50 py-1.5 rounded-lg text-xs transition-colors">-</button>
                        <button onclick="window.lootTracker.updateInventory('${matId}', 1)" class="flex-1 bg-white/5 hover:bg-white/10 text-white/50 py-1.5 rounded-lg text-xs transition-colors">+</button>
                        <button onclick="window.lootTracker.updateInventory('${matId}', 10)" class="flex-1 bg-white/5 hover:bg-white/10 text-white/50 py-1.5 rounded-lg text-[10px] font-bold transition-colors">+10</button>
                    </div>
                    
                    ${isComplete ? `<div class="absolute inset-0 bg-gradient-to-r from-neon-green/0 via-neon-green/5 to-neon-green/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>` : ''}
                </div>
            `;
        });

        html += `</div>`;
        mount.innerHTML = html;
        this.updateCalcTotals();
    }

    updateProgressBar() {
        const total = this.data.dailies.length + this.data.weeklies.length;
        const checked = 
            Object.values(this.state.dailies).filter(Boolean).length + 
            Object.values(this.state.weeklies).filter(Boolean).length;
        
        const pct = Math.round((checked / total) * 100) || 0;
        
        const bar = document.getElementById('tracker-bar');
        const text = document.getElementById('tracker-percent');
        
        if (bar) bar.style.width = `${pct}%`;
        if (text) text.textContent = `${pct}%`;
    }

    updateCalcTotals() {
        // Additional UI logic can go here if needed to summarize totals across all materials
    }
}

window.lootTracker = new LootTracker();