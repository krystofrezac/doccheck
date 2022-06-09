import fs from 'fs';
import { join } from 'path';

import {
  createCommits,
  createDocumentationFile,
  createRepo,
  deleteRepo,
  getRepoPath,
} from 'utils/testRepo';

import updateFile from '.';

describe('updateFile', () => {
  let repoPath: string;

  beforeEach(async () => {
    repoPath = getRepoPath();
    deleteRepo(repoPath);
    await createRepo(repoPath);
  });
  afterEach(() => {
    deleteRepo(repoPath);
  });

  it('should write current commit', async () => {
    createDocumentationFile(repoPath, 'doc', {
      updatedAfter: '',
      dependencies: ['dep1', 'dep2'],
    });
    const lastCommit = await createCommits(repoPath, 2);

    await updateFile('doc', { gitDir: repoPath });
    expect(fs.readFileSync(join(repoPath, 'doc'), 'utf-8')).toBe(`---
updatedAfter: ${lastCommit.commit}
dep: dep1
dep: dep2
---`);
  });
});
