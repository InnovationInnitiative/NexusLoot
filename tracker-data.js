/**
 * MMO Market Data Definitions
 */

const MMO_DATA = {
    osrs: {
        name: "Old School RuneScape",
        api: "https://prices.runescape.wiki/api/v1/osrs/latest?id=",
        currency: "GP",
        icon: "fa-coins",
        color: "#F59E0B",
        items: [
            { id: 13190, name: "Old School Bond", img: "https://oldschool.runescape.wiki/images/Old_school_bond.png" },
            { id: 20997, name: "Twisted Bow", img: "https://oldschool.runescape.wiki/images/Twisted_bow.png" },
            { id: 4151, name: "Abyssal Whip", img: "https://oldschool.runescape.wiki/images/Abyssal_whip.png" },
            { id: 25975, name: "Osmumten's Fang", img: "https://oldschool.runescape.wiki/images/Osmumten%27s_fang.png" },
            { id: 12926, name: "Toxic Blowpipe", img: "https://oldschool.runescape.wiki/images/Toxic_blowpipe.png" },
            { id: 1042, name: "Blue Partyhat", img: "https://oldschool.runescape.wiki/images/Blue_partyhat.png" },
            { id: 21034, name: "Dexterous Scroll", img: "https://oldschool.runescape.wiki/images/Dexterous_prayer_scroll.png" },
            { id: 561, name: "Nature Rune", img: "https://oldschool.runescape.wiki/images/Nature_rune.png" }
        ]
    },
    albion: {
        name: "Albion Online (West)",
        api: "https://west.albion-online-data.com/api/v2/stats/Prices/",
        currency: "Silver",
        icon: "fa-ring",
        color: "#3B82F6",
        items: [
            { id: "T8_MOUNT_HORSE", name: "T8 Armored Horse", img: "https://render.albiononline.com/v1/item/T8_MOUNT_HORSE.png" },
            { id: "T8_BAG", name: "Tier 8 Bag", img: "https://render.albiononline.com/v1/item/T8_BAG.png" },
            { id: "T8_MEAL_STEW", name: "T8 Beef Stew", img: "https://render.albiononline.com/v1/item/T8_MEAL_STEW.png" },
            { id: "T8_POTION_HEAL", name: "T8 Healing Potion", img: "https://render.albiononline.com/v1/item/T8_POTION_HEAL.png" },
            { id: "T8_ORE", name: "T8 Runite Ore", img: "https://render.albiononline.com/v1/item/T8_ORE.png" },
            { id: "T8_WOOD", name: "T8 Chestnut Logs", img: "https://render.albiononline.com/v1/item/T8_WOOD.png" },
            { id: "T8_HEAD_PLATE_SET1", name: "T8 Soldier Helmet", img: "https://render.albiononline.com/v1/item/T8_HEAD_PLATE_SET1.png" },
            { id: "T8_MAIN_SWORD", name: "T8 Broadsword", img: "https://render.albiononline.com/v1/item/T8_MAIN_SWORD.png" }
        ]
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MMO_DATA;
}
