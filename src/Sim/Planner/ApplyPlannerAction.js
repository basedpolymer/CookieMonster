import { ApplyBuildingPurchase } from '../SimulationEvents/BuyBuildingBonusIncome.js';
import { ApplyUpgradePurchase } from '../SimulationEvents/BuyUpgrades.js';

/**
 * This function applies a single planner action to the current sim data
 * It does not call CopyData() nor CalculateGains(): see EvaluateChain()
 * @param	{object}	action	Either {type: 'upgrade', upgrade} or {type: 'buildings', increments}
 */
export default function ApplyPlannerAction(action) {
  if (action.type === 'upgrade') {
    ApplyUpgradePurchase(action.upgrade);
    return;
  }
  action.increments.forEach((increment) => {
    ApplyBuildingPurchase(increment.building, increment.amount);
  });
}
