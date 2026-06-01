const POKEMON_DATA = [
    { name: "Pikachu", gen: 1, type1: "Electric", type2: "None", height: 0.4, weight: 6.0 },
    { name: "Charizard", gen: 1, type1: "Fire", type2: "Flying", height: 1.7, weight: 90.5 },
    { name: "Lucario", gen: 4, type1: "Fighting", type2: "Steel", height: 1.2, weight: 54.0 },
    { name: "Greninja", gen: 6, type1: "Water", type2: "Dark", height: 1.5, weight: 40.0 },
    { name: "Mewtwo", gen: 1, type1: "Psychic", type2: "None", height: 2.0, weight: 122.0 },
    { name: "Eevee", gen: 1, type1: "Normal", type2: "None", height: 0.3, weight: 6.5 },
    { name: "Garchomp", gen: 4, type1: "Dragon", type2: "Ground", height: 1.9, weight: 95.0 },
    { name: "Rayquaza", gen: 3, type1: "Dragon", type2: "Flying", height: 7.0, weight: 206.5 }
];

const LOL_DATA = [
    { name: "Garen", gender: "Male", position: "Top", species: "Human", resource: "Manaless", year: 2010 },
    { name: "Ahri", gender: "Female", position: "Mid", species: "Vastaya", resource: "Mana", year: 2011 },
    { name: "Jinx", gender: "Female", position: "Bot", species: "Human", resource: "Mana", year: 2013 },
    { name: "Yasuo", gender: "Male", position: "Mid", species: "Human", resource: "Manaless", year: 2014 },
    { name: "Lux", gender: "Female", position: "Mid/Support", species: "Human", resource: "Mana", year: 2010 },
    { name: "Teemo", gender: "Male", position: "Top", species: "Yordle", resource: "Mana", year: 2009 },
    { name: "Lee Sin", gender: "Male", position: "Jungle", species: "Human", resource: "Energy", year: 2011 },
    { name: "Zed", gender: "Male", position: "Mid", species: "Human", resource: "Energy", year: 2012 }
];

const WORDLE_WORDS = [
    "STEAM", "SPAWN", "CRAFT", "MANA", "QUEST", 
    "ARMOR", "SKILL", "LEVEL", "EQUIP", "BOSS", 
    "LOOT", "GRIND", "FRAG", "AGGRO", "NOOB",
    "PATCH", "STUN", "GUILD", "READY", "PIXEL"
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { POKEMON_DATA, LOL_DATA, WORDLE_WORDS };
}
