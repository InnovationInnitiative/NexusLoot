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
            opacity: 1.0,
            outline: true,
            outlineThickness: 1,
            dot: false,
            color: '#00ff00'
        };
        this.profiles = JSON.parse(localStorage.getItem('nexus_sens_profiles')) || [];
        this.proProfiles = [
            { name: "TenZ", game: "Valorant", sens: 0.35, dpi: 800, ch: { length: 4, thickness: 2, gap: 2, opacity: 1, color: "#00ff00", outline: true, outlineThickness: 1, dot: false } },
            { name: "S1mple", game: "CS2 / Apex", sens: 3.09, dpi: 400, ch: { length: 3, thickness: 1, gap: -2, opacity: 1, color: "#00ff00", outline: false, outlineThickness: 1, dot: false } },
            { name: "Shroud", game: "Valorant", sens: 0.78, dpi: 450, ch: { length: 5, thickness: 2, gap: 3, opacity: 1, color: "#ffffff", outline: true, outlineThickness: 1, dot: false } },
            { name: "Aspas", game: "Valorant", sens: 0.4, dpi: 800, ch: { length: 2, thickness: 1, gap: 0, opacity: 1, color: "#00ff00", outline: false, outlineThickness: 1, dot: false } }
        ];
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

                <div class="grid grid-cols-1 xl:grid-cols-3 gap-12">
                    <!-- Left: Source -->
                    <div class="glass-card bg-[#1f2833] p-8 rounded-3xl border border-white/5">
                        <h2 class="text-neon-cyan uppercase font-bold text-xs mb-6 tracking-widest flex items-center gap-2">
                            <i class="fa-solid fa-input-numeric"></i> Source
                        </h2>
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

                    <!-- Middle: Target -->
                    <div class="glass-card bg-[#1f2833] p-8 rounded-3xl border border-neon-cyan/20">
                        <h2 class="text-neon-green uppercase font-bold text-xs mb-6 tracking-widest flex items-center gap-2">
                            <i class="fa-solid fa-bolt"></i> Output
                        </h2>
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

                    <!-- Right: Pro Deck -->
                    <div class="glass-card bg-[#1f2833] p-8 rounded-3xl border border-white/5 overflow-hidden flex flex-col">
                        <h2 class="text-epic uppercase font-bold text-xs mb-6 tracking-widest flex items-center gap-2">
                            <i class="fa-solid fa-crown"></i> Pro Archives
                        </h2>
                        <div class="space-y-3 flex-grow overflow-y-auto pr-2 no-scrollbar">
                            ${this.proProfiles.map(p => `
                                <div onclick="window.converter.applyPro('${p.name}')" class="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-epic/50 cursor-pointer transition-all group">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-[10px] font-black uppercase text-white group-hover:text-epic">${p.name}</span>
                                        <span class="text-[8px] text-white/20 uppercase font-bold">${p.game}</span>
                                    </div>
                                    <p class="text-[8px] text-white/40 uppercase tracking-widest">${p.sens} Sens // ${p.dpi} DPI</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Crosshair Section -->
                <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
                    <div class="space-y-6">
                        <h2 class="text-neon-amber uppercase font-bold text-xs mb-6 tracking-widest flex items-center gap-2">
                            <i class="fa-solid fa-eye"></i> Crosshair Studio
                        </h2>
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
                                <label class="block text-[8px] uppercase text-white/40 mb-1">Opacity: <span id="val-opacity">${this.crosshair.opacity}</span></label>
                                <input type="range" id="ch-opacity" min="0.1" max="1.0" step="0.1" value="${this.crosshair.opacity}" class="w-full accent-neon-amber">
                            </div>
                            <div>
                                <label class="block text-[8px] uppercase text-white/40 mb-1">Outline Thickness: <span id="val-outlinethick">${this.crosshair.outlineThickness}</span></label>
                                <input type="range" id="ch-outlinethick" min="1" max="5" value="${this.crosshair.outlineThickness}" class="w-full accent-neon-amber">
                            </div>
                            <div>
                                <label class="block text-[8px] uppercase text-white/40 mb-1">Color</label>
                                <input type="color" id="ch-color" value="${this.crosshair.color}" class="w-full h-8 bg-transparent border-none rounded cursor-pointer">
                            </div>
                        </div>
                        <div class="flex items-center gap-6 pt-2">
                            <div class="flex items-center gap-2">
                                <input type="checkbox" id="ch-dot" ${this.crosshair.dot ? 'checked' : ''} class="w-4 h-4 rounded accent-neon-amber">
                                <label for="ch-dot" class="text-[10px] uppercase text-white/60">Center Dot</label>
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="checkbox" id="ch-outline" ${this.crosshair.outline ? 'checked' : ''} class="w-4 h-4 rounded accent-neon-amber">
                                <label for="ch-outline" class="text-[10px] uppercase text-white/60">Outlines</label>
                            </div>
                        </div>
                        <div class="pt-4 space-y-2">
                            <button onclick="window.converter.saveProfile()" class="w-full py-4 bg-neon-cyan text-arcade-bg font-black rounded-2xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(102,252,241,0.3)] hover:scale-[1.02] transition-all">Save My Config</button>
                            <div class="flex gap-2">
                                <button onclick="window.converter.exportCS2(event)" class="flex-1 py-3 bg-[#ff8c00]/10 hover:bg-[#ff8c00]/20 text-[#ff8c00] border border-[#ff8c00]/30 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Copy CS2 Cmds</button>
                                <button onclick="window.converter.exportValorant(event)" class="flex-1 py-3 bg-[#ff4655]/10 hover:bg-[#ff4655]/20 text-[#ff4655] border border-[#ff4655]/30 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Copy Val Specs</button>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col items-center justify-center">
                        <div class="relative w-[250px] h-[250px] rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80" class="absolute inset-0 w-full h-full object-cover opacity-40">
                            <canvas id="crosshair-preview" width="250" height="250" class="relative z-10"></canvas>
                        </div>
                        <p class="text-[8px] text-white/20 mt-4 uppercase tracking-widest italic">Live Neural Rendering</p>
                    </div>
                </div>

                <!-- Saved Profiles -->
                <div id="profiles-container" class="mt-12 pt-12 border-t border-white/5">
                    <h2 class="text-white/40 uppercase font-bold text-[10px] mb-6 tracking-widest">User Tactical Deck</h2>
                    <div id="profiles-list" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <!-- Profiles will be injected here -->
                    </div>
                </div>
            </div>
        `;
        this.renderProfiles();
    }

    applyPro(name) {
        const p = this.proProfiles.find(pro => pro.name === name);
        if (!p) return;

        document.getElementById('source-game').value = p.game;
        document.getElementById('source-sens').value = p.sens;
        document.getElementById('mouse-dpi').value = p.dpi;
        
        this.crosshair = { ...p.ch };
        
        document.getElementById('ch-length').value = p.ch.length;
        document.getElementById('ch-thickness').value = p.ch.thickness;
        document.getElementById('ch-gap').value = p.ch.gap;
        document.getElementById('ch-opacity').value = p.ch.opacity;
        document.getElementById('ch-outlinethick').value = p.ch.outlineThickness;
        document.getElementById('ch-color').value = p.ch.color;
        document.getElementById('ch-dot').checked = !!p.ch.dot;
        document.getElementById('ch-outline').checked = !!p.ch.outline;

        this.handleUpdate();
        
        // Visual feedback
        const center = document.querySelector('.neon-title');
        center.classList.add('animate-pulse', 'text-epic');
        setTimeout(() => center.classList.remove('animate-pulse', 'text-epic'), 1000);
    }

    setupEventListeners() {
        const ids = ['source-game', 'target-game', 'source-sens', 'mouse-dpi', 'ch-length', 'ch-thickness', 'ch-gap', 'ch-opacity', 'ch-outlinethick', 'ch-color', 'ch-dot', 'ch-outline'];
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
            opacity: parseFloat(document.getElementById('ch-opacity').value),
            outline: document.getElementById('ch-outline').checked,
            outlineThickness: parseInt(document.getElementById('ch-outlinethick').value),
            dot: document.getElementById('ch-dot').checked,
            color: document.getElementById('ch-color').value
        };

        // Update labels
        document.getElementById('val-length').textContent = this.crosshair.length;
        document.getElementById('val-thickness').textContent = this.crosshair.thickness;
        document.getElementById('val-gap').textContent = this.crosshair.gap;
        document.getElementById('val-opacity').textContent = this.crosshair.opacity;
        document.getElementById('val-outlinethick').textContent = this.crosshair.outlineThickness;

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

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }

    drawCrosshair() {
        const canvas = document.getElementById('crosshair-preview');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { length, thickness, gap, opacity, outline, outlineThickness, dot, color } = this.crosshair;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const midX = canvas.width / 2;
        const midY = canvas.height / 2;

        const drawLines = (ctxToDraw) => {
            // Top
            ctxToDraw.beginPath(); ctxToDraw.moveTo(midX, midY - gap - length); ctxToDraw.lineTo(midX, midY - gap); ctxToDraw.stroke();
            // Bottom
            ctxToDraw.beginPath(); ctxToDraw.moveTo(midX, midY + gap); ctxToDraw.lineTo(midX, midY + gap + length); ctxToDraw.stroke();
            // Left
            ctxToDraw.beginPath(); ctxToDraw.moveTo(midX - gap - length, midY); ctxToDraw.lineTo(midX - gap, midY); ctxToDraw.stroke();
            // Right
            ctxToDraw.beginPath(); ctxToDraw.moveTo(midX + gap, midY); ctxToDraw.lineTo(midX + gap + length, midY); ctxToDraw.stroke();
        };

        // Draw Outlines first if enabled
        if (outline) {
            ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
            ctx.lineWidth = thickness + outlineThickness * 2;
            ctx.lineCap = 'butt';
            drawLines(ctx);
            if (dot) {
                ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
                const fullThick = thickness + outlineThickness * 2;
                ctx.fillRect(midX - fullThick/2, midY - fullThick/2, fullThick, fullThick);
            }
        }

        // Draw Inner Lines
        ctx.strokeStyle = this.hexToRgba(color, opacity);
        ctx.lineWidth = thickness;
        ctx.lineCap = 'butt';
        drawLines(ctx);
        if (dot) {
            ctx.fillStyle = this.hexToRgba(color, opacity);
            ctx.fillRect(midX - thickness/2, midY - thickness/2, thickness, thickness);
        }
    }

    flashButton(btn, text) {
        const originalText = btn.textContent;
        const originalClasses = btn.className;
        btn.textContent = text;
        btn.className = `flex-1 py-3 bg-neon-cyan/40 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-neon-cyan/50`;
        setTimeout(() => {
            btn.textContent = originalText;
            btn.className = originalClasses;
        }, 1500);
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

    exportCS2(e) {
        const { length, thickness, gap, opacity, outline, outlineThickness, dot, color } = this.crosshair;
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const alpha = Math.round(opacity * 255);
        
        const cmds = `cl_crosshairsize ${length}; cl_crosshairthickness ${thickness}; cl_crosshairgap ${gap}; cl_crosshaircolor 5; cl_crosshaircolor_r ${r}; cl_crosshaircolor_g ${g}; cl_crosshaircolor_b ${b}; cl_crosshairalpha ${alpha}; cl_crosshairusealpha 1; cl_crosshair_drawoutline ${outline ? 1 : 0}; cl_crosshair_outlinethickness ${outlineThickness}; cl_crosshairdot ${dot ? 1 : 0};`;
        
        navigator.clipboard.writeText(cmds);
        this.flashButton(e.target, 'COPIED CS2 CMDS');
    }

    exportValorant(e) {
        const { length, thickness, gap, opacity, outline, outlineThickness, dot, color } = this.crosshair;
        
        const specs = `Valorant Crosshair Blueprint:
- Color: ${color}
- Outlines: ${outline ? 'On' : 'Off'} (Opacity: ${opacity}, Thickness: ${outlineThickness})
- Center Dot: ${dot ? 'On' : 'Off'} (Opacity: ${opacity}, Thickness: ${thickness})
- Inner Lines: On
- Inner Line Opacity: ${opacity}
- Inner Line Length: ${length}
- Inner Line Thickness: ${thickness}
- Inner Line Offset (Gap): ${gap}`;

        navigator.clipboard.writeText(specs);
        this.flashButton(e.target, 'COPIED VAL SPECS');
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
        
        document.getElementById('ch-length').value = p.crosshair.length || 4;
        document.getElementById('ch-thickness').value = p.crosshair.thickness || 2;
        document.getElementById('ch-gap').value = p.crosshair.gap || 2;
        document.getElementById('ch-opacity').value = p.crosshair.opacity || 1.0;
        document.getElementById('ch-outlinethick').value = p.crosshair.outlineThickness || 1;
        document.getElementById('ch-color').value = p.crosshair.color || '#00ff00';
        document.getElementById('ch-dot').checked = !!p.crosshair.dot;
        document.getElementById('ch-outline').checked = !!p.crosshair.outline;
        
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
