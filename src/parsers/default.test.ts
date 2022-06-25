import defaultParser from './default';

const { parseMetadata, stringifyMetadata } = defaultParser;

describe('default parser', () => {
  describe('parseMetadata', () => {
    it('should parse normal file', () => {
      const content = `
---
updated_at: 2022-06-25T08:38:21.689Z
deps: [./dep1.js, ./dep2.js]
---
`;
      expect(parseMetadata(content)).toEqual({
        updatedAt: new Date('2022-06-25T08:38:21.689Z'),
        dependencies: ['./dep1.js', './dep2.js'],
        other: {},
      });
    });

    it('should parse file with whitespaces', () => {
      const content = `
---
 updated_at :   2022-06-25T08:38:21.689Z   

deps:  [ ./dep1.js,  ./dep2.js  ]  
---
`;
      expect(parseMetadata(content)).toEqual({
        updatedAt: new Date('2022-06-25T08:38:21.689Z'),
        dependencies: ['./dep1.js', './dep2.js'],
        other: {},
      });
    });
    it('should parse other metadata', () => {
      const content = `
---
updated_at :  2022-06-25T08:38:21.689Z 
deps: [./dep1.js, ./dep2.js]
other_metadata: abc
random: cba
---
`;
      expect(parseMetadata(content)).toEqual({
        updatedAt: new Date('2022-06-25T08:38:21.689Z'),
        dependencies: ['./dep1.js', './dep2.js'],
        other: { other_metadata: 'abc', random: 'cba' },
      });
    });
  });
  describe('stringifyMetadata', () => {
    it('should stringify doccheck metadata', () => {
      const updatedAt = new Date(1);
      const result = stringifyMetadata(
        {
          updatedAt,
          dependencies: ['a', 'b'],
          other: {},
        },
        '1\n2',
      );
      expect(result).toBe(`---
updated_at: ${updatedAt.toISOString()}
deps: [a, b]
---
1
2`);
    });

    it('should stringify other metadata', () => {
      const updatedAt = new Date(1);
      const result = stringifyMetadata(
        {
          updatedAt,
          dependencies: ['a', 'b'],
          other: { other_metadata: '123', random_metadata: 'abc' },
        },
        '1\n2',
      );
      expect(result).toBe(`---
updated_at: ${updatedAt.toISOString()}
deps: [a, b]

other_metadata: 123
random_metadata: abc
---
1
2`);
    });
  });
});
