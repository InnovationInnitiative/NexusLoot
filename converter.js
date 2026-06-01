/**
 * NexusLoot Sensitivity & Crosshair Engine
 */

const SENS_DATA = {
    'Valorant': 1.0,
    'CS2 / Apex': 3.1818,
    'Overwatch 2 / CoD': 10.606,
    'Rainbow Six Siege': 12.121,
    'Fortnite': 25.4,
    'Quake / Source': 3.1818
};

class SensConverter {
    constructor() {
        this.sourceGame = 'Valorant';
        this.targetGame = 'CS2 / Apex';
        this.sourceSens = 0.5;
        this.dpi = 800;
        this.crosshair = {
            length: 4,
            thickness: 2,
            gap: 2,
            dot: false,
            color: '#00ff00'
        };
        this.profiles = JSON.parse(localStorage.getItem('nexus_sens_profiles')) || [];
    }

    init() {
        this.render();
        this.setupEventListeners();
        this.updateConversion();
        this.drawCrosshair();
    }

    render() {
        const mount = document.getElementById('converter-mount');
        if (!mount) return;

        mount.innerHTML = `
            <div class="game-container animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div class="text-center mb-12">
                    <h1 class="neon-title text-4xl mb-2">Sensitivity Converter</h1>
                    <p class="text-white/30 text-[10px] uppercase tracking-[0.3em]">Pro-Gamer Precision // Cross-Game Sync</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <!-- Left: Source -->
                    <div class="glass-card bg-[#1f2833] p-8 rounded-3xl border border-white/5">
                        <h2 class="text-neon-cyan uppercase font-bold text-xs mb-6 tracking-widest">Source Configuration</h2>
                        <div class="space-y-6">
                            <div>
                                <label class="block text-[10px] uppercase text-white/40 mb-2">Game</label>
                                <select id="source-game" class="w-full bg-nexus-dark border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-neon-cyan transition-colors">
                                    ${Object.keys(SENS_DATA).map(g => `<option value="${g}">${g}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] uppercase text-white/40 mb-2">Sensitivity</label>
                                <input type="number" id="source-sens" step="0.001" value="${this.sourceSens}" class="w-full bg-nexus-dark border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-neon-cyan">
                            </div>
                            <div>
                                <label class="block text-[10px] uppercase text-white/40 mb-2">Mouse DPI</label>
                                <input type="number" id="mouse-dpi" value="${this.dpi}" class="w-full bg-nexus-dark border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-neon-cyan">
                            </div>
                        </div>
                    </div>

                    <!-- Right: Target -->
                    <div class="glass-card bg-[#1f2833] p-8 rounded-3xl border border-neon-cyan/20">
                        <h2 class="text-neon-green uppercase font-bold text-xs mb-6 tracking-widest">Target Output</h2>
                        <div class="space-y-6">
                            <div>
                                <label class="block text-[10px] uppercase text-white/40 mb-2">Target Game</label>
                                <select id="target-game" class="w-full bg-nexus-dark border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-neon-green transition-colors">
                                    ${Object.keys(SENS_DATA).map(g => `<option value="${g}" ${g === this.targetGame ? 'selected' : ''}>${g}</option>`).join('')}
                                </select>
                            </div>
                            <div class="relative">
                                <label class="block text-[10px] uppercase text-white/40 mb-2">Converted Sens</label>
                                <div id="target-sens-display" class="bg-nexus-dark border border-neon-green/30 rounded-xl p-6 text-3xl font-black text-white text-center">0.000</div>
                                <button onclick="window.converter.copySens()" class="mt-4 w-full py-3 bg-neon-green/10 hover:bg-neon-green/20 text-neon-green rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Copy to Clipboard</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Crosshair Section -->
                <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
                    <div class="space-y-6">
                        <h2 class="text-neon-amber uppercase font-bold text-xs mb-6 tracking-widest">Crosshair Generator</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[8px] uppercase text-white/40 mb-1">Length: <span id="val-length">${this.crosshair.length}</span></label>
                                <input type="range" id="ch-length" min="1" max="20" value="${this.crosshair.length}" class="w-full accent-neon-amber">
                            </div>
                            <div>
                                <label class="block text-[8px] uppercase text-white/40 mb-1">Thickness: <span id="val-thickness">${this.crosshair.thickness}</span></label>
                                <input type="range" id="ch-thickness" min="1" max="10" value="${this.crosshair.thickness}" class="w-full accent-neon-amber">
                            </div>
                            <div>
                                <label class="block text-[8px] uppercase text-white/40 mb-1">Gap: <span id="val-gap">${this.crosshair.gap}</span></label>
                                <input type="range" id="ch-gap" min="-10" max="20" value="${this.crosshair.gap}" class="w-full accent-neon-amber">
                            </div>
                            <div>
                                <label class="block text-[8px] uppercase text-white/40 mb-1">Color</label>
                                <input type="color" id="ch-color" value="${this.crosshair.color}" class="w-full h-8 bg-transparent border-none rounded cursor-pointer">
                            </div>
                        </div>
                        <div class="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="ch-dot" ${this.crosshair.dot ? 'checked' : ''} class="w-4 h-4 rounded accent-neon-amber">
                            <label for="ch-dot" class="text-[10px] uppercase text-white/60">Center Dot</label>
                        </div>
                        <button onclick="window.converter.saveProfile()" class="w-full py-4 bg-neon-cyan text-arcade-bg font-black rounded-2xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(102,252,241,0.3)] hover:scale-[1.02] transition-all">Save Profile</button>
                    </div>

