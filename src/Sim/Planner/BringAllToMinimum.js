import BuildingGetPrice from '../SimulationEvents/BuyBuilding.js';

/**
 * This function computes the cost of bringing every building up to a given minimum amount
 * It is used for the "smallest amount across all buildings" achievements (Centennial and friends)
 * Only depends on Game.Objects[x].basePrice/free, Game.priceIncrease and Game.modifyBuildingPrice
 * @param	{[string]}	buildingNames	The buildings that should reach the target
 * @param	{object}	amounts			Map of building name to the currently owned amount
 * @param	{number}	target			The minimum amount every building should reach
 * @returns	{{composition: object, price: number, totalUnits: number}}	The distribution
 */
export default function BringAllToMinimum(buildingNames, amounts, target) {
  const composition = {};
  let price = 0;
  let totalUnits = 0;

  buildingNames.forEach((building) => {
    const owned = amounts[building] || 0;
    if (owned >= target) return;
    const needed = target - owned;
    composition[building] = needed;
    totalUnits += needed;
    price += BuildingGetPrice(
      building,
      Game.Objects[building].basePrice,
      owned,
      Game.Objects[building].free,
      needed,
    );
  });

  return { composition, price, totalUnits };
}
