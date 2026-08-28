import SimHasAchiev from '../ReplacedGameFunctions/SimHasAchiev.js';

/**
 * This function reads the state reached after replaying the committed actions
 * The building amounts are tracked from the real game state plus the committed increments, the
 * achievements are read from the sim data left behind by the preceding EvaluateChain() call
 * @param	{[object]}	committed	The actions that are already part of the plan, in order
 * @returns	{{amounts: object, boughtUpgrades: Set, isWonInChain: function}}	The chained state
 */
export default function ReadChainedState(committed) {
  const amounts = {};
  Object.keys(Game.Objects).forEach((i) => {
    amounts[i] = Game.Objects[i].amount;
  });

  const boughtUpgrades = new Set();
  committed.forEach((action) => {
    if (action.type === 'upgrade') {
      boughtUpgrades.add(action.upgrade);
      return;
    }
    action.increments.forEach((increment) => {
      amounts[increment.building] += increment.amount;
    });
  });

  return {
    amounts,
    boughtUpgrades,
    isWonInChain: (name) => SimHasAchiev(name) > 0,
  };
}
