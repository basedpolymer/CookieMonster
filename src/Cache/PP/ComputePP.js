/**
 * This function computes the Payback Period of a purchase
 * @param	{number}	price		Total price of the purchase
 * @param	{number}	bonus		Bonus income (delta CPS) of the purchase
 * @param	{number}	cookies		Cookies currently in bank (including wrinkler bank)
 * @param	{number}	cookiesPs	Current cookies per second
 * @returns {number}	pp			The Payback Period (Infinity when not computable)
 */
export default function ComputePP(price, bonus, cookies, cookiesPs) {
  let pp;
  if (cookiesPs) pp = Math.max(price - cookies, 0) / cookiesPs + price / bonus;
  else pp = price / bonus;
  if (Number.isNaN(pp)) pp = Infinity;
  return pp;
}
