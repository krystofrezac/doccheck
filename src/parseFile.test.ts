import { parseMetadata } from './parseFile';

describe('parseMetadata', () => {
  it('should parse normal file', () => {
    const content = `
---
lastUpdate: xyz
dep: ./dep1.js
dep: ./dep2.js
---
`;
    expect(parseMetadata(content)).toEqual({
      lastUpdate: 'xyz',
      dependencies: ['./dep1.js', './dep2.js'],
    });
  });

  it('should parse file with whitespaces', () => {
    const content = `
---
 lastUpdate :  xyz 
dep: ./dep1.js 
 dep: ./dep2.js
---
`;
    expect(parseMetadata(content)).toEqual({
      lastUpdate: 'xyz',
      dependencies: ['./dep1.js', './dep2.js'],
    });
  });
});
