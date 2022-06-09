import fs from 'fs';
import path, { join } from 'path';

import simpleGit, { DefaultLogFields, SimpleGit } from 'simple-git';

import { Metadata, parseMetadata } from '../../utils/metadata';

import { ParsedFile, ParseFileOptions } from './types';

const readFile = (filename: string): string =>
  // TODO: handle exceptions
  fs.readFileSync(filename, 'utf8');

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

      return (
        git
          .log({
            file: absolutePath,
            maxCount: 1,
          })
          .then(commits => {
            const lastUpdateISO = commits.latest!.date; // latest always present - when no commit exception is raised

            return {
              file: absolutePath,
              lastUpdate: new Date(lastUpdateISO),
            };
          })
          // no commits in repo
          .catch(() => ({ file: absolutePath, lastUpdate: undefined }))
      );
    }),
  );

/**
 * Get last update date of documentation
 */
export const getDocumentationLastUpdate = async (
  git: SimpleGit,
  updatedAfter: string,
): Promise<Date | undefined> => {
  // was created at first commit
  if (updatedAfter === '') {
    return (
      git
        .log()
        .then(commits => new Date(commits.all[commits.all.length - 1].date))
        // no commits in repo
        .catch(() => undefined)
    );
  }

  const getBeforeTheLastCommit = (
    commits: ReadonlyArray<DefaultLogFields>,
  ): DefaultLogFields =>
    commits.length > 1
      ? commits[commits.length - 2]
      : commits[commits.length - 1];

  return (
    git
      // log from updatedAfter to HEAD
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
    lastUpdate: await getDocumentationLastUpdate(git, metadata.updatedAfter),
    dependencies: await getDependenciesLastUpdates(git, filename, metadata),
  };
};

export default parseFile;
