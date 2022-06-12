export interface Metadata {
  updatedAfter: string;
  dependencies: string[];
  // metadata not created by doccheck
  other: Record<string, string>;
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

  const result: Metadata = { updatedAfter: '', dependencies: [], other: {} };

  const metadataRows = metadataContent.split('\n');
  metadataRows.forEach(row => {
    let [key, value] = row.split(': ');
    key = key.trim();
    value = value ? value.trim() : '';

    switch (key) {
      case 'updated_after':
        result.updatedAfter = value;
        break;
      case 'dep':
        result.dependencies.push(value);
        break;
      case '':
        break;
      default:
        result.other[key] = value;
        break;
    }
  });

  return result;
};

/**
 * Generate string from metadata
 */
export const stringifyMetadata = (metadata: Metadata): string => {
  const deps = metadata.dependencies.map(dep => `dep: ${dep}\n`).join('');

  let content = '---\n';
  content += `updated_after: ${metadata.updatedAfter}\n`;
  content += `${deps}`;

  Object.keys(metadata.other).forEach((key, index) => {
    if (index === 0) content += '\n';
    content += `${key}: ${metadata.other[key]}\n`;
  });

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
