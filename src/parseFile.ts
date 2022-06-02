import fs from 'fs';

interface ParsedFile {
  lastUpdate?: string;
  dependencies: string[];
}

interface ParsingFile {
  lastUpdate?: string;
  dependencies: string[];
}

const readFile = (filename: string): string =>
  // TODO: handle exceptions
  fs.readFileSync(filename, 'utf8');

export const parseFileContent = (content: string): ParsedFile => {
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

const parseFile = (filename: string): ParsedFile => {
  const content = readFile(filename);
  return parseFileContent(content);
};

export default parseFile;
