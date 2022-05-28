import yargs from 'yargs/yargs';

interface Metadata {
  lastUpdate: string;
  dependencies: { filename: string; lastUpdate: string }[];
}

const parseFile = (filename: string): Metadata => ({
  lastUpdate: '',
  dependencies: [{ filename: 'src/a.ts', lastUpdate: '' }],
});

const isCommitBeforeCommit = (commit1: string, commit2: string): boolean =>
  true;

const checkFile = (filename: string): void => {
  const metadata = parseFile(filename);

  const updatedDependencies = metadata.dependencies.filter(dependency =>
    isCommitBeforeCommit(dependency.lastUpdate, metadata.lastUpdate),
  );

  if (updatedDependencies.length === 0) return;

  console.log(
    'Check if documentation in file `',
    filename,
    "` doesn't need to be updated",
  );
  console.log('  Dependencies of this files have changed');
  updatedDependencies.forEach(dependency =>
    console.log(' ', dependency.filename),
  );
};

// eslint-disable-next-line no-unused-expressions
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
