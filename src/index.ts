import yargs from 'yargs/yargs';

import parseFile from './parseFile';

const checkFile = async (filename: string): Promise<void> => {
  const metadata = await parseFile(filename);

  console.log(metadata);
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
      argv.files.forEach(file => checkFile(file));
    },
  )
  .help().argv;
