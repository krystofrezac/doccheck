import fs from 'fs';
import { dirname, join } from 'path';
import simpleGit, { CommitResult, SimpleGit } from 'simple-git';

let index = 0;

export const getRepoPath = (): string => {
  index += 1;
  return join(
    dirname(require.main?.filename || ''),
    `testRepo-${process.env.JEST_WORKER_ID}-${index}`,
  );
};

export const getGit = (repoPath: string): SimpleGit =>
  simpleGit().cwd({ path: repoPath, root: true });

export const createRepo = (repoPath: string): SimpleGit => {
  fs.mkdirSync(repoPath);

  return simpleGit().init([repoPath]).cwd({ path: repoPath, root: true });
};
export const deleteRepo = (repoPath: string): void => {
  fs.rmSync(repoPath, { recursive: true, force: true });
};

export const wait = (time: number = 2000): Promise<void> =>
  new Promise(r => {
    setTimeout(r, time);
  });

export const createDocumentationFile = (
  repoPath: string,
  name: string,
  metadata: { updatedAfter: string; deps: string[] },
): string => {
  const deps = metadata.deps.map(dep => `dep: ${dep}`).join('\n');

  let content = '---\n';
  content += `updatedAfter: ${metadata.updatedAfter}\n`;
  content += `${deps}\n`;
  content += '---';

  fs.writeFileSync(join(repoPath, name), content, 'utf-8');
  return name;
};
export const createFile = (repoPath: string, name: string): string => {
  fs.writeFileSync(join(repoPath, name), '', 'utf-8');
  return name;
};
export const createCommits = async (
  repoPath: string,
  numberOfCommits: number,
): Promise<CommitResult> => {
  const git = getGit(repoPath);

  let lastCommit: CommitResult = {} as CommitResult;

  for (let i = 0; i < numberOfCommits; i += 1) {
    createFile(repoPath, 'file1');
    // eslint-disable-next-line no-await-in-loop
    lastCommit = await git.add('.').commit('commit 1');
    // eslint-disable-next-line no-await-in-loop
    await wait();
  }
  return lastCommit;
};
