import { Dataset } from './dataset';

describe('dataset', () => {
  it('Test dataset loads dataset from assets', () => {
    const dataset = Dataset.loadTestSet();
    expect(dataset.horizontal.levels[0].main).toBe('hello');
  })
})