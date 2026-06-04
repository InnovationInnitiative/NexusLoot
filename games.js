/**
 * NexusLoot Daily Games Engine
 * Handles Pokemon Guessing, League Guessing, and Wordle.
 */

class GamesEngine {
    constructor() {
        this.activeGame = 'pokemon'; // 'pokemon', 'league', 'wordle'
        this.targets = {};
        this.gameState = {
            pokemon: { guesses: [], finished: false },
            league: { guesses: [], finished: false },
            wordle: { guesses: [], currentGuess: '', finished: false }
        };
        this.init();
    }

    init() {
        this.calculateDailyTargets();
        this.loadStreaks();
        this.renderGame();
        this.setupEventListeners();
    }

    calculateDailyTargets() {
        const seed = this.getDailySeed();
        const dateStr = new Date().toISOString().split('T')[0];

        this.targets.pokemon = POKEMON_DATA[seed % POKEMON_DATA.length];

        this.targets.league = LOL_DATA[seed % LOL_DATA.length];
        this.targets.wordle = WORDLE_WORDS[seed % WORDLE_WORDS.length].toUpperCase();
        console.log("Targets synchronized for today.");
    }

    getDailySeed() {
        const today = new Date().toISOString().split('T')[0];
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
            hash = ((hash << 5) - hash) + today.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    loadStreaks() {
        this.streaks = JSON.parse(localStorage.getItem('nexus_streaks')) || { pokemon: 0, league: 0, wordle: 0 };
    }

    saveStreak(game) {
        this.streaks[game]++;
        localStorage.setItem('nexus_streaks', JSON.stringify(this.streaks));
        this.showWinAlert(game);
    }

    showWinAlert(game) {
        const alert = document.createElement('div');
        alert.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-nexus-surface border-2 border-neon-cyan p-10 rounded-[2rem] text-center win-alert shadow-[0_0_50px_rgba(102,252,241,0.5)]';
        alert.innerHTML = `
            <i class="fa-solid fa-trophy text-6xl text-neon-amber mb-6"></i>
            <h2 class="neon-title text-3xl mb-4">Daily Victory!</h2>
            <p class="text-white/60 mb-6">You solved today's ${game} challenge.</p>
            <div class="text-5xl font-black text-white mb-8">${this.streaks[game]} DAY STREAK</div>
            <div class="flex flex-col gap-3">
                <div class="flex gap-3 justify-center">
                    <button onclick="window.gameEngine.shareToX('${game}')" class="flex-1 px-6 py-4 bg-[#1DA1F2] text-white font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                        <i class="fa-brands fa-x-twitter text-lg"></i> Post to X
                    </button>
                    <button onclick="window.gameEngine.shareToFB('${game}')" class="flex-1 px-6 py-4 bg-[#1877F2] text-white font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                        <i class="fa-brands fa-facebook text-lg"></i> Share
                    </button>
                </div>
                <button onclick="window.gameEngine.copyResults('${game}')" class="w-full px-6 py-3 bg-white/5 text-white/40 font-black rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 hover:text-white transition-colors">
                    <i class="fa-solid fa-copy"></i> Copy Raw Text
                </button>
                <button onclick="this.parentElement.parentElement.remove()" class="mt-4 text-[10px] text-white/20 uppercase tracking-widest hover:text-white transition-colors">Dismiss</button>
            </div>
        `;
        document.body.appendChild(alert);
    }

    getShareText(game) {
        const guesses = this.gameState[game].guesses;
        const count = guesses.length;
        let rank = '';

        if (game === 'wordle') {
            if (count === 1) rank = 'Mind Reader 🧠';
            else if (count <= 3) rank = 'Scholar 📚';
            else if (count <= 5) rank = 'Survivor 🛡️';
            else rank = 'Clutch King 👑';
        } else {
            if (count <= 2) rank = 'Legendary Scout 🏆';
            else if (count <= 5) rank = 'Expert Tracker 🕵️';
            else if (count <= 10) rank = 'Pro Trainer 🎮';
            else rank = 'Persistent Hunter ⚔️';
        }

        let text = `NexusLoot ${game.toUpperCase()} // ${new Date().toLocaleDateString()}\n`;
        text += `Rank: ${rank}\n`;
        text += `Solved in ${count} ${count === 1 ? 'guess' : 'guesses'}! 🔥\n`;
        text += `Streak: ${this.streaks[game]} Days\n\n`;
        text += `Can you beat my record?\n`;
        text += `Play here: https://nexusloot.innovationinnitiative.in/${game === 'pokemon' ? 'pokeguess' : game === 'league' ? 'lolguess' : 'wordle'}`;
        
        return text;
    }

    shareToX(game) {
        const text = this.getShareText(game);
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }

    shareToFB(game) {
        // Facebook doesn't allow pre-populated text via URL as easily as X, but we can share the link
        const gameUrl = `https://nexusloot.innovationinnitiative.in/${game === 'pokemon' ? 'pokeguess' : game === 'league' ? 'lolguess' : 'wordle'}`;
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}`;
        window.open(url, '_blank');
    }

    copyResults(game) {
        const text = this.getShareText(game);
        navigator.clipboard.writeText(text);
        const btn = event.target.closest('button');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => btn.innerHTML = original, 2000);
    }

    switchGame(game) {
        this.activeGame = game;
        this.renderGame();
    }

    renderGame() {
        const mount = document.getElementById('game-mount');
        if (!mount) return;

        let html = `
            <div class="game-container">
        `;

        if (this.activeGame === 'wordle') {
            html += this.renderWordle();
        } else {
            html += this.renderAttributeGame();
        }

        html += `</div>`;
        mount.innerHTML = html;
        
        if (this.activeGame === 'wordle') {
            this.updateWordleGrid();
        } else {
            this.renderGuesses();
        }
    }

    renderAttributeGame() {
        return `
            <div class="text-center mb-8">
                <h1 class="neon-title text-4xl mb-2">${this.activeGame === 'pokemon' ? 'Poké-Guess' : 'League-Guess'}</h1>
                <p class="text-white/30 text-[10px] uppercase tracking-[0.3em]">Daily Reset // Guess today's entity</p>
            </div>
            <div class="search-container">
                <input type="text" id="game-search" class="search-input" placeholder="Enter name..." ${this.gameState[this.activeGame].finished ? 'disabled' : ''}>
                <div id="autocomplete-results" class="autocomplete-dropdown hidden"></div>
            </div>
            <div id="guesses-container" class="max-w-4xl mx-auto mt-12"></div>
        `;
    }

    renderWordle() {
        return `
            <div class="text-center mb-8">
                <h1 class="neon-title text-4xl mb-2">Game Wordle</h1>
                <p class="text-white/30 text-[10px] uppercase tracking-[0.3em]">Gaming Terminology // 5 Letters</p>
            </div>
            <div id="wordle-grid" class="grid grid-rows-6 gap-2 max-w-xs mx-auto mb-10">
                ${Array(6).fill(0).map((_, r) => `
                    <div class="wordle-row" id="wordle-row-${r}">
                        ${Array(5).fill(0).map((_, c) => `<div class="tile wordle-tile" id="tile-${r}-${c}"></div>`).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    setupEventListeners() {
        document.addEventListener('input', (e) => {
            if (e.target.id === 'game-search') {
                this.handleSearch(e.target.value);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (this.activeGame === 'wordle' && !this.gameState.wordle.finished) {
                this.handleWordleInput(e.key);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.autocomplete-item')) {
                const name = e.target.dataset.name;
                this.submitGuess(name);
            }
        });
    }

    handleSearch(query) {
        const results = document.getElementById('autocomplete-results');
        if (!query) {
            results.classList.add('hidden');
            return;
        }

        const data = this.activeGame === 'pokemon' ? POKEMON_DATA : LOL_DATA;
        const filtered = data.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) && 
            !this.gameState[this.activeGame].guesses.find(g => g.name === item.name)
        );

        if (filtered.length > 0) {
            results.innerHTML = filtered.map(item => `
                <div class="autocomplete-item" data-name="${item.name}">${item.name}</div>
            `).join('');
            results.classList.remove('hidden');
        } else {
            results.classList.add('hidden');
        }
    }

    submitGuess(name) {
        const data = this.activeGame === 'pokemon' ? POKEMON_DATA : LOL_DATA;
        const guess = data.find(d => d.name === name);
        const target = this.targets[this.activeGame];

        this.gameState[this.activeGame].guesses.unshift(guess);
        document.getElementById('game-search').value = '';
        document.getElementById('autocomplete-results').classList.add('hidden');

        if (guess.name === target.name) {
            this.gameState[this.activeGame].finished = true;
            document.getElementById('game-search').disabled = true;
            this.saveStreak(this.activeGame);
        }

        this.renderGuesses();
    }

    renderGuesses() {
        const container = document.getElementById('guesses-container');
        if (!container) return;

        const target = this.targets[this.activeGame];
        const guesses = this.gameState[this.activeGame].guesses;

        container.innerHTML = guesses.map(g => {
            const isPokemon = this.activeGame === 'pokemon';
            return `
                <div class="guess-row ${isPokemon ? 'poke-row' : 'lol-row'}">
                    ${this.renderAttributeTile('Name', g.name, target.name)}
                    ${isPokemon ? 
                        this.renderAttributeTile('Gen', g.gen, target.gen, true) +
                        this.renderAttributeTile('Type 1', g.type1, target.type1, false, target.type2) +
                        this.renderAttributeTile('Type 2', g.type2, target.type2, false, target.type1) +
                        this.renderAttributeTile('Height', g.height + 'm', target.height, true) +
                        this.renderAttributeTile('Weight', g.weight + 'kg', target.weight, true)
                        :
                        this.renderAttributeTile('Gender', g.gender, target.gender) +
                        this.renderAttributeTile('Position', g.position, target.position) +
                        this.renderAttributeTile('Species', g.species, target.species) +
                        this.renderAttributeTile('Resource', g.resource, target.resource) +
                        this.renderAttributeTile('Year', g.year, target.year, true)
                    }
                </div>
            `;
        }).join('');

        // Trigger animations
        setTimeout(() => {
            document.querySelectorAll('.tile:not(.flip)').forEach((t, i) => {
                setTimeout(() => t.classList.add('flip'), i * 100);
            });
        }, 10);
    }

    renderAttributeTile(label, value, targetValue, isNumeric = false, otherTargetType = null) {
        let status = 'wrong';
        let arrow = '';

        if (value === targetValue) {
            status = 'correct';
        } else if (otherTargetType && value === otherTargetType) {
            status = 'partial';
        }

        if (isNumeric) {
            const numVal = parseFloat(value);
            const targetNum = parseFloat(targetValue);
            if (numVal < targetNum) arrow = ' <i class="fa-solid fa-arrow-up arrow-up text-[8px]"></i>';
            if (numVal > targetNum) arrow = ' <i class="fa-solid fa-arrow-down arrow-down text-[8px]"></i>';
        }

        return `
            <div class="tile ${status}">
                <div class="tile-front"><span>${label}</span>?</div>
                <div class="tile-back"><span>${label}</span>${value}${arrow}</div>
            </div>
        `;
    }

    // --- WORDLE LOGIC ---
    handleWordleInput(key) {
        const state = this.gameState.wordle;
        if (key === 'Enter') {
            if (state.currentGuess.length === 5) this.submitWordleGuess();
        } else if (key === 'Backspace') {
            state.currentGuess = state.currentGuess.slice(0, -1);
        } else if (/^[a-z]$/i.test(key) && state.currentGuess.length < 5) {
            state.currentGuess += key.toUpperCase();
        }
        this.updateWordleGrid();
    }

    submitWordleGuess() {
        const state = this.gameState.wordle;
        const guess = state.currentGuess;
        state.guesses.push(guess);
        state.currentGuess = '';

        if (guess === this.targets.wordle) {
            state.finished = true;
            this.saveStreak('wordle');
        } else if (state.guesses.length === 6) {
            state.finished = true;
        }

        this.updateWordleGrid(true);
    }

    updateWordleGrid(flipLast = false) {
        const state = this.gameState.wordle;
        const target = this.targets.wordle;

        state.guesses.forEach((guess, r) => {
            const rowEl = document.getElementById(`wordle-row-${r}`);
            guess.split('').forEach((char, c) => {
                const tile = document.getElementById(`tile-${r}-${c}`);
                tile.innerHTML = `<div class="tile-front">${char}</div><div class="tile-back">${char}</div>`;
                
                let status = 'wrong';
                if (char === target[c]) {
                    status = 'correct';
                } else if (target.includes(char)) {
                    status = 'partial';
                }
                tile.className = `tile wordle-tile flip ${status}`;
            });
        });

        if (!state.finished && state.guesses.length < 6) {
            const r = state.guesses.length;
            const current = state.currentGuess;
            for (let c = 0; c < 5; c++) {
                const tile = document.getElementById(`tile-${r}-${c}`);
                tile.innerHTML = current[c] || '';
                tile.className = 'tile wordle-tile';
            }
        }
    }
}

const gameEngine = new GamesEngine();
window.gameEngine = gameEngine;
