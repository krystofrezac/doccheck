import parseFile, { ParsedFile, ParseFileOptions } from './parseFile';

export interface FileCheckResult {
  filename: string;
  updateRequired: boolean;
  updatedDependencies: string[];
}

export const shouldFileBeUpdated = (
  filename: string,
  parsedFile: ParsedFile,
): FileCheckResult => {
  const fileLastUpdate = parsedFile.lastUpdate;
  if (!fileLastUpdate)
    return { filename, updateRequired: false, updatedDependencies: [] };

  const updatedDependencies = parsedFile.dependencies
    .filter(dep => dep.lastUpdate && dep.lastUpdate > fileLastUpdate)
    .map(dep => dep.file);

  return {
    filename,
    updateRequired: updatedDependencies.length !== 0,
    updatedDependencies,
  };
};

const checkFile = async (
  filename: string,
  options: ParseFileOptions,
): Promise<FileCheckResult> => {
  const parsedFile = await parseFile(filename, options);
  return shouldFileBeUpdated(filename, parsedFile);
};

export default checkFile;
