import fs from 'fs';

import simpleGit from 'simple-git';

import defaultParser from '../../parsers/default';
import getLastCommitHash from '../../utils/git';

import { CreateDocumentationOptions } from './types';

const createDocumentation = async (
  fileName: string,
  options: CreateDocumentationOptions,
): Promise<void> => {
  let git = simpleGit();
  if (options.gitDir)
    git = simpleGit().cwd({ path: options.gitDir, root: true });

  const metadata = defaultParser.stringifyMetadata(
    {
      updatedAfter: await getLastCommitHash(git),
      dependencies: [],
      other: {},
    },
    '',
  );

  fs.writeFileSync(fileName, metadata, 'utf-8');
};

export default createDocumentation;
