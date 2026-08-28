import BuildingGetPrice from '../SimulationEvents/BuyBuilding.js';
import {
  CursorAchievements,
  MaxBundleUnits,
  MinBuildingsAchievements,
  TotalBuildingsAchievements,
} from './AchievementThresholds.js';
import BringAllToMinimum from './BringAllToMinimum.js';
import GreedyCheapestUnits from './GreedyCheapestUnits.js';
import NextThresholdAbove from './NextThresholdAbove.js';

/** The bulk amounts that are always offered for every building */
const BulkAmounts = [1, 10, 100];

/**
 * This function turns a {building: amount} map into a sorted list of increments
 * @param	{object}					composition		Map of building name to amount
 * @returns	{[{building, amount}]}						The increments
 */
function CompositionToIncrements(composition) {
  return Object.keys(composition)
    .filter((building) => composition[building] > 0)
    .map((building) => ({ building, amount: composition[building] }));
}

/**
 * This function returns the achievement thresholds of a single building
 * Cursor uses its own hardcoded list, all other buildings use their tiered achievements
 * @param	{string}						building	The name of the building
 * @returns	{[{name: string, threshold: number}]}		The thresholds
 */
function BuildingAchievements(building) {
  if (building === 'Cursor') return CursorAchievements;
  const tiered = Game.Objects[building].tieredAchievs;
  return Object.keys(tiered)
    .map((j) => ({
      name: tiered[j].name,
      threshold: Game.Tiers[tiered[j].tier].achievUnlock,
    }))
    .filter((entry) => typeof entry.threshold === 'number');
}

/**
 * This function generates every purchase candidate that may be evaluated for the current step
 * of the purchase plan, starting from the chained state
 * @param	{object}	state	The state returned by ReadChainedState()
 * @returns	{[object]}			The candidates, each with a label, a price and an action
 */
export default function GenerateCandidates(state) {
  const candidates = [];
  const buildingNames = Object.keys(Game.Objects);
  const seenBuildingCandidates = new Set();

  const AddBuildingCandidate = (building, amount) => {
    if (!(amount > 0)) return;
    const key = `${building}|${amount}`;
    if (seenBuildingCandidates.has(key)) return;
    seenBuildingCandidates.add(key);
    const price = BuildingGetPrice(
      building,
      Game.Objects[building].basePrice,
      state.amounts[building],
      Game.Objects[building].free,
      amount,
    );
    candidates.push({
      type: 'building',
      label: `Buy ${amount} × ${building}`,
      building,
      amount,
      price,
      action: { type: 'buildings', increments: [{ building, amount }] },
    });
  };

  const AddBundleCandidate = (label, composition, price) => {
    const increments = CompositionToIncrements(composition);
    if (increments.length === 0) return;
    candidates.push({
      type: 'bundle',
      label,
      composition: increments,
      price,
      action: { type: 'buildings', increments },
    });
  };

  // 1. Every building in the standard bulk amounts
  buildingNames.forEach((building) => {
    BulkAmounts.forEach((amount) => {
      AddBuildingCandidate(building, amount);
    });
  });

  // 2. Every building up to its own next tiered achievement
  buildingNames.forEach((building) => {
    const next = NextThresholdAbove(
      BuildingAchievements(building),
      state.isWonInChain,
      state.amounts[building],
    );
    if (next !== null) AddBuildingCandidate(building, next.needed);
  });

  // 3. Bundle towards the next "total amount of buildings" achievement
  let totalOwned = 0;
  buildingNames.forEach((building) => {
    totalOwned += state.amounts[building];
  });
  const nextTotal = NextThresholdAbove(TotalBuildingsAchievements, state.isWonInChain, totalOwned);
  if (nextTotal !== null && nextTotal.needed <= MaxBundleUnits) {
    const bundle = GreedyCheapestUnits(buildingNames, state.amounts, nextTotal.needed);
    AddBundleCandidate(
      `Bundle: reach ${nextTotal.threshold} total buildings`,
      bundle.composition,
      bundle.price,
    );
  }

  // 4. Bundle towards the next "smallest amount across all buildings" achievement
  let minOwned = Infinity;
  buildingNames.forEach((building) => {
    minOwned = Math.min(minOwned, state.amounts[building]);
  });
  const nextMin = NextThresholdAbove(MinBuildingsAchievements, state.isWonInChain, minOwned);
  if (nextMin !== null) {
    const bundle = BringAllToMinimum(buildingNames, state.amounts, nextMin.threshold);
    if (bundle.totalUnits > 0 && bundle.totalUnits <= MaxBundleUnits) {
      AddBundleCandidate(
        `Bundle: bring every building to ${nextMin.threshold}`,
        bundle.composition,
        bundle.price,
      );
    }
  }

  // 5. Bundle towards 'The elder scrolls' (777 Cursors and Grandmas combined)
  const elderScrollsNames = ['Cursor', 'Grandma'];
  if (!state.isWonInChain('The elder scrolls')) {
    const elderOwned = state.amounts.Cursor + state.amounts.Grandma;
    const needed = 777 - elderOwned;
    if (needed > 0 && needed <= MaxBundleUnits) {
      const bundle = GreedyCheapestUnits(elderScrollsNames, state.amounts, needed);
      AddBundleCandidate(
        'Bundle: reach 777 Cursors and Grandmas',
        bundle.composition,
        bundle.price,
      );
    }
  }

  // 6. Every upgrade currently in the store
  // The price is read from the real game state: Game.Upgrades[x].getPrice() cannot be evaluated
  // against the simulated state, so upgrades whose price scales with owned buildings (such as the
  // kitten upgrades or the research upgrades) are an approximation
  Object.keys(Game.UpgradesInStore).forEach((i) => {
    const upgrade = Game.UpgradesInStore[i];
    if (!upgrade) return;
    if (upgrade.pool === 'toggle') return;
    if (upgrade.name === 'Elder Pledge') return;
    if (state.boughtUpgrades.has(upgrade.name)) return;
    candidates.push({
      type: 'upgrade',
      label: `Buy upgrade: ${upgrade.name}`,
      upgrade: upgrade.name,
      price: Game.Upgrades[upgrade.name].getPrice(),
      action: { type: 'upgrade', upgrade: upgrade.name },
    });
  });

  return candidates;
}
