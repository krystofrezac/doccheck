import { parseMetadata } from './parseFile';

describe('parseMetadata', () => {
  it('should parse normal file', () => {
    const content = `
---
updatedAfter: xyz
dep: ./dep1.js
dep: ./dep2.js
---
`;
    expect(parseMetadata(content)).toEqual({
      updatedAfter: 'xyz',
      dependencies: ['./dep1.js', './dep2.js'],
    });
  });

  it('should parse file with whitespaces', () => {
    const content = `
---
 updatedAfter :  xyz 
dep: ./dep1.js 
 dep: ./dep2.js
---
`;
    expect(parseMetadata(content)).toEqual({
      updatedAfter: 'xyz',
      dependencies: ['./dep1.js', './dep2.js'],
    });
  });
});
