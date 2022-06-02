import fs from 'fs';
import yargs from 'yargs/yargs';

interface Metadata {
  lastUpdate: string;
  dependencies: { filename: string; lastUpdate: string }[];
}

interface ParsedFile {
  lastUpdate: string;
  dependencies: string[];
}

interface ParsingFile {
  lastUpdate?: string;
  dependencies: string[];
}

const parseFile = (filename: string): ParsedFile => {
  // TODO: handle exceptions
  const content = fs.readFileSync(filename, 'utf8');
  const metadataStartIndex = content.indexOf('---');
  const metadataEndIndex = content.indexOf('\n---', metadataStartIndex + 1);

  const metadataContent = content.substring(
    content.indexOf('\n', metadataStartIndex) + 1,
    metadataEndIndex,
  );

  const result: ParsingFile = { dependencies: [] };

  const metadataRows = metadataContent.split('\n');
  metadataRows.forEach(row => {
    let [key, value] = row.split(': ');
    key = key.trim();
    value = value.trim();

    switch (key) {
      case 'lastUpdate':
        result.lastUpdate = value;
        break;
      case 'dep':
        result.dependencies.push(value);
        break;
      default:
        break;
    }
  });

  if (result.lastUpdate === undefined) throw new Error('lastUpdate is missing');

  // TODO: find more optimal way to silence TS
  return result as ParsedFile;
};

const checkFile = (filename: string): void => {
  const metadata = parseFile(filename);

  console.log(metadata);
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