                    <div class="flex flex-col items-center justify-center">
                        <div class="relative w-[250px] h-[250px] rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80" class="absolute inset-0 w-full h-full object-cover opacity-40">
                            <canvas id="crosshair-preview" width="250" height="250" class="relative z-10"></canvas>
                        </div>
                        <p class="text-[8px] text-white/20 mt-4 uppercase tracking-widest">Live Visual Neural-Link</p>
                    </div>
                </div>

                <!-- Saved Profiles -->
                <div id="profiles-container" class="mt-12 pt-12 border-t border-white/5">
                    <h2 class="text-white/40 uppercase font-bold text-[10px] mb-6 tracking-widest">My Saved Profiles</h2>
                    <div id="profiles-list" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <!-- Profiles will be injected here -->
                    </div>
                </div>
            </div>
        `;
        this.renderProfiles();
    }

    setupEventListeners() {
        const ids = ['source-game', 'target-game', 'source-sens', 'mouse-dpi', 'ch-length', 'ch-thickness', 'ch-gap', 'ch-color', 'ch-dot'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', () => this.handleUpdate());
        });
    }

    handleUpdate() {
        this.sourceGame = document.getElementById('source-game').value;
        this.targetGame = document.getElementById('target-game').value;
        this.sourceSens = parseFloat(document.getElementById('source-sens').value) || 0;
        this.dpi = parseInt(document.getElementById('mouse-dpi').value) || 0;
        
        this.crosshair = {
            length: parseInt(document.getElementById('ch-length').value),
            thickness: parseInt(document.getElementById('ch-thickness').value),
            gap: parseInt(document.getElementById('ch-gap').value),
            dot: document.getElementById('ch-dot').checked,
            color: document.getElementById('ch-color').value
        };

        // Update labels
        document.getElementById('val-length').textContent = this.crosshair.length;
        document.getElementById('val-thickness').textContent = this.crosshair.thickness;
        document.getElementById('val-gap').textContent = this.crosshair.gap;

        this.updateConversion();
        this.drawCrosshair();
    }

    updateConversion() {
        const sourceMult = SENS_DATA[this.sourceGame];
        const targetMult = SENS_DATA[this.targetGame];
        const converted = (this.sourceSens / sourceMult) * targetMult;
        
        const display = document.getElementById('target-sens-display');
        if (display) display.textContent = converted.toFixed(4);
    }

    drawCrosshair() {
        const canvas = document.getElementById('crosshair-preview');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { length, thickness, gap, dot, color } = this.crosshair;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.lineCap = 'butt';

        const midX = canvas.width / 2;
        const midY = canvas.height / 2;

        // Top
        ctx.beginPath();
        ctx.moveTo(midX, midY - gap - length);
        ctx.lineTo(midX, midY - gap);
        ctx.stroke();

        // Bottom
        ctx.beginPath();
        ctx.moveTo(midX, midY + gap);
        ctx.lineTo(midX, midY + gap + length);
        ctx.stroke();

        // Left
        ctx.beginPath();
        ctx.moveTo(midX - gap - length, midY);
        ctx.lineTo(midX - gap, midY);
        ctx.stroke();

        // Right
        ctx.beginPath();
        ctx.moveTo(midX + gap, midY);
        ctx.lineTo(midX + gap + length, midY);
        ctx.stroke();

        if (dot) {
            ctx.fillStyle = color;
            ctx.fillRect(midX - thickness/2, midY - thickness/2, thickness, thickness);
        }
    }

    copySens() {
        const sens = document.getElementById('target-sens-display').textContent;
        navigator.clipboard.writeText(sens);
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'COPIED!';
        btn.classList.add('text-white', 'bg-neon-green/40');
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('text-white', 'bg-neon-green/40');
        }, 1000);
    }

    saveProfile() {
        const profile = {
            id: Date.now(),
            name: `${this.sourceGame} -> ${this.targetGame}`,
            sourceGame: this.sourceGame,
            targetGame: this.targetGame,
            sourceSens: this.sourceSens,
            dpi: this.dpi,
            crosshair: { ...this.crosshair }
        };
        this.profiles.unshift(profile);
        if (this.profiles.length > 8) this.profiles.pop();
        localStorage.setItem('nexus_sens_profiles', JSON.stringify(this.profiles));
        this.renderProfiles();
    }

    loadProfile(id) {
        const p = this.profiles.find(p => p.id === id);
        if (!p) return;
        
        document.getElementById('source-game').value = p.sourceGame;
        document.getElementById('target-game').value = p.targetGame;
        document.getElementById('source-sens').value = p.sourceSens;
        document.getElementById('mouse-dpi').value = p.dpi;
        document.getElementById('ch-length').value = p.crosshair.length;
        document.getElementById('ch-thickness').value = p.crosshair.thickness;
        document.getElementById('ch-gap').value = p.crosshair.gap;
        document.getElementById('ch-color').value = p.crosshair.color;
        document.getElementById('ch-dot').checked = p.crosshair.dot;
        
        this.handleUpdate();
    }

    renderProfiles() {
        const list = document.getElementById('profiles-list');
        if (!list) return;

        if (this.profiles.length === 0) {
            list.innerHTML = `<p class="col-span-full text-[8px] text-white/10 uppercase italic">No configurations stored in local deck.</p>`;
            return;
        }

        list.innerHTML = this.profiles.map(p => `
            <div onclick="window.converter.loadProfile(${p.id})" class="bg-nexus-dark border border-white/5 p-4 rounded-2xl cursor-pointer hover:border-neon-cyan/50 transition-all group">
                <p class="text-[8px] font-bold text-white group-hover:text-neon-cyan truncate mb-1">${p.name}</p>
                <p class="text-[7px] text-white/30 uppercase">${p.dpi} DPI // ${p.sourceSens} Sens</p>
            </div>
        `).join('');
    }
}

window.converter = new SensConverter();
