/**
 * Achievement thresholds used by the purchase planner
 * The names must stay in sync with CM.Sim.CheckOtherAchiev() and
 * CM.Sim.ApplyBuildingPurchase() as they are used to "win" the achievements in the simulation
 */

/**
 * The Cursor building does not use Game.Objects.Cursor.tieredAchievs, it has its own hardcoded list
 * (see ApplyBuildingPurchase in src/Sim/SimulationEvents/BuyBuildingBonusIncome.js)
 */
export const CursorAchievements = [
  { name: 'Click', threshold: 1 },
  { name: 'Double-click', threshold: 2 },
  { name: 'Mouse wheel', threshold: 50 },
  { name: 'Of Mice and Men', threshold: 100 },
  { name: 'The Digital', threshold: 200 },
  { name: 'Extreme polydactyly', threshold: 300 },
  { name: 'Dr. T', threshold: 400 },
  { name: 'Thumbs, phalanges, metacarpals', threshold: 500 },
  { name: 'With her finger and her thumb', threshold: 600 },
  { name: 'Gotta hand it to you', threshold: 700 },
  { name: "The devil's workshop", threshold: 800 },
  { name: 'All on deck', threshold: 900 },
  { name: 'A round of applause', threshold: 1000 },
];

/** Achievements based on the total amount of buildings owned */
export const TotalBuildingsAchievements = [
  { name: 'Builder', threshold: 100 },
  { name: 'Architect', threshold: 500 },
  { name: 'Engineer', threshold: 1000 },
  { name: 'Lord of Constructs', threshold: 2500 },
  { name: 'Grand design', threshold: 5000 },
  { name: 'Ecumenopolis', threshold: 7500 },
  { name: 'Myriad', threshold: 10000 },
];

/** Achievements based on the smallest amount owned across all buildings */
export const MinBuildingsAchievements = [
  { name: 'One with everything', threshold: 1 },
  { name: 'Centennial', threshold: 100 },
  { name: 'Centennial and a half', threshold: 150 },
  { name: 'Bicentennial', threshold: 200 },
  { name: 'Bicentennial and a half', threshold: 250 },
  { name: 'Tricentennial', threshold: 300 },
  { name: 'Tricentennial and a half', threshold: 350 },
  { name: 'Quadricentennial', threshold: 400 },
  { name: 'Quadricentennial and a half', threshold: 450 },
  { name: 'Quincentennial', threshold: 500 },
  { name: 'Quincentennial and a half', threshold: 550 },
  { name: 'Sexcentennial', threshold: 600 },
  { name: 'Sexcentennial and a half', threshold: 650 },
  { name: 'Septcentennial', threshold: 700 },
];

/** The maximum amount of buildings a single bundle candidate is allowed to buy */
export const MaxBundleUnits = 3000;
