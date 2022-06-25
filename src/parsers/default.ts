export interface Metadata {
  updatedAt: Date;
  dependencies: string[];
  // metadata not created by doccheck
  other: Record<string, string>;
}

interface Parser {
  /**
   * Parse metadata from file
   */
  parseMetadata: (file: string) => Metadata;
  /**
   * Generate file metadata
   * @file File content without metadata
   */
  stringifyMetadata: (metadata: Metadata, file: string) => string;
  /**
   * Remove metadata from file content
   */
  removeMetadata: (file: string) => string;
}

const defaultParser: Parser = {
  parseMetadata: (file: string) => {
    const metadataStartIndex = file.indexOf('---');
    const metadataEndIndex = file.indexOf('\n---', metadataStartIndex + 1);

    const metadataContent = file.substring(
      file.indexOf('\n', metadataStartIndex) + 1,
      metadataEndIndex,
    );

    const result: Metadata = {
      updatedAt: new Date(Date.now()),
      dependencies: [],
      other: {},
    };

    const metadataRows = metadataContent.split('\n');
    metadataRows.forEach(row => {
      let [key, value] = row.split(': ');
      key = key.trim();
      value = value ? value.trim() : '';

      switch (key) {
        case 'updated_at':
          result.updatedAt = new Date(value);
          break;
        case 'deps':
          value
            .slice(1, -1) // remove [ and ]
            .split(', ')
            .map(dep => dep.trim())
            .forEach(dep => {
              result.dependencies.push(dep);
            });
          break;
        case '':
          break;
        default:
          result.other[key] = value;
          break;
      }
    });

    return result;
  },
  stringifyMetadata: (metadata: Metadata, file: string) => {
    const deps = `[${metadata.dependencies.join(', ')}]`;

    let content = '---\n';
    content += `updated_at: ${metadata.updatedAt.toISOString()}\n`;
    content += `deps: ${deps}\n`;

    Object.keys(metadata.other).forEach((key, index) => {
      if (index === 0) content += '\n';
      content += `${key}: ${metadata.other[key]}\n`;
    });

    content += '---';
    if (file !== '') content += '\n';
    content += file;

    return content;
  },
  removeMetadata: (file: string) => {
    const start = file.indexOf('---');
    const end = file.indexOf('---', start + 1) + 3;
    const newlineAfterEnd = file.indexOf('\n', end);

    return file.substring(0, start) + file.substring(newlineAfterEnd + 1);
  },
};

export default defaultParser;
