import fs from 'fs';
import path from 'path';

import simpleGit from 'simple-git';

// TODO: Rename interfaces
interface Result {
  lastUpdate: Date;
  dependencies: { file: string; lastUpdate?: Date }[];
}

interface MetadataWithParsedDependencies {
  updatedAfter: string;
  dependencies: { file: string; lastUpdate?: Date }[];
}

interface Metadata {
  updatedAfter: string;
  dependencies: string[];
}

interface ParsingMetadata {
  updatedAfter?: string;
  dependencies: string[];
}

const readFile = (filename: string): string =>
  // TODO: handle exceptions
  fs.readFileSync(filename, 'utf8');

export const parseMetadata = (content: string): Metadata => {
  const metadataStartIndex = content.indexOf('---');
  const metadataEndIndex = content.indexOf('\n---', metadataStartIndex + 1);

  const metadataContent = content.substring(
    content.indexOf('\n', metadataStartIndex) + 1,
    metadataEndIndex,
  );

  const result: ParsingMetadata = { dependencies: [] };

  const metadataRows = metadataContent.split('\n');
  metadataRows.forEach(row => {
    let [key, value] = row.split(': ');
    key = key.trim();
    value = value.trim();

    switch (key) {
      case 'updatedAfter':
        result.updatedAfter = value;
        break;
      case 'dep':
        result.dependencies.push(value);
        break;
      default:
        break;
    }
  });

  if (result.updatedAfter === undefined)
    throw new Error('updateAfter is missing');

  // TODO: find more optimal way to silence TS
  return result as Metadata;
};

const relativeToAbsolutePaths = (
  basePath: string,
  relativePath: string,
): string => relativePath.replace('./', `${basePath}/`);

const parseDependencies = async (
  filename: string,
  metadata: Metadata,
): Promise<MetadataWithParsedDependencies> => {
  const dependencies = await Promise.all(
    metadata.dependencies.map(async dep => {
      const absolutePath = relativeToAbsolutePaths(path.dirname(filename), dep);
      const log = await simpleGit().log({
        file: absolutePath,
        maxCount: 1,
      });
      const lastUpdateISO = log.latest?.date;

      return {
        file: absolutePath,
        lastUpdate: lastUpdateISO ? new Date(lastUpdateISO) : undefined,
      };
    }),
  );

  return { updatedAfter: metadata.updatedAfter, dependencies };
};

const parseFile = async (filename: string): Promise<Result> => {
  const file = readFile(filename);
  const metadata = parseMetadata(file);
  const metadataWithDeps = await parseDependencies(filename, metadata);

  const fileCommits = await simpleGit().log({
    from: `${metadataWithDeps.updatedAfter}~`,
    to: 'HEAD',
  });

  // take next commit if already exists or take the commit
  const lastUpdated =
    fileCommits.all.length > 1
      ? fileCommits.all[fileCommits.all.length - 2].date
      : fileCommits.all[fileCommits.all.length - 1].date;

  return {
    ...metadataWithDeps,
    lastUpdate: new Date(lastUpdated),
  };
};

export default parseFile;
