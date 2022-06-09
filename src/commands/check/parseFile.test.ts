import { SimpleGit } from 'simple-git';

import { parseMetadata } from 'utils/metadata';
import {
  createCommits,
  createDocumentationFile,
  createFile,
  createRepo,
  deleteRepo,
  getRepoPath,
  wait,
} from 'utils/testRepo';

import parseFile, { getDocumentationLastUpdate } from './parseFile';

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

describe('getDocumentationLastUpdate', () => {
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

  it('should return undefined when no repo has no commits', async () => {
    const result = await getDocumentationLastUpdate(git, '');
    expect(result).toBeUndefined();
  });

  it('should return date of first commit when updatedAfter is empty', async () => {
    await createCommits(repoPath, 1);
    const commitDate = new Date((await git.log()).latest!.date);

    const result = await getDocumentationLastUpdate(git, '');
    expect(result).toEqual(commitDate);
  });

  it('should return date of updatedAfter commit when it is last commit', async () => {
    const lastCommit = await createCommits(repoPath, 2);

    const commitDate = new Date(
      (
        await git.log({
          from: `${lastCommit.commit}~`,
          to: lastCommit.commit,
        })
      ).latest!.date,
    );

    const result = await getDocumentationLastUpdate(git, lastCommit.commit);
    expect(result).toEqual(commitDate);
  });

  it('should return date of commit after updatedAfter when documentation was not create at last commit', async () => {
    const documentationCommit = await createCommits(repoPath, 1);
    const afterDocumentationCommit = await createCommits(repoPath, 1);
    await createCommits(repoPath, 1);

    const commitDate = new Date(
      (
        await git.log({
          from: `${afterDocumentationCommit.commit}~`,
          to: afterDocumentationCommit.commit,
        })
      ).latest!.date,
    );

    const result = await getDocumentationLastUpdate(
      git,
      documentationCommit.commit,
    );
    expect(result).toEqual(commitDate);
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
      dependencies: ['./dep1'],
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
      dependencies: ['./dep1'],
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
      dependencies: ['./dep1'],
    });
    await git.add('.').commit('commit 3');

    const result = await parseFile('doc', { gitDir: repoPath });
    expect(result.dependencies.length).toBe(1);
    expect(result.lastUpdate).toEqual(result.dependencies[0].lastUpdate);
  });

  it('it should parse earlier date for documentation if documentation was created one commit earlier', async () => {
    createDocumentationFile(repoPath, 'doc', {
      updatedAfter: '',
      dependencies: ['./dep1'],
    });
    await git.add('.').commit('commit 1');
    await wait();

    createFile(repoPath, 'dep1');
    await git.add('.').commit('commit 2');

    const result = await parseFile('doc', { gitDir: repoPath });
    expect(result.dependencies.length).toBe(1);
    expect(result.dependencies[0].lastUpdate).not.toBeUndefined();
    expect(result.lastUpdate).not.toBeUndefined();
    expect(
      result.lastUpdate! < result.dependencies[0].lastUpdate!,
    ).toBeTruthy();
  });

  it('it should parse earlier date for dependency if dependency was created one commit earlier', async () => {
    createFile(repoPath, 'dep1');
    const firstCommit = await git.add('.').commit('commit 1');
    await wait();

    createDocumentationFile(repoPath, 'doc', {
      updatedAfter: firstCommit.commit,
      dependencies: ['./dep1'],
    });
    await git.add('.').commit('commit 2');

    const result = await parseFile('doc', { gitDir: repoPath });

    expect(result.dependencies.length).toBe(1);
    expect(result.dependencies[0].lastUpdate).not.toBeUndefined();
    expect(result.lastUpdate).not.toBeUndefined();
    expect(
      result.dependencies[0].lastUpdate! < result.lastUpdate!,
    ).toBeTruthy();
  });

  it('should parse undefined dates when there are no commits', async () => {
    createFile(repoPath, 'dep1');
    createDocumentationFile(repoPath, 'doc', {
      updatedAfter: '',
      dependencies: ['./dep1'],
    });
    const result = await parseFile('doc', { gitDir: repoPath });

    expect(result.dependencies.length).toBe(1);
    expect(result.dependencies[0].lastUpdate).toBeUndefined();
    expect(result.lastUpdate).toBeUndefined();
  });
});
