import fs from 'fs';
import { join } from 'path';
import simpleGit from 'simple-git';
import {
  deleteMetadata,
  parseMetadata,
  stringifyMetadata,
} from '../../utils/metadata';
import getLastCommitHash from '../../utils/git';
import { UpdateFileOptions } from './types';

const updateFile = async (
  fileName: string,
  options: UpdateFileOptions,
): Promise<void> => {
  let git = simpleGit();
  if (options.gitDir)
    git = simpleGit().cwd({ path: options.gitDir, root: true });

  const absoluteFileName = join(options.gitDir ?? '', fileName);

  const content = fs.readFileSync(absoluteFileName, 'utf-8');

  const metadata = parseMetadata(content);
  const newMetadata = {
    ...metadata,
    updatedAfter: await getLastCommitHash(git),
  };

  const newContent = stringifyMetadata(newMetadata) + deleteMetadata(content);
  fs.writeFileSync(absoluteFileName, newContent, 'utf-8');
};

export default updateFile;
