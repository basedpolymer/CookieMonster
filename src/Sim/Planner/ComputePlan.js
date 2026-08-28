import GetWrinkConfigBank from '../../Disp/HelperFunctions/GetWrinkConfigBank.js';
import CopyData from '../SimulationData/CopyData.js';
import EvaluateChain from './EvaluateChain.js';
import GenerateCandidates from './GenerateCandidates.js';
import ReadChainedState from './ReadChainedState.js';
import SnapshotSimWonAchievs from './SnapshotSimWonAchievs.js';

/** The bounds of the PlannerSteps setting, mirrored here so the planner can never run away */
const MinPlannerSteps = 1;
const MaxPlannerSteps = 15;

/**
 * This function computes a greedy sequential plan of the next optimal purchases
 * At every step all candidates are evaluated from the *simulated chained state* and the one with
 * the lowest Payback Period is committed. Every evaluation replays the whole chain from the real
 * game state, so no long lived mutated sim state is kept
 * It is only ever called from the "Purchase plan" button on the statistics page
 * @param	{number}	maxSteps	The amount of purchases to plan
 * @returns	{{computedAt: number, baseCps: number, steps: [object]}}		The plan
 */
export default function ComputePurchasePlan(maxSteps) {
  const requestedSteps = Math.floor(Number(maxSteps));
  const stepCount = Math.min(
    MaxPlannerSteps,
    Math.max(MinPlannerSteps, Number.isFinite(requestedSteps) ? requestedSteps : MinPlannerSteps),
  );

  const committed = [];
  const plan = [];
  let virtualBank = Game.cookies + GetWrinkConfigBank();
  let totalTime = 0;
  let baseCps = null;

  // Achievements already "won" by the simulation before any purchase (there should be none, but
  // this keeps the per-step diff honest if the simulation disagrees with the real game state)
  EvaluateChain(committed);
  let previousWon = SnapshotSimWonAchievs();

  for (let step = 1; step <= stepCount; step += 1) {
    // Baseline of this step; also leaves the sim data in the chained state for ReadChainedState()
    const cpsNow = EvaluateChain(committed);
    if (baseCps === null) baseCps = cpsNow;

    const state = ReadChainedState(committed);
    const candidates = GenerateCandidates(state);

    let best = null;
    for (let i = 0; i < candidates.length; i += 1) {
      const candidate = candidates[i];
      const deltaCps = EvaluateChain(committed, candidate.action) - cpsNow;
      if (deltaCps > 0) {
        let wait = 0;
        if (candidate.price > virtualBank) {
          wait = cpsNow > 0 ? (candidate.price - virtualBank) / cpsNow : Infinity;
        }
        const pp = wait + candidate.price / deltaCps;
        if (Number.isFinite(pp) && pp > 0) {
          if (best === null || pp < best.pp || (pp === best.pp && candidate.price < best.price)) {
            best = { ...candidate, deltaCps, wait, pp };
          }
        }
      }
    }

    if (best === null) break;

    committed.push(best.action);
    EvaluateChain(committed);
    const currentWon = SnapshotSimWonAchievs();
    const previouslyWon = new Set(previousWon);
    const achievements = [];
    for (let i = 0; i < currentWon.length; i += 1) {
      if (!previouslyWon.has(currentWon[i])) achievements.push(currentWon[i]);
    }
    previousWon = currentWon;

    virtualBank = virtualBank + cpsNow * best.wait - best.price;
    totalTime += best.wait;

    plan.push({
      order: step,
      type: best.type,
      label: best.label,
      building: best.building,
      amount: best.amount,
      upgrade: best.upgrade,
      composition: best.composition,
      price: best.price,
      deltaCps: best.deltaCps,
      pp: best.pp,
      wait: best.wait,
      cumulativeTime: totalTime,
      cpsAfter: cpsNow + best.deltaCps,
      achievements,
    });
  }

  // The sim data is scratch space shared with the 30 Hz cache pipeline: leave it holding the real
  // game state instead of the last evaluated chain
  CopyData();

  return {
    computedAt: Date.now(),
    baseCps: baseCps === null ? Game.cookiesPs : baseCps,
    steps: plan,
  };
}
