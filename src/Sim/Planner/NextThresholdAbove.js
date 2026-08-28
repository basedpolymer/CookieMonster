/**
 * This function returns the cheapest not-yet-won achievement threshold strictly above an amount
 * It is a pure function so it can be unit tested without any game state
 * @param	{[{name: string, threshold: number}]}	thresholds		The achievements to consider
 * @param	{function}								isWon			Returns whether an achievement is already won
 * @param	{number}								currentAmount	The current amount owned
 * @returns	{?{name: string, threshold: number, needed: number}}		The next threshold or null
 */
export default function NextThresholdAbove(thresholds, isWon, currentAmount) {
  let best = null;
  Object.keys(thresholds).forEach((i) => {
    const entry = thresholds[i];
    if (isWon(entry.name)) return;
    if (!(entry.threshold > currentAmount)) return;
    if (best === null || entry.threshold < best.threshold) best = entry;
  });
  if (best === null) return null;
  return { name: best.name, threshold: best.threshold, needed: best.threshold - currentAmount };
}
