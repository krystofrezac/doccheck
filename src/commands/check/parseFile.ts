import fs from 'fs';
import path, { join } from 'path';

import simpleGit, { SimpleGit } from 'simple-git';

import defaultParser, { Metadata } from '../../parsers/default';

import { ParsedFile, ParseFileOptions } from './types';

const readFile = (filename: string): string =>
  // TODO: handle exceptions
  fs.readFileSync(filename, 'utf8');

/**
 * Get most recent dates when dependencies were changed in git
 */
export const getDependenciesLastUpdates = async (
  git: SimpleGit,
  filename: string,
  metadata: Metadata,
): Promise<{ file: string; lastUpdate?: Date }[]> =>
  Promise.all(
    metadata.dependencies.map(async dep => {
      let absolutePath = dep;

      if (dep.startsWith('../'))
        absolutePath = dep.replace('../', `${path.dirname(filename)}/../`);
      if (dep.startsWith('./'))
        absolutePath = dep.replace('./', `${path.dirname(filename)}/`);

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
  const metadata = defaultParser.parseMetadata(file);

  return {
    updatedAt: metadata.updatedAt,
    dependencies: await getDependenciesLastUpdates(git, filename, metadata),
  };
};

export default parseFile;
