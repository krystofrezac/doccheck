import fs from 'fs';
import { join } from 'path';

import {
  createDocumentationFile,
  createRepo,
  deleteRepo,
  getRepoPath,
} from '../../utils/testRepo';

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

  it('should write current date', async () => {
    const doc = createDocumentationFile(repoPath, 'doc', {
      dependencies: ['dep1', 'dep2'],
    });

    await updateFile('doc', { gitDir: repoPath });

    expect(fs.readFileSync(join(repoPath, 'doc'), 'utf-8')).toBe(`---
updated_at: ${doc.metadata.updatedAt.toISOString()}
deps: [dep1, dep2]
---`);
  });
});
