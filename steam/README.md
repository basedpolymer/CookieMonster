# Installation sur Cookie Clicker Steam

Ce dossier permet d'installer ce fork de Cookie Monster (avec le PP « jusqu'au prochain achievement » et le Purchase Planner) sur la version Steam du jeu, **sans chaîne de build** : le bundle compilé est déjà dans `dist/CookieMonster.js`.

## Étapes

1. Aller dans le dossier du jeu :
   `...\Steam\steamapps\common\Cookie Clicker\resources\app\mods\local\`
2. Y créer un dossier `CookieMonster` (le supprimer d'abord s'il existe déjà, après sauvegarde éventuelle).
3. Copier **`dist/CookieMonster.js`** (à la racine du dépôt) dans ce dossier et le renommer **`main.js`**.
4. Copier **`steam/info.txt`** (ce dossier) à côté, tel quel.
5. Lancer le jeu → Options → **Gérer les mods** → activer *Cookie Monster* si nécessaire → redémarrer le jeu.

Arborescence finale :

```
mods\local\CookieMonster\
├── info.txt
└── main.js        (copie de dist/CookieMonster.js)
```

## Réglages

- Les fonctionnalités du fork sont actives par défaut : `PPNextAchievement` (classement des couleurs incluant les achats « prochain achievement ») et le planificateur (menu Stats → section **Purchase plan**, nombre d'achats réglable via `PlannerSteps`, section Statistics des options).
- Les réglages Cookie Monster sont stockés **dans la sauvegarde du jeu** (`resources\app\save\save.cki`), pas dans le mod. Avec le même compte Steam et Steam Cloud activé, ils se synchronisent automatiquement entre machines (réglages optimisés du 28/08/2026 compris).

## Mise à jour du mod

Après un nouveau commit sur ce dépôt : re-copier `dist/CookieMonster.js` vers `main.js` et mettre à jour `ModVersion`/`Date` dans `info.txt` du dossier du jeu.

## Reconstruire depuis les sources (optionnel)

La dépendance `@cookiemonsterteam/cookiemonsterframework` (0.2.3) est hébergée sur GitHub Packages : `npm install` requiert un PAT avec le scope `read:packages` (variable `GITHUB_REGISTRY_PAT`), ou vendoriser le paquet dans `node_modules` depuis son dépôt public (tag `0.2.3`). Ensuite : `npm run eslint`, `npm test`, `npm run pack-final`.
