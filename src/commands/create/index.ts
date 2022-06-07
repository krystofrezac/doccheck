import fs from 'fs';
import simpleGit from 'simple-git';
import getLastCommitHash from '../../utils/git';
import { CreateDocumentationOptions } from './types';

const createDocumentation = async (
  fileName: string,
  options: CreateDocumentationOptions,
): Promise<void> => {
  let git = simpleGit();
  if (options.gitDir)
    git = simpleGit().cwd({ path: options.gitDir, root: true });

  const updatedAfter = await getLastCommitHash(git);

  let metadata = '---\n';
  metadata += `updatedAfter: ${updatedAfter}\n`;
  metadata += '---\n';

  fs.writeFileSync(fileName, metadata, 'utf-8');
};

export default createDocumentation;
