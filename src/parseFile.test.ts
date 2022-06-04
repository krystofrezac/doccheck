import { SimpleGit } from 'simple-git';

import {
  createCommits,
  createDocumentationFile,
  createFile,
  createRepo,
  deleteRepo,
  getRepoPath,
  wait,
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

  beforeEach(async () => {
    repoPath = getRepoPath();
    deleteRepo(repoPath);
    git = await createRepo(repoPath);
  });
  afterEach(() => {
    deleteRepo(repoPath);
  });

  it('should parse same date for documentation and dependency when they were created at the first commit', async () => {
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

  it('should parse the same date for documentation and dependency when they were created at the second commit', async () => {
    const lastCommit = await createCommits(repoPath, 1);

    createFile(repoPath, 'dep1');
    createDocumentationFile(repoPath, 'doc', {
      updatedAfter: lastCommit?.commit,
      deps: ['./dep1'],
    });
    await git.add('.').commit('commit 2');

    const result = await parseFile('doc', { gitDir: repoPath });
    expect(result.dependencies.length).toBe(1);
    expect(result.lastUpdate).toEqual(result.dependencies[0].lastUpdate);
  });

  it('should parse the same date for documentation and dependency when they were created at the third commit', async () => {
    const lastCommit = await createCommits(repoPath, 2);

    createFile(repoPath, 'dep1');
    createDocumentationFile(repoPath, 'doc', {
      updatedAfter: lastCommit.commit,
      deps: ['./dep1'],
    });
    await git.add('.').commit('commit 3');

    const result = await parseFile('doc', { gitDir: repoPath });
    expect(result.dependencies.length).toBe(1);
    expect(result.lastUpdate).toEqual(result.dependencies[0].lastUpdate);
  });

  it('it should parse earlier date for documentation if documentation was created one commit earlier', async () => {
    createDocumentationFile(repoPath, 'doc', {
      updatedAfter: '',
      deps: ['./dep1'],
    });
    await git.add('.').commit('commit 1');
    await wait();

    createFile(repoPath, 'dep1');
    await git.add('.').commit('commit 2');

    const result = await parseFile('doc', { gitDir: repoPath });
    expect(result.dependencies.length).toBe(1);
    expect(result.lastUpdate < result.dependencies[0].lastUpdate!).toBeTruthy();
  });

  it('it should parse earlier date for dependency if dependency was created one commit earlier', async () => {
    createFile(repoPath, 'dep1');
    const firstCommit = await git.add('.').commit('commit 1');
    await wait();

    createDocumentationFile(repoPath, 'doc', {
      updatedAfter: firstCommit.commit,
      deps: ['./dep1'],
    });
    await git.add('.').commit('commit 2');

    const result = await parseFile('doc', { gitDir: repoPath });

    expect(result.dependencies.length).toBe(1);
    expect(result.dependencies[0].lastUpdate! < result.lastUpdate).toBeTruthy();
  });
});
