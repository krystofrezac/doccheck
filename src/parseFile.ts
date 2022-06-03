import fs from 'fs';
import path, { join } from 'path';

import simpleGit, { SimpleGit } from 'simple-git';

export interface CheckOptions {
  gitDir?: string;
}

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
  git: SimpleGit,
): Promise<MetadataWithParsedDependencies> => {
  const dependencies = await Promise.all(
    metadata.dependencies.map(async dep => {
      const absolutePath = relativeToAbsolutePaths(path.dirname(filename), dep);

      const log = await git.log({
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

// TODO: test this
const getDocumentationLastUpdate = async (
  updatedAfter: string,
  git: SimpleGit,
): Promise<Date> => {
  let lastUpdated;

  // was created at first commit
  if (updatedAfter === '') {
    const commits = await git.log();

    lastUpdated = commits.all[commits.all.length - 1].date;
  } else {
    const fileCommits = await git
      .log({
        from: `${updatedAfter}~`,
        to: 'HEAD',
      })
      .then(res => res)
      .catch(() =>
        // updatedAfter is the first commit
        git.log(),
      );

    lastUpdated =
      fileCommits.all.length > 1
        ? fileCommits.all[fileCommits.all.length - 2].date
        : fileCommits.all[fileCommits.all.length - 1].date;
  }

  // take next commit if already exists or take the commit

  return new Date(lastUpdated);
};

const parseFile = async (
  filename: string,
  options: CheckOptions,
): Promise<Result> => {
  let git = simpleGit();
  if (options.gitDir)
    git = simpleGit().cwd({ path: options.gitDir, root: true });

  const file = readFile(join(options.gitDir || '', filename));
  const metadata = parseMetadata(file);
  const metadataWithDeps = await parseDependencies(filename, metadata, git);

  return {
    lastUpdate: await getDocumentationLastUpdate(
      metadataWithDeps.updatedAfter,
      git,
    ),
    dependencies: metadataWithDeps.dependencies,
  };
};

export default parseFile;
