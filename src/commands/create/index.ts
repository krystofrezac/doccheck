import fs from 'fs';
import simpleGit, { SimpleGit } from 'simple-git';
import { CreateDocumentationOptions } from './types';

export const getUpdatedAfter = async (git: SimpleGit): Promise<string> =>
  git
    .log({ from: 'HEAD~', to: 'HEAD' })
    .then(log => log.latest?.hash ?? '')
    // repo has less than 2 commits
    .catch(() =>
      git
        .log()
        // repo has 1 commit
        .then(log => log.latest?.hash ?? '')
        // repo has no commits
        .catch(() => ''),
    );

const createDocumentation = async (
  fileName: string,
  options: CreateDocumentationOptions,
): Promise<void> => {
  let git = simpleGit();
  if (options.gitDir)
    git = simpleGit().cwd({ path: options.gitDir, root: true });

  const updatedAfter = await getUpdatedAfter(git);

  let metadata = '---\n';
  metadata += `updatedAfter: ${updatedAfter}\n`;
  metadata += '---\n';

  fs.writeFileSync(fileName, metadata, 'utf-8');
};

export default createDocumentation;
