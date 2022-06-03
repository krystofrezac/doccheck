import { SimpleGit } from 'simple-git';

import {
  TEST_REPO_FOLDER,
  createRepo,
  deleteRepo,
  createDocumentationFile,
  createFile,
} from 'utils/testRepo';
import { checkFiles } from './index';

describe('check command', () => {
  let git: SimpleGit;
  beforeEach(() => {
    deleteRepo();
    git = createRepo();
  });
  afterAll(() => {
    deleteRepo();
  });

  it('should succeed when documentation and dependencies were created at the first commit', async () => {
    createFile('dep1');
    createDocumentationFile('doc', { updatedAfter: '', deps: ['./dep1'] });
    await git.add('.').commit('commit 1');

    await checkFiles(['doc'], { gitDir: TEST_REPO_FOLDER });
  });
});
