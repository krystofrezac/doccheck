import defaultParser from './default';

const { parseMetadata, stringifyMetadata } = defaultParser;

describe('default parser', () => {
  describe('parseMetadata', () => {
    it('should parse normal file', () => {
      const content = `
---
updated_after: xyz
deps: [./dep1.js, ./dep2.js]
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

deps:  [ ./dep1.js,  ./dep2.js  ]  
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
deps: [./dep1.js, ./dep2.js]
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
      const result = stringifyMetadata(
        {
          updatedAfter: 'abc',
          dependencies: ['a', 'b'],
          other: {},
        },
        '1\n2',
      );
      expect(result).toBe(`---
updated_after: abc
deps: [a, b]
---
1
2`);
    });

    it('should stringify other metadata', () => {
      const result = stringifyMetadata(
        {
          updatedAfter: 'abc',
          dependencies: ['a', 'b'],
          other: { other_metadata: '123', random_metadata: 'abc' },
        },
        '1\n2',
      );
      expect(result).toBe(`---
updated_after: abc
deps: [a, b]

other_metadata: 123
random_metadata: abc
---
1
2`);
    });
  });
});
