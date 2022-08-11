import { fromGrayCode, toGrayCode } from './graycodes'


describe ('Graycodes', () => {
  it ('The graycode of 0 is 0', () => {
    expect(toGrayCode(0)).toBe(0)
  })

  it ('The graycode of 3 (011) is  2 (010)', () => {
    expect(toGrayCode(3)).toBe(2)
  })

  it ('The binary of 2 (010) is 3 (011)', () => {
    expect(fromGrayCode(2)).toBe(3)
  })
})