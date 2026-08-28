import { after, before, describe, it } from 'mocha';
import { expect } from 'chai';

import GreedyCheapestUnits from '../../../src/Sim/Planner/GreedyCheapestUnits.js';

let previousGame;

describe('GreedyCheapestUnits', () => {
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

  it('Returns an empty distribution when nothing is needed', () => {
    expect(GreedyCheapestUnits(['Cursor', 'Grandma'], { Cursor: 0, Grandma: 0 }, 0)).to.deep.equal({
      composition: {},
      price: 0,
      totalUnits: 0,
    });
  });

  it('Returns an empty distribution when there are no buildings', () => {
    expect(GreedyCheapestUnits([], {}, 10)).to.deep.equal({
      composition: {},
      price: 0,
      totalUnits: 0,
    });
  });

  it('Always buys the building with the cheapest next unit', () => {
    // Cursor: ceil(15) + ceil(15 * 1.15) + ceil(15 * 1.15^2) = 15 + 18 + 20 = 53
    // Grandma stays at 100 per unit and is therefore never picked
    expect(GreedyCheapestUnits(['Cursor', 'Grandma'], { Cursor: 0, Grandma: 0 }, 3)).to.deep.equal({
      composition: { Cursor: 3 },
      price: 53,
      totalUnits: 3,
    });
  });

  it('Switches to another building once it becomes the cheapest', () => {
    // With 20 cursors a cursor costs ~246, so both units go to the grandmas
    // Grandma: ceil(100) + ceil(100 * 1.15) = 100 + 115 = 215
    expect(GreedyCheapestUnits(['Cursor', 'Grandma'], { Cursor: 20, Grandma: 0 }, 2)).to.deep.equal(
      {
        composition: { Grandma: 2 },
        price: 215,
        totalUnits: 2,
      },
    );
  });

  it('Mixes buildings when their unit prices interleave', () => {
    // Cursor at 15 costs ceil(15 * 1.15^15) = ceil(122.05) = 123, grandma at 0 costs 100
    // unit 1: grandma (100), unit 2: cursor (123 vs grandma at 1 = 115) -> grandma (115)
    // unit 3: cursor (123) vs grandma at 2 (ceil(132.25) = 133) -> cursor (123)
    const result = GreedyCheapestUnits(['Cursor', 'Grandma'], { Cursor: 15, Grandma: 0 }, 3);
    expect(result.composition).to.deep.equal({ Grandma: 2, Cursor: 1 });
    expect(result.price).to.equal(338);
    expect(result.totalUnits).to.equal(3);
  });

  it('Takes the free buildings into account', () => {
    global.Game.Objects.Cursor.free = 2;
    // The first three units are priced as if the building was at amount 0: 15 + 15 + 15
    // The fourth unit is the first one to scale: ceil(15 * 1.15) = 18
    expect(GreedyCheapestUnits(['Cursor'], { Cursor: 0 }, 4)).to.deep.equal({
      composition: { Cursor: 4 },
      price: 63,
      totalUnits: 4,
    });
    global.Game.Objects.Cursor.free = 0;
  });
});
