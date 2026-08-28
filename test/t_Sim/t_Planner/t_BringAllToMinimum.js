import { after, before, describe, it } from 'mocha';
import { expect } from 'chai';

import BringAllToMinimum from '../../../src/Sim/Planner/BringAllToMinimum.js';

let previousGame;

describe('BringAllToMinimum', () => {
  before(() => {
    previousGame = global.Game;
    global.Game = {
      priceIncrease: 1.15,
      modifyBuildingPrice: (building, price) => price,
      Objects: {
        Cursor: { basePrice: 15, free: 0 },
        Grandma: { basePrice: 100, free: 0 },
      },
    };
  });

  after(() => {
    global.Game = previousGame;
  });

  it('Buys nothing when every building already reached the target', () => {
    expect(BringAllToMinimum(['Cursor', 'Grandma'], { Cursor: 5, Grandma: 3 }, 3)).to.deep.equal({
      composition: {},
      price: 0,
      totalUnits: 0,
    });
  });

  it('Brings every building short of the target up to it', () => {
    // Cursor from 1 to 3: ceil(15 * (1.15 + 1.15^2)) = ceil(37.0875) = 38
    // Grandma from 0 to 3: ceil(100 * (1 + 1.15 + 1.15^2)) = ceil(347.25) = 348
    expect(BringAllToMinimum(['Cursor', 'Grandma'], { Cursor: 1, Grandma: 0 }, 3)).to.deep.equal({
      composition: { Cursor: 2, Grandma: 3 },
      price: 386,
      totalUnits: 5,
    });
  });

  it('Skips the buildings that are already above the target', () => {
    expect(BringAllToMinimum(['Cursor', 'Grandma'], { Cursor: 50, Grandma: 0 }, 1)).to.deep.equal({
      composition: { Grandma: 1 },
      price: 100,
      totalUnits: 1,
    });
  });

  it('Treats a missing amount as zero owned', () => {
    expect(BringAllToMinimum(['Grandma'], {}, 1)).to.deep.equal({
      composition: { Grandma: 1 },
      price: 100,
      totalUnits: 1,
    });
  });
});
