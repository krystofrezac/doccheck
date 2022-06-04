import yargs from 'yargs/yargs';

import parseFile, { ParsedFile, ParseFileOptions } from './parseFile';

interface FileCheckResult {
  filename: string;
  updateRequired: boolean;
  updatedDependencies: string[];
}

export const shouldFileBeUpdated = (
  filename: string,
  parsedFile: ParsedFile,
): FileCheckResult => {
  const fileLastUpdate = parsedFile.lastUpdate;
  if (!fileLastUpdate)
    return { filename, updateRequired: false, updatedDependencies: [] };

  const updatedDependencies = parsedFile.dependencies
    .filter(dep => dep.lastUpdate && dep.lastUpdate > fileLastUpdate)
    .map(dep => dep.file);

  return {
    filename,
    updateRequired: updatedDependencies.length !== 0,
    updatedDependencies,
  };
};

const checkFile = async (
  filename: string,
  options: ParseFileOptions,
): Promise<FileCheckResult> => {
  const parsedFile = await parseFile(filename, options);
  return shouldFileBeUpdated(filename, parsedFile);
};

const checkFiles = async (
  files: string[],
  options: ParseFileOptions,
): Promise<void> => {
  const result = await Promise.all(files.map(file => checkFile(file, options)));
  if (result.length !== 0)
    console.log(
      'Documentation is not up to date. Check these files if they do not need to be updated!',
    );
  result
    .filter(file => file.updateRequired)
    .forEach(file => {
      console.log(file.filename, '- These dependencies were updated:');
      file.updatedDependencies.forEach(dep => console.log('  -', dep));
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(process.argv.slice(2))
  .scriptName('doccheck')
  .usage('$0 <cmd> [args]')
  .command(
    'check [files..]',
    'Check if files are up to date',
    () => {},
    argv => {
      if (!Array.isArray(argv.files)) return;
      // TODO: options
      checkFiles(argv.files, {});
    },
  )
  .help().argv;
