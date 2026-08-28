import GetWrinkConfigBank from '../../Disp/HelperFunctions/GetWrinkConfigBank.js';
import { ColourGray } from '../../Disp/VariablesAndData.js';
import BuildingGetPrice from '../../Sim/SimulationEvents/BuyBuilding.js';
import FillCMDCache from '../FillCMDCache.js';
import {
  CacheMinPP,
  CacheMinPPBulk,
  CacheMinPPCategory,
  CacheObjects1,
  CacheObjects10,
  CacheObjects100,
  CacheObjectsNextAchievement,
  CachePPArray,
} from '../VariablesAndData.js';
import ColourOfPP from './ColourOfPP.js';
import ComputePP from './ComputePP.js';

/**
 * This functions caches the buildings of bulk-buy mode when PP is compared against optimal single-purchase building
 * It saves all date in CM.Cache.Objects...
 * It is called by CM.Cache.CacheBuildingsPP()
 */
function CacheColour(target, amount) {
  Object.keys(target).forEach((i) => {
    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPRigidelMode &&
      amount === 1
    ) {
      target[i].colour = ColourGray; // eslint-disable-line no-param-reassign
      return;
    }
    // eslint-disable-next-line no-param-reassign
    target[i].colour = ColourOfPP(
      target[i],
      BuildingGetPrice(
        i,
        Game.Objects[i].basePrice,
        Game.Objects[i].amount,
        Game.Objects[i].free,
        amount,
      ),
    );
    // Colour based on excluding certain top-buildings
    for (
      let j = 0;
      j < Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPExcludeTop;
      j++
    ) {
      if (target[i].pp === CachePPArray[j][0]) target[i].colour = ColourGray; // eslint-disable-line no-param-reassign
    }
  });
}

function CachePP(target, amount) {
  Object.keys(target).forEach((i) => {
    const price = BuildingGetPrice(
      i,
      Game.Objects[i].basePrice,
      Game.Objects[i].amount,
      Game.Objects[i].free,
      amount,
    );
    // eslint-disable-next-line no-param-reassign
    target[i].pp = ComputePP(
      price,
      target[i].bonus,
      Game.cookies + GetWrinkConfigBank(),
      Game.cookiesPs,
    );
    if (
      !(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPRigidelMode &&
        amount === 1
      )
    )
      CachePPArray.push([target[i].pp, amount, price, 'bulk']);
  });
}

/**
 * This functions caches the PP of buying exactly the amount of buildings needed to
 * reach the next achievement and (optionally) adds them to the global PP ranking
 * It is called by CM.Cache.CacheBuildingsPP()
 */
function CachePPNextAchievement() {
  Object.keys(CacheObjectsNextAchievement).forEach((i) => {
    const me = CacheObjectsNextAchievement[i];
    if (!(me.AmountNeeded < 101) || typeof me.bonus === 'undefined') {
      me.pp = Infinity;
      return;
    }
    me.pp = ComputePP(me.price, me.bonus, Game.cookies + GetWrinkConfigBank(), Game.cookiesPs);
    if (!Number.isFinite(me.pp)) me.pp = Infinity;
    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPNextAchievement &&
      me.pp > 0 &&
      me.pp !== Infinity
    )
      CachePPArray.push([me.pp, me.AmountNeeded, me.price, 'nextAchievement']);
  });
}

/**
 * This functions caches the colour of the next-achievement purchases
 * It is called by CM.Cache.CacheBuildingsPP()
 */
function CacheColourNextAchievement() {
  Object.keys(CacheObjectsNextAchievement).forEach((i) => {
    const me = CacheObjectsNextAchievement[i];
    me.colour = ColourOfPP(me, me.price);
    if (me.pp === Infinity) me.colour = ColourGray;
    // Colour based on excluding certain top-buildings
    for (
      let j = 0;
      j < Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPExcludeTop;
      j++
    ) {
      if (me.pp === CachePPArray[j][0]) me.colour = ColourGray;
    }
  });
}

/**
 * This functions caches the PP of each building it saves all date in CM.Cache.Objects...
 * It is called by CM.Cache.CachePP()
 */
export default function CacheBuildingsPP() {
  CacheMinPP = Infinity;
  CachePPArray = [];
  if (
    typeof Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPExcludeTop ===
    'undefined'
  )
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPExcludeTop = 0; // Otherwise breaks during initialization

  // Calculate PP and colours
  CachePP(CacheObjects1, 1);
  CachePP(CacheObjects10, 10);
  CachePP(CacheObjects100, 100);
  CachePPNextAchievement();

  // Set CM.Cache.min to best non-excluded buidliung
  CachePPArray.sort((a, b) => a[0] - b[0]);
  let indexOfMin = Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPExcludeTop;
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPOnlyConsiderBuyable) {
    while (CachePPArray[indexOfMin][2] > Game.cookies) {
      indexOfMin += 1;
      if (CachePPArray.length === indexOfMin + 1) {
        break;
      }
    }
  }
  CacheMinPP = CachePPArray[indexOfMin][0];
  CacheMinPPBulk = CachePPArray[indexOfMin][1];
  CacheMinPPCategory = CachePPArray[indexOfMin][3];

  CacheColour(CacheObjects1, 1);
  CacheColour(CacheObjects10, 10);
  CacheColour(CacheObjects100, 100);
  CacheColourNextAchievement();

  FillCMDCache({
    CacheMinPP,
    CacheMinPPBulk,
    CacheMinPPCategory,
    CachePPArray,
    CacheObjectsNextAchievement,
  });
}
