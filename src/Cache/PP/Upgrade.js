import GetWrinkConfigBank from '../../Disp/HelperFunctions/GetWrinkConfigBank.js';
import { CacheUpgrades } from '../VariablesAndData.js';
import ColourOfPP from './ColourOfPP.js';
import ComputePP from './ComputePP.js';

/**
 * This functions caches the PP of each building it saves all date in CM.Cache.Upgrades
 * It is called by CM.Cache.CachePP()
 */
export default function CacheUpgradePP() {
  Object.keys(CacheUpgrades).forEach((i) => {
    CacheUpgrades[i].pp = ComputePP(
      Game.Upgrades[i].getPrice(),
      CacheUpgrades[i].bonus,
      Game.cookies + GetWrinkConfigBank(),
      Game.cookiesPs,
    );

    CacheUpgrades[i].colour = ColourOfPP(CacheUpgrades[i], Game.Upgrades[i].getPrice());
  });
}
