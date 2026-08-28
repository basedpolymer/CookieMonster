import BuildingGetPrice from '../../Sim/SimulationEvents/BuyBuilding.js';
import FillCMDCache from '../FillCMDCache.js';
import { CacheObjectsNextAchievement } from '../VariablesAndData.js';
import IndividualAmountTillNextAchievement from './IndividualAmountTillNextAchievement.js';

/**
 * This functions caches the amount of buildings needed till next achievement
 * @param	{boolean}	forceRecalc	Whether a recalcution should be forced (after CPS change)
 */
export default function AllAmountTillNextAchievement(forceRecalc) {
  Object.keys(Game.Objects).forEach((i) => {
    const prev = CacheObjectsNextAchievement[i];
    if (prev && prev.TotalNeeded > Game.Objects[i].amount && !forceRecalc) {
      // Mutate in place so that fields added by other cache functions (bonus, pp, colour)
      // are not wiped every loop
      prev.AmountNeeded = prev.TotalNeeded - Game.Objects[i].amount;
      prev.price = BuildingGetPrice(
        i,
        Game.Objects[i].basePrice,
        Game.Objects[i].amount,
        Game.Objects[i].free,
        prev.AmountNeeded,
      );
    } else {
      const tillNext = IndividualAmountTillNextAchievement(i);
      CacheObjectsNextAchievement[i] = {
        ...(prev || {}),
        AmountNeeded: tillNext,
        TotalNeeded: Game.Objects[i].amount + tillNext,
        price: BuildingGetPrice(
          i,
          Game.Objects[i].basePrice,
          Game.Objects[i].amount,
          Game.Objects[i].free,
          tillNext,
        ),
      };
    }
  });

  FillCMDCache({ CacheObjectsNextAchievement });
}
