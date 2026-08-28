/** Section: the on-demand "Purchase plan" of the statistics page */

import ComputePurchasePlan from '../../../Sim/Planner/ComputePlan.js';
import Beautify from '../../BeautifyAndFormatting/Beautify.js';
import FormatTime from '../../BeautifyAndFormatting/FormatTime.js';
import { StatsListing } from './CreateDOMElements.js';

/**
 * The last computed plan. The planner is expensive so it is never run from CMLoopHook/CMDrawHook:
 * it is only computed when the user clicks the button of this section
 */
let PurchasePlan = null;

/** The maximum amount of composition entries shown for a bundle before it is truncated */
const MaxCompositionEntries = 6;

/**
 * This function computes a new purchase plan and stores it both module-locally and on
 * window.CookieMonsterData.PurchasePlan, then refreshes the menu
 */
function ComputeAndStorePurchasePlan() {
  try {
    PurchasePlan = ComputePurchasePlan(
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PlannerSteps,
    );
    window.CookieMonsterData.PurchasePlan = PurchasePlan;
  } catch (error) {
    console.error('Cookie Monster could not compute the purchase plan:', error); // eslint-disable-line no-console
  }
  Game.UpdateMenu();
}

/**
 * This function formats the composition of a bundle purchase, truncated to keep the row readable
 * @param	{[{building: string, amount: number}]}	composition		The bundle composition
 * @returns	{string}												The formatted composition
 */
function CompositionText(composition) {
  if (!composition || composition.length === 0) return '';
  const parts = composition.map((increment) => `${increment.amount} × ${increment.building}`);
  if (parts.length <= MaxCompositionEntries) return parts.join(', ');
  return `${parts.slice(0, MaxCompositionEntries).join(', ')}, …`;
}

/**
 * This function formats a Payback Period following the PPDisplayTime setting
 * @param	{number}	pp		The Payback Period
 * @returns	{string}			The formatted Payback Period
 */
function FormatPP(pp) {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPDisplayTime)
    return FormatTime(pp);
  return Beautify(pp);
}

/**
 * This function creates the "Purchase plan" section of the stats page
 * @returns	{object}	section		The object containing the Purchase plan section
 */
export default function PurchasePlanSection() {
  const section = document.createElement('div');
  section.className = 'CMStatsPurchasePlanSection';

  // The setting is stored as the raw string of a number input, so it must be converted
  const steps = Number(
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PlannerSteps,
  );
  const buttonFrag = document.createDocumentFragment();
  const button = document.createElement('a');
  button.textContent = `Compute optimal purchase plan (${steps} purchase${steps === 1 ? '' : 's'})`;
  button.className = 'option';
  button.onclick = function () {
    ComputeAndStorePurchasePlan();
  };
  buttonFrag.appendChild(button);
  section.appendChild(StatsListing('basic', 'Purchase plan', buttonFrag));

  if (PurchasePlan === null) {
    section.appendChild(
      StatsListing(
        'basic',
        'Status',
        document.createTextNode('No plan computed yet, click the button above'),
      ),
    );
    return section;
  }

  if (PurchasePlan.steps.length === 0) {
    section.appendChild(
      StatsListing(
        'basic',
        'Status',
        document.createTextNode('No purchase with a positive CPS gain could be found'),
      ),
    );
    return section;
  }

  let totalCost = 0;
  PurchasePlan.steps.forEach((step) => {
    totalCost += step.price;
    const name =
      step.type === 'bundle'
        ? `${step.order}. ${step.label} (${CompositionText(step.composition)})`
        : `${step.order}. ${step.label}`;
    let text =
      `price: ${Beautify(step.price)}, PP: ${FormatPP(step.pp)}, ` +
      `wait: ${FormatTime(step.wait)}, total: ${FormatTime(step.cumulativeTime)}`;
    if (step.achievements.length > 0) text += ` → unlocks: ${step.achievements.join(', ')}`;
    section.appendChild(StatsListing('basic', name, document.createTextNode(text)));
  });

  const last = PurchasePlan.steps[PurchasePlan.steps.length - 1];
  const growth = PurchasePlan.baseCps > 0 ? (last.cpsAfter / PurchasePlan.baseCps - 1) * 100 : 0;
  section.appendChild(
    StatsListing(
      'basic',
      'Plan total',
      document.createTextNode(
        `cost: ${Beautify(totalCost)}, estimated time: ${FormatTime(last.cumulativeTime)}, ` +
          `CPS: ${Beautify(PurchasePlan.baseCps)} → ${Beautify(last.cpsAfter)} ` +
          `(+${Beautify(growth)}%)`,
      ),
    ),
  );

  section.appendChild(
    StatsListing(
      'basic',
      'Note',
      document.createTextNode(
        'This plan is a snapshot of the moment the button was clicked; it does not account for ' +
          'golden cookies, upgrades unlocked halfway through the plan, or price changes of ' +
          'upgrades caused by the planned buildings',
      ),
    ),
  );

  return section;
}
