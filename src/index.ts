import yargs from 'yargs/yargs';

import parseFile, { CheckOptions } from './parseFile';

const checkFile = async (
  filename: string,
  options: CheckOptions,
): Promise<void> => {
  const metadata = await parseFile(filename, options);

  console.log(metadata);
};

export const checkFiles = async (
  files: string[],
  options: CheckOptions,
): Promise<void> => {
  await Promise.all(files.map(file => checkFile(file, options)));
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
