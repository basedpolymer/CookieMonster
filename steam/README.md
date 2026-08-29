# Installing on Cookie Clicker (Steam)

This fork of Cookie Monster runs on the Steam version as a local mod. Built against game version 2.053.

## Option A: release zip (recommended)

1. Download `CookieMonster-Steam-v12.zip` from the [latest release](https://github.com/basedpolymer/CookieMonster/releases/latest).
2. Open the local mods folder:
   `...\Steam\steamapps\common\Cookie Clicker\resources\app\mods\local\`
   From inside the game you can also use Options → Mods → Manage mods → "Open /mods folder", then go into `local`.
3. Extract the zip there. The zip already contains the `CookieMonster` folder, so you should end up with:

   ```
   mods\local\CookieMonster\
   ├── info.txt
   └── main.js
   ```

   If a `CookieMonster` folder is already there, delete it first (or move it aside).

4. Start the game, go to Options → Mods, and enable Cookie Monster.
5. Restart the game.

## Option B: build it yourself

1. Build the bundle from the repo root: `npm run build-final` (see the "Building from source" section of the main [README](../README.md); `npm install` needs a GitHub Packages token).
2. Create `mods\local\CookieMonster\` in the game folder.
3. Copy `dist/CookieMonster.js` there and rename it to `main.js`.
4. Copy `steam/info.txt` next to it, unchanged.
5. Enable the mod and restart, same as steps 4 and 5 above.

## Settings

Cookie Monster's settings live in your game save (`resources\app\save\save.cki`), not in the mod folder. Replacing the mod files never resets them, and with Steam Cloud they follow your account across machines.

The two fork features are on by default:

- `PPNextAchievement` (Colours section): next-achievement buys are included in the PP colour ranking.
- Purchase planner: Stats menu → Purchase plan section. The number of purchases is set by `PlannerSteps` in the Statistics section of the options.

## Updating

Replace `main.js` with the new build, bump `ModVersion` and `Date` in the game folder's `info.txt` to keep track of what you're running, and restart the game (mods are only loaded at startup).
