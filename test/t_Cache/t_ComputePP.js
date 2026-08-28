import { describe, it } from 'mocha';
import { expect } from 'chai';

import ComputePP from '../../src/Cache/PP/ComputePP.js';

describe('ComputePP', () => {
  it('Computes the payback period when the bank does not cover the price', () => {
    // (100 - 50) / 5 + 100 / 10
    expect(ComputePP(100, 10, 50, 5)).to.equal(20);
  });

  it('Ignores the waiting time when the bank covers the price', () => {
    // max(100 - 500, 0) / 5 + 100 / 10
    expect(ComputePP(100, 10, 500, 5)).to.equal(10);
  });

  it('Ignores the waiting time when the bank exactly covers the price', () => {
    expect(ComputePP(100, 10, 100, 5)).to.equal(10);
  });

  it('Only uses price over bonus when there is no CPS', () => {
    expect(ComputePP(100, 10, 50, 0)).to.equal(10);
  });

  it('Returns Infinity for a zero bonus', () => {
    expect(ComputePP(100, 0, 50, 5)).to.equal(Infinity);
    expect(ComputePP(100, 0, 50, 0)).to.equal(Infinity);
  });

  it('Returns Infinity for an undefined bonus (NaN guard)', () => {
    expect(ComputePP(100, undefined, 50, 5)).to.equal(Infinity);
    expect(ComputePP(100, undefined, 50, 0)).to.equal(Infinity);
  });

  it('Returns Infinity when both price and bonus are zero (NaN guard)', () => {
    expect(ComputePP(0, 0, 0, 0)).to.equal(Infinity);
  });

  it('Passes a negative payback period through for a negative bonus', () => {
    // Documents current behaviour: negative PP values are coloured gray downstream
    expect(ComputePP(100, -10, 500, 5)).to.equal(-10);
  });
});
