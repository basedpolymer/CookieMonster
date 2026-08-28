import { describe, it } from 'mocha';
import { expect } from 'chai';

import NextThresholdAbove from '../../../src/Sim/Planner/NextThresholdAbove.js';

const thresholds = [
  { name: 'Builder', threshold: 100 },
  { name: 'Architect', threshold: 500 },
  { name: 'Engineer', threshold: 1000 },
];

const wonNothing = () => false;
const wonEverything = () => true;

describe('NextThresholdAbove', () => {
  it('Returns the smallest threshold strictly above the current amount', () => {
    expect(NextThresholdAbove(thresholds, wonNothing, 0)).to.deep.equal({
      name: 'Builder',
      threshold: 100,
      needed: 100,
    });
  });

  it('Computes the amount still needed', () => {
    expect(NextThresholdAbove(thresholds, wonNothing, 87)).to.deep.equal({
      name: 'Builder',
      threshold: 100,
      needed: 13,
    });
  });

  it('Skips a threshold that is exactly reached', () => {
    expect(NextThresholdAbove(thresholds, wonNothing, 100)).to.deep.equal({
      name: 'Architect',
      threshold: 500,
      needed: 400,
    });
  });

  it('Skips achievements that are already won', () => {
    const won = (name) => name === 'Builder' || name === 'Architect';
    expect(NextThresholdAbove(thresholds, won, 0)).to.deep.equal({
      name: 'Engineer',
      threshold: 1000,
      needed: 1000,
    });
  });

  it('Returns null when every threshold is already won', () => {
    expect(NextThresholdAbove(thresholds, wonEverything, 0)).to.equal(null);
  });

  it('Returns null when every threshold is already reached', () => {
    expect(NextThresholdAbove(thresholds, wonNothing, 1000)).to.equal(null);
  });

  it('Returns null for an empty threshold list', () => {
    expect(NextThresholdAbove([], wonNothing, 0)).to.equal(null);
  });

  it('Does not assume the thresholds are sorted', () => {
    const unsorted = [
      { name: 'Engineer', threshold: 1000 },
      { name: 'Builder', threshold: 100 },
      { name: 'Architect', threshold: 500 },
    ];
    expect(NextThresholdAbove(unsorted, wonNothing, 0).name).to.equal('Builder');
  });
});
