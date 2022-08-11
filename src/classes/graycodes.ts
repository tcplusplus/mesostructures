export const toGrayCode = (n: number) => {
  if (n < 0) {
    throw new RangeError('cannot convert negative numbers to gray code');
  }
  // eslint-disable-next-line no-bitwise
  return n ^ (n >>> 1);
};

export const fromGrayCode = (gn: number) => {
  if (gn < 0) {
    throw new RangeError('gray code numbers cannot be negative');
  }
  // @ts-ignore
  const g: number[] = gn.toString(2).split('');
  const b: number[] = [];
  // eslint-disable-next-line prefer-destructuring
  b[0] = g[0];
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < g.length; i++) {
    // eslint-disable-next-line no-bitwise
    b[i] = g[i] ^ b[i - 1];
  }
  return parseInt(b.join(''), 2);
};