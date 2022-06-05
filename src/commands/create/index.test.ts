import { SimpleGit } from 'simple-git';
import {
  createCommits,
  createRepo,
  deleteRepo,
  getRepoPath,
} from 'utils/testRepo';
import { getUpdatedAfter } from '.';

describe('getUpdatedAfter', () => {
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

  it('should return empty string when repo has no commit', async () => {
    expect(await getUpdatedAfter(git)).toBe('');
  });

  it('should return current commit when repo has one commit', async () => {
    const commit = await createCommits(repoPath, 1);

    expect(await getUpdatedAfter(git)).toBe(commit.commit);
  });

  it('should return current commit when repo has two commit', async () => {
    const commit = await createCommits(repoPath, 2);

    expect(await getUpdatedAfter(git)).toBe(commit.commit);
  });
});
