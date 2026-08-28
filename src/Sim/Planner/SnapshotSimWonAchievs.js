import { SimAchievements } from '../VariablesAndData.js';

/**
 * This function lists the achievements that the current sim data has won but the real game has not
 * It must be called right after an EvaluateChain() call as it reads the sim data left behind by it
 * @returns	{[string]}	The names of the achievements won in the simulation only
 */
export default function SnapshotSimWonAchievs() {
  const won = [];
  Object.keys(SimAchievements).forEach((name) => {
    if (SimAchievements[name] && SimAchievements[name].won && !Game.HasAchiev(name)) {
      won.push(name);
    }
  });
  return won;
}
