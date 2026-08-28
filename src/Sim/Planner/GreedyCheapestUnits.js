import BuildingGetPrice from '../SimulationEvents/BuyBuilding.js';

/**
 * This function distributes "needed" building units over the given buildings, always buying the
 * building whose *next* unit is the cheapest. It is used for the "total amount of buildings"
 * bundles where only the total counts and not which buildings are bought
 * Only depends on Game.Objects[x].basePrice/free, Game.priceIncrease and Game.modifyBuildingPrice
 * @param	{[string]}	buildingNames	The buildings that may be bought
 * @param	{object}	amounts			Map of building name to the currently owned amount
 * @param	{number}	needed			The total amount of units to buy
 * @returns	{{composition: object, price: number, totalUnits: number}}	The distribution
 */
export default function GreedyCheapestUnits(buildingNames, amounts, needed) {
  const composition = {};
  if (!(needed > 0) || buildingNames.length === 0) {
    return { composition, price: 0, totalUnits: 0 };
  }

  const current = {};
  buildingNames.forEach((building) => {
    current[building] = amounts[building] || 0;
  });

  let price = 0;
  let totalUnits = 0;
  for (let unit = 0; unit < needed; unit += 1) {
    let cheapestBuilding = null;
    let cheapestPrice = Infinity;
    buildingNames.forEach((building) => {
      const unitPrice = BuildingGetPrice(
        building,
        Game.Objects[building].basePrice,
        current[building],
        Game.Objects[building].free,
        1,
      );
      if (unitPrice < cheapestPrice) {
        cheapestPrice = unitPrice;
        cheapestBuilding = building;
      }
    });
    if (cheapestBuilding === null) break;
    price += cheapestPrice;
    current[cheapestBuilding] += 1;
    composition[cheapestBuilding] = (composition[cheapestBuilding] || 0) + 1;
    totalUnits += 1;
  }

  return { composition, price, totalUnits };
}
