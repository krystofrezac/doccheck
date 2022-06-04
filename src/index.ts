import yargs from 'yargs/yargs';

import parseFile, { ParseFileOptions } from './parseFile';

const checkFile = async (
  filename: string,
  options: ParseFileOptions,
): Promise<void> => {
  const metadata = await parseFile(filename, options);

  console.log(metadata);
};

const checkFiles = async (
  files: string[],
  options: ParseFileOptions,
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
