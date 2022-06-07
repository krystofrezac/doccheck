export interface Metadata {
  updatedAfter: string;
  dependencies: string[];
}

/**
 * Parse file metadata
 */
export const parseMetadata = (fileContent: string): Metadata => {
  const metadataStartIndex = fileContent.indexOf('---');
  const metadataEndIndex = fileContent.indexOf('\n---', metadataStartIndex + 1);

  const metadataContent = fileContent.substring(
    fileContent.indexOf('\n', metadataStartIndex) + 1,
    metadataEndIndex,
  );

  const result: Metadata = { updatedAfter: '', dependencies: [] };

  const metadataRows = metadataContent.split('\n');
  metadataRows.forEach(row => {
    let [key, value] = row.split(': ');
    key = key.trim();
    value = value ? value.trim() : '';

    switch (key) {
      case 'updatedAfter':
        result.updatedAfter = value;
        break;
      case 'dep':
        result.dependencies.push(value);
        break;
      default:
        break;
    }
  });

  return result;
};

/**
 * Generate string from metadata
 */
export const stringifyMetadata = (metadata: Metadata): string => {
  const deps = metadata.dependencies.map(dep => `dep: ${dep}`).join('\n');

  let content = '---\n';
  content += `updatedAfter: ${metadata.updatedAfter}\n`;
  content += `${deps}\n`;
  content += '---';
  return content;
};

/**
 * Delete metadata from file content
 */
export const deleteMetadata = (content: string): string => {
  const start = content.indexOf('---');
  const end = content.indexOf('---', start + 1) + 3;

  return content.substring(0, start) + content.substring(end);
};
