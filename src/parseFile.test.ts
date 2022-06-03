import { SimpleGit } from 'simple-git';

import {
  createDocumentationFile,
  createFile,
  createRepo,
  deleteRepo,
  getRepoPath,
} from 'utils/testRepo';

import parseFile, { parseMetadata } from './parseFile';

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

describe('parseFile', () => {
  let git: SimpleGit;
  let repoPath: string;

  beforeEach(() => {
    repoPath = getRepoPath();

    git = createRepo(repoPath);
  });
  afterAll(() => {
    deleteRepo(repoPath);
  });

  it('should generate same date for documentation and dependencies when they were created at the first commit', async () => {
    createFile(repoPath, 'dep1');
    createDocumentationFile(repoPath, 'doc', {
      updatedAfter: '',
      deps: ['./dep1'],
    });
    await git.add('.').commit('commit 1');

    const result = await parseFile('doc', { gitDir: repoPath });

    expect(result.dependencies.length).toBe(1);
    expect(result.lastUpdate).toEqual(result.dependencies[0].lastUpdate);
  });
});
