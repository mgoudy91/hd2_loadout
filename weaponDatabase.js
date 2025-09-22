// weaponDatabase.js

// Weapon database with all stats
const weapons = {
    primary: [
        { name: "AR-23 Liberator", warbond: "free", 
          light: "green", medium: "red", heavy: "red",
          bugnest: "red", charger: "red", biletitan: "red",
          factory: "red", hulk: "red", strider: "red",
          warpship: "red", harvester: "red", voteless: "green" },
        { name: "AR-23P Liberator Penetrator", warbond: "free",
          light: "green", medium: "green", heavy: "red",
          bugnest: "red", charger: "yellow", biletitan: "red",
          factory: "red", hulk: "yellow", strider: "yellow",
          warpship: "red", harvester: "yellow", voteless: "green" },
        { name: "SG-225 Breaker", warbond: "free",
          light: "green", medium: "red", heavy: "red",
          bugnest: "red", charger: "red", biletitan: "red",
          factory: "red", hulk: "red", strider: "red",
          warpship: "red", harvester: "red", voteless: "green" },
        { name: "R-36 Eruptor", warbond: "democratic-detonation",
          light: "green", medium: "green", heavy: "red",
          bugnest: "green", charger: "yellow", biletitan: "red",
          factory: "green", hulk: "yellow", strider: "yellow",
          warpship: "green", harvester: "yellow", voteless: "green" }
    ],
    secondary: [
        { name: "P-2 Peacemaker", warbond: "free",
          light: "green", medium: "red", heavy: "red",
          bugnest: "red", charger: "red", biletitan: "red",
          factory: "red", hulk: "red", strider: "red",
          warpship: "red", harvester: "red", voteless: "green" },
        { name: "P-4 Senator", warbond: "steeled-veterans",
          light: "green", medium: "green", heavy: "green",
          bugnest: "red", charger: "yellow", biletitan: "yellow",
          factory: "red", hulk: "yellow", strider: "yellow",
          warpship: "red", harvester: "yellow", voteless: "green" },
        { name: "GP-31 Grenade Pistol", warbond: "democratic-detonation",
          light: "green", medium: "green", heavy: "red",
          bugnest: "green", charger: "yellow", biletitan: "red",
          factory: "green", hulk: "yellow", strider: "yellow",
          warpship: "green", harvester: "yellow", voteless: "green" }
    ],
    grenade: [
        { name: "G-12 High Explosive", warbond: "free",
          light: "green", medium: "red", heavy: "red",
          bugnest: "green", charger: "red", biletitan: "red",
          factory: "green", hulk: "red", strider: "red",
          warpship: "green", harvester: "red", voteless: "green" },
        { name: "G-16 Impact", warbond: "free",
          light: "green", medium: "red", heavy: "red",
          bugnest: "green", charger: "red", biletitan: "red",
          factory: "green", hulk: "red", strider: "red",
          warpship: "green", harvester: "red", voteless: "green" },
        { name: "G-123 Thermite", warbond: "freedom-flame",
          light: "green", medium: "yellow", heavy: "green",
          bugnest: "yellow", charger: "green", biletitan: "green",
          factory: "yellow", hulk: "green", strider: "green",
          warpship: "yellow", harvester: "green", voteless: "yellow" }
    ],
    stratagem: [
        { name: "Autocannon", warbond: "free", slot: "support+backpack",
          light: "green", medium: "green", heavy: "red",
          bugnest: "green", charger: "yellow", biletitan: "red",
          factory: "green", hulk: "green", strider: "green",
          warpship: "green", harvester: "yellow", voteless: "green" },
        { name: "Railgun", warbond: "free", slot: "support",
          light: "yellow", medium: "green", heavy: "green",
          bugnest: "red", charger: "green", biletitan: "green",
          factory: "red", hulk: "green", strider: "green",
          warpship: "red", harvester: "green", voteless: "yellow" },
        { name: "Orbital Laser", warbond: "free", slot: "none",
          light: "green", medium: "green", heavy: "green",
          bugnest: "green", charger: "green", biletitan: "green",
          factory: "green", hulk: "green", strider: "green",
          warpship: "green", harvester: "green", voteless: "green" },
        { name: "Eagle Airstrike", warbond: "free", slot: "none",
          light: "green", medium: "yellow", heavy: "red",
          bugnest: "green", charger: "yellow", biletitan: "red",
          factory: "green", hulk: "yellow", strider: "yellow",
          warpship: "green", harvester: "yellow", voteless: "green" },
        { name: "Shield Generator Pack", warbond: "free", slot: "backpack",
          light: "red", medium: "red", heavy: "red",
          bugnest: "red", charger: "red", biletitan: "red",
          factory: "red", hulk: "red", strider: "red",
          warpship: "red", harvester: "red", voteless: "red" }
    ]
};

if (typeof module !== 'undefined') {
    module.exports = weapons;
}