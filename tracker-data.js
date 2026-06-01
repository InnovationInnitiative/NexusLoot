const RPG_DATA = {
    dailies: [
        { id: 'd1', label: 'Complete Daily Commissions/Quests' },
        { id: 'd2', label: 'Spend Daily Energy/Resin' },
        { id: 'd3', label: 'Check Daily Vendor Resets' },
        { id: 'd4', label: 'Clear Daily Elite Bosses' },
        { id: 'd5', label: 'Claim Login Rewards' }
    ],
    weeklies: [
        { id: 'w1', label: 'Clear Weekly Raids/Trounce Domains (3/3)' },
        { id: 'w2', label: 'Claim Battle Pass Weekly XP' },
        { id: 'w3', label: 'Defeat World Bosses' },
        { id: 'w4', label: 'Complete Weekly Bounties & Requests' }
    ],
    materials: {
        'green_crystal': { name: 'Sliver (Green)', icon: 'fa-gem', color: '#10B981' },
        'blue_crystal': { name: 'Fragment (Blue)', icon: 'fa-gem', color: '#3B82F6' },
        'purple_crystal': { name: 'Chunk (Purple)', icon: 'fa-gem', color: '#8B5CF6' },
        'gold_crystal': { name: 'Gemstone (Gold)', icon: 'fa-gem', color: '#F59E0B' },
        'boss_token': { name: 'Boss Core', icon: 'fa-skull', color: '#EF4444' },
        'credits': { name: 'Gold/Credits', icon: 'fa-coins', color: '#FCD34D' }
    },
    levelMap: [
        // Level thresholds and what it costs to ascend *to* the next tier
        { level: 1, to: 20, req: { 'green_crystal': 1, 'credits': 4000 } },
        { level: 20, to: 40, req: { 'green_crystal': 3, 'boss_token': 2, 'credits': 20000 } },
        { level: 40, to: 50, req: { 'blue_crystal': 3, 'boss_token': 4, 'credits': 40000 } },
        { level: 50, to: 60, req: { 'blue_crystal': 6, 'boss_token': 8, 'credits': 60000 } },
        { level: 60, to: 70, req: { 'purple_crystal': 3, 'boss_token': 12, 'credits': 80000 } },
        { level: 70, to: 80, req: { 'purple_crystal': 6, 'boss_token': 20, 'credits': 100000 } },
        { level: 80, to: 90, req: { 'gold_crystal': 6, 'boss_token': 20, 'credits': 120000 } }
    ],
    levels: [1, 20, 40, 50, 60, 70, 80, 90]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = RPG_DATA;
}
