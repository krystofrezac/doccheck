import yargs from 'yargs/yargs';

// eslint-disable-next-line no-unused-expressions
yargs(process.argv.slice(2))
  .scriptName('doccheck')
  .usage('$0 <cmd> [args]')
  .command(
    'check',
    'Check if files are up to date',
    yargs => {},
    argv => {
      console.log('checking:', argv.file);
    },
  )
  .option('f', {
    alias: 'file',
  })
  .help().argv;
