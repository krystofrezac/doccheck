import fs from 'fs';
import { join } from 'path';

import simpleGit, { CommitResult, SimpleGit } from 'simple-git';

import { stringifyMetadata } from './metadata';

let index = 0;

export const getRepoPath = (): string => {
  index += 1;
  return join(process.cwd(), `testRepo-${process.env.JEST_WORKER_ID}-${index}`);
};

export const getGit = async (repoPath: string): Promise<SimpleGit> => {
  const git = simpleGit();
  await git.cwd({ path: repoPath, root: true });
  return git;
};

export const createRepo = async (repoPath: string): Promise<SimpleGit> => {
  fs.mkdirSync(repoPath);

  await simpleGit().init([repoPath]);
  return getGit(repoPath);
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
  metadata: { updatedAfter: string; dependencies: string[] },
): string => {
  fs.writeFileSync(
    join(repoPath, name),
    stringifyMetadata({ ...metadata, other: {} }),
    'utf-8',
  );
  return name;
};
export const createFile = (repoPath: string, name: string): string => {
  fs.writeFileSync(join(repoPath, name), '', 'utf-8');
  return name;
};

let commitIndex = 0;
export const createCommits = async (
  repoPath: string,
  numberOfCommits: number,
): Promise<CommitResult> => {
  const git = await getGit(repoPath);

  let lastCommit: CommitResult = {} as CommitResult;

  for (let i = 0; i < numberOfCommits; i += 1) {
    commitIndex += 1;
    createFile(repoPath, `__file${commitIndex}`);
    // eslint-disable-next-line no-await-in-loop
    lastCommit = await git.add('.').commit(`commit ${commitIndex}`);
    // eslint-disable-next-line no-await-in-loop
    await wait();
  }
  return lastCommit;
};
