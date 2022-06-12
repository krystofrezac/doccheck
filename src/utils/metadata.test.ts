import { parseMetadata, stringifyMetadata } from './metadata';

describe('parseMetadata', () => {
  it('should parse normal file', () => {
    const content = `
---
updated_after: xyz
dep: ./dep1.js
dep: ./dep2.js
---
`;
    expect(parseMetadata(content)).toEqual({
      updatedAfter: 'xyz',
      dependencies: ['./dep1.js', './dep2.js'],
      other: {},
    });
  });

  it('should parse file with whitespaces', () => {
    const content = `
---
 updated_after :  xyz 

dep: ./dep1.js 
 dep: ./dep2.js
---
`;
    expect(parseMetadata(content)).toEqual({
      updatedAfter: 'xyz',
      dependencies: ['./dep1.js', './dep2.js'],
      other: {},
    });
  });
  it('should parse other metadata', () => {
    const content = `
---
updated_after :  xyz 
dep: ./dep1.js 
dep: ./dep2.js
other_metadata: abc
random: cba
---
`;
    expect(parseMetadata(content)).toEqual({
      updatedAfter: 'xyz',
      dependencies: ['./dep1.js', './dep2.js'],
      other: { other_metadata: 'abc', random: 'cba' },
    });
  });
});
describe('stringifyMetadata', () => {
  it('should stringify doccheck metadata', () => {
    const result = stringifyMetadata({
      updatedAfter: 'abc',
      dependencies: ['a', 'b'],
      other: {},
    });
    expect(result).toBe(`---
updated_after: abc
dep: a
dep: b
---`);
  });

  it('should stringify other metadata', () => {
    const result = stringifyMetadata({
      updatedAfter: 'abc',
      dependencies: ['a', 'b'],
      other: { other_metadata: '123', random_metadata: 'abc' },
    });
    expect(result).toBe(`---
updated_after: abc
dep: a
dep: b

other_metadata: 123
random_metadata: abc
---`);
  });
});
