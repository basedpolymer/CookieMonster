import CalculateGains from '../Calculations/CalculateGains.js';
import CheckOtherAchiev from '../Calculations/CheckOtherAchiev.js';
import CopyData from '../SimulationData/CopyData.js';
import { SimAchievementsOwned, SimCookiesPs } from '../VariablesAndData.js';
import ApplyPlannerAction from './ApplyPlannerAction.js';

/**
 * This function replays a chain of purchases starting from the *real* game state
 * No long lived mutated sim state is kept: every evaluation starts with a fresh CopyData()
 * After this call the sim data holds the state of the whole chain, so callers may read
 * SimAchievements/SimObjects afterwards
 * @param	{[object]}	committed	The actions that are already part of the plan, in order
 * @param	{?object}	candidate	An extra action applied on top of the committed ones
 * @returns	{number}				The resulting SimCookiesPs
 */
export default function EvaluateChain(committed, candidate) {
  CopyData();
  committed.forEach((action) => {
    ApplyPlannerAction(action);
  });
  if (candidate) ApplyPlannerAction(candidate);

  const lastAchievementsOwned = SimAchievementsOwned;

  CalculateGains();

  CheckOtherAchiev();

  if (lastAchievementsOwned !== SimAchievementsOwned) {
    CalculateGains();
  }

  return SimCookiesPs;
}
