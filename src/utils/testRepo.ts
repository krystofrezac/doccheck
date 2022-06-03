import fs from 'fs';
import { dirname, join } from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

export const getRepoPath = (): string =>
  join(
    dirname(require.main?.filename || ''),
    `testRepo-${process.env.JEST_WORKER_ID}`,
  );

export const createRepo = (repoPath: string): SimpleGit => {
  fs.mkdirSync(repoPath);

  return simpleGit().init([repoPath]).cwd({ path: repoPath, root: true });
};
export const deleteRepo = (repoPath: string): void => {
  fs.rmSync(repoPath, { recursive: true, force: true });
};

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
