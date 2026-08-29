# Cookie Monster (fork): next-achievement PP + purchase planner

A fork of [CookieMonsterTeam/CookieMonster](https://github.com/CookieMonsterTeam/CookieMonster) (MIT), the classic Cookie Clicker helper addon. Everything from upstream is still here. This fork adds two things on top, both aimed at the same question: what should I buy next to make the most cookies.

Like upstream, this is not a cheat interface. It reads the game and shows you numbers, it does not play for you. On Steam the mod declares `AllowSteamAchievs: 1`, so Steam achievements stay enabled.

Built against Cookie Clicker 2.053 (Steam). Verified working on the current web version (2.058, orteil.dashnet.org/cookieclicker) and on Steam.

## What this fork adds

### 1. Next-achievement PP

Cookie Monster already tells you how many of a building you need to buy to reach the next building achievement. This fork also computes the PP of buying exactly that amount, and the simulated ΔCPS for that buy includes the milk/kitten bonus you get from the achievement itself.

Those "buy up to the achievement" options are then ranked against everything else. They go into the same global best-PP comparison as the normal ×1 / ×10 / ×100 buys, so the colours can now tell you that buying 37 temples to hit the achievement is the single best purchase available right now, and colour it green.

- Setting: `PPNextAchievement`, in the Colours section of the options. ON by default.
- The colour-coded next-achievement PP is shown on the Stats page and in building tooltips.
- New building sort mode: "Sort buildings: PP until next achievement", in the bars/display section of the options, next to the existing sort modes.
- If no achievement is reachable within the next 100 buys of a building, that entry is excluded from the ranking and shown gray.

### 2. Purchase Planner

Stats menu → Purchase plan section → a button that computes a greedy sequence of your next N optimal purchases.

- Setting: `PlannerSteps`, in the Statistics section of the options. Default 8, maximum 15.
- It takes about 1 to 3 seconds. That's why it only runs when you click the button, never on the game loop.
- Each candidate is scored by replaying the whole simulation state from the current game state. Candidates include buildings ×1 / ×10 / ×100, buying exactly up to the next building achievement threshold, multi-building bundles for total-building-count achievements (the Builder→Myriad tiers, Centennial-style "own N of everything", the Elder-scroll one), and store upgrades.

Limitations:

- Golden cookie effects are ignored.
- Upgrades that would unlock partway through the plan are not anticipated.
- Upgrade prices are read from the current game state, so building purchases inside the plan don't reprice them.

The plan describes the game as it was the moment you clicked, so treat it as an ordering hint.

## Install

### Web: bookmarklet

Save this as a bookmark (paste it in the URL field), then click it with the game open.

```javascript
javascript: (function () {
  Game.LoadMod('https://cdn.jsdelivr.net/gh/basedpolymer/CookieMonster@v12/dist/CookieMonster.js');
}());
```

That URL is pinned to the `v12` tag and never changes. If the bookmarklet doesn't work in your browser, paste everything after `javascript:` into the browser console instead.

If you want the build that follows the `dev` branch:

```
https://cdn.jsdelivr.net/gh/basedpolymer/CookieMonster@dev/dist/CookieMonster.js
```

jsDelivr caches branch URLs for 12 hours at the edge, and your browser may hold on to the file for up to 7 days, so a fresh commit is not instantly live.

### Web: userscript

If you'd rather load the addon automatically every time the game loads, install [`CookieMonster.user.js`](CookieMonster.user.js) in your userscript manager (open the file, click "raw"). It points at the `dev` URL above, so it updates on its own.

To avoid conflicts, load Cookie Monster after any other content mods.

### Steam

1. Download `CookieMonster-Steam-v12.zip` from the [latest release](https://github.com/basedpolymer/CookieMonster/releases/latest).
2. Open `...\Steam\steamapps\common\Cookie Clicker\resources\app\mods\local\`. In game you can get there with Options → Mods → Manage mods → "Open /mods folder".
3. Extract the zip there. You should end up with `mods\local\CookieMonster\` containing `info.txt` and `main.js`.
4. Start the game, go to Options → Mods, enable Cookie Monster, and restart the game.

Cookie Monster's settings are stored in your game save, not in the mod folder, so replacing the mod files never loses your configuration. More detail in [`steam/README.md`](steam/README.md).

## What Cookie Monster does

(Condensed from upstream. The full thing is in the [upstream README](https://github.com/CookieMonsterTeam/CookieMonster).)

Cookie Monster computes an index for both buildings and upgrades: the Payback Period (PP). It takes everything into account, so if buying a building also unlocks an achievement which boosts your income, CM knows and values it accordingly. The formula:

```javascript
max(cost - cookies in bank, 0)/cps + cost/Δ cps
```

Lower is better. A building with a PP of 1 is a better buy than one with a PP of 3.

If the relevant option is enabled, CM colour-codes every item by its PP, comparing across all buy options: if a buy-10 beats every buy-1, the colours say so.

<details>
  <summary>The standard colours:</summary>

- Light Blue: (upgrades) This item has a better PP than the best building to buy
- Green: This building has the best PP
- Yellow: This building is within the top 10 of best PP's
- Orange: This building is within the top 20 of best PP's
- Red: This building is within the top 30 of best PP's
- Purple: This building is worse than the top 10 of best PP's
- Gray: This item does not have a PP, often this means that there is no change to CPS

</details>

CM also gives you golden cookie and season popup timers, wrinkler and garden info, a large stats page, number shortening, and a long list of toggles. Everything is an option; turn off what you don't want.

## For developers

Cookie Monster exposes some of the data it computes on the global `CookieMonsterData` object. Upstream already exposes PP, colour and bonus income for buildings and upgrades. This fork adds two more:

- `window.CookieMonsterData.ObjectsNextAchievement`: per-building next-achievement data, including the amount to buy, its PP and its colour.
- `window.CookieMonsterData.PurchasePlan`: the last plan computed by the Purchase Planner. It is only populated after you click the button.

If you want more data exposed, open an issue.

## Building from source

Fork, clone, then `npm install`. You will need to authenticate to the GitHub Package Registry for `@cookiemonsterteam/cookiemonsterframework` (see [GitHub's docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages)): create a Personal Access Token with the `read:packages` scope and export it as `$GITHUB_REGISTRY_PAT`, as defined in `.npmrc`.

Then `npm run build-final` to produce `dist/CookieMonster.js`. It runs eslint and the test suite first. While working, `npm run build-dev` builds `dist/CookieMonsterDev.js` instead.

Development happens on the `dev` branch.

## Bugs and suggestions

- Something wrong with the next-achievement PP or the Purchase Planner? [Open an issue here](https://github.com/basedpolymer/CookieMonster/issues).
- Something wrong with core Cookie Monster (anything that also happens on the upstream build)? Report it [upstream](https://github.com/CookieMonsterTeam/CookieMonster/issues). They maintain that code, not me.

## Modpack

The other mods I run alongside this one are listed in [`MODPACK.md`](MODPACK.md). Nothing is rehosted there, every link points at the original author's page.

## Credits & license

MIT, same as upstream. All the credit for Cookie Monster itself goes to the Cookie Monster Team and its contributors:

- **[Raving_Kumquat](https://cookieclicker.wikia.com/wiki/User:Raving_Kumquat)**: Original author
- **[Maxime Fabre](https://github.com/Anahkiasen)**: Previous maintainer
- **[BlackenedGem](https://github.com/BlackenedGem)**: Golden/Wrath Cookie Favicons
- **[Sandworm](https://github.com/svschouw)**: Modified PP calculation
- **[Aktanusa](https://github.com/Aktanusa)**: Current maintainer
- **[DanielNoord](https://github.com/DanielNoord)**: Current maintainer
- **[bitsandbytes1708](https://github.com/bitsandbytes1708)**: Current maintainer

Fork and the two added features: [basedpolymer](https://github.com/basedpolymer).

Upstream repository: <https://github.com/CookieMonsterTeam/CookieMonster>. Upstream web build: `https://cookiemonsterteam.github.io/CookieMonster/dist/CookieMonster.js`.
