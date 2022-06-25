import fs from 'fs';

import defaultParser from '../../parsers/default';

const createDocumentation = async (fileName: string): Promise<void> => {
  const metadata = defaultParser.stringifyMetadata(
    {
      updatedAt: new Date(Date.now()),
      dependencies: [],
      other: {},
    },
    '',
  );

  fs.writeFileSync(fileName, metadata, 'utf-8');
};

export default createDocumentation;
