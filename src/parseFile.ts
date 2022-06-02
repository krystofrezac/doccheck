import fs from 'fs';

interface MetadataWithParsedDependencies {
  lastUpdate: string;
  dependencies: { file: string; lastUpdate: string }[];
}

interface Metadata {
  lastUpdate: string;
  dependencies: string[];
}

interface ParsingMetadata {
  lastUpdate?: string;
  dependencies: string[];
}

const readFile = (filename: string): string =>
  // TODO: handle exceptions
  fs.readFileSync(filename, 'utf8');

export const parseMetadata = (content: string): Metadata => {
  const metadataStartIndex = content.indexOf('---');
  const metadataEndIndex = content.indexOf('\n---', metadataStartIndex + 1);

  const metadataContent = content.substring(
    content.indexOf('\n', metadataStartIndex) + 1,
    metadataEndIndex,
  );

  const result: ParsingMetadata = { dependencies: [] };

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
  return result as Metadata;
};

const parseDependencies = (
  metadata: Metadata,
): MetadataWithParsedDependencies => {
  const dependencies = metadata.dependencies.map(dep => ({
    file: dep,
    lastUpdate: 'abc',
  }));

  return { lastUpdate: metadata.lastUpdate, dependencies };
};

const parseFile = (filename: string): MetadataWithParsedDependencies => {
  const file = readFile(filename);
  const metadata = parseMetadata(file);
  return parseDependencies(metadata);
};

export default parseFile;
