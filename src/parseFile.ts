import fs from 'fs';
import path, { join } from 'path';

import simpleGit, { DefaultLogFields, SimpleGit } from 'simple-git';

export interface ParseFileOptions {
  gitDir?: string;
}

interface ParsedFile {
  lastUpdate: Date;
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

/**
 * Parse file metadata
 */
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

/**
 * Get most recent dates when dependencies were changed in git
 */
const getDependenciesLastUpdates = async (
  git: SimpleGit,
  filename: string,
  metadata: Metadata,
): Promise<{ file: string; lastUpdate?: Date }[]> =>
  Promise.all(
    metadata.dependencies.map(async dep => {
      const absolutePath = dep.replace('./', `${path.dirname(filename)}/`);

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

/**
 * Get last update date of documentation
 */
// TODO: test this
const getDocumentationLastUpdate = async (
  git: SimpleGit,
  { updatedAfter }: Metadata,
): Promise<Date> => {
  // was created at first commit
  if (updatedAfter === '') {
    const commits = await git.log();
    return new Date(commits.all[commits.all.length - 1].date);
  }

  const getBeforeTheLastCommit = (
    commits: ReadonlyArray<DefaultLogFields>,
  ): DefaultLogFields =>
    commits.length > 1
      ? commits[commits.length - 2]
      : commits[commits.length - 1];

  return (
    git
      .log({
        from: `${updatedAfter}~`,
        to: 'HEAD',
      })
      // was created after second commit
      .then(commits => new Date(getBeforeTheLastCommit(commits.all).date))
      // was created at second commit
      .catch(async () => {
        const commits = await git.log();

        return new Date(getBeforeTheLastCommit(commits.all).date);
      })
  );
};

/**
 * Get last update dates from documentation metadata
 */
const parseFile = async (
  filename: string,
  options: ParseFileOptions,
): Promise<ParsedFile> => {
  let git = simpleGit();
  if (options.gitDir)
    git = simpleGit().cwd({ path: options.gitDir, root: true });

  const file = readFile(join(options.gitDir || '', filename));
  const metadata = parseMetadata(file);

  return {
    lastUpdate: await getDocumentationLastUpdate(git, metadata),
    dependencies: await getDependenciesLastUpdates(git, filename, metadata),
  };
};

export default parseFile;
