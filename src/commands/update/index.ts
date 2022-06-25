import fs from 'fs';
import { join } from 'path';

import defaultParser from '../../parsers/default';

import { UpdateFileOptions } from './types';

const updateFile = async (
  fileName: string,
  options: UpdateFileOptions,
): Promise<void> => {
  const absoluteFileName = join(options.gitDir ?? '', fileName);

  const content = fs.readFileSync(absoluteFileName, 'utf-8');

  const metadata = defaultParser.parseMetadata(content);
  const newMetadata = {
    ...metadata,
    updatedAt: new Date(Date.now()),
  };

  const newContent = defaultParser.stringifyMetadata(
    newMetadata,
    defaultParser.removeMetadata(content),
  );
  fs.writeFileSync(absoluteFileName, newContent, 'utf-8');
};

export default updateFile;
