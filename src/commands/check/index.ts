import parseFile from './parseFile';
import { ParsedFile, ParseFileOptions, CheckFileResult } from './types';

export const shouldFileBeUpdated = (
  filename: string,
  parsedFile: ParsedFile,
): CheckFileResult => {
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
): Promise<CheckFileResult> => {
  const parsedFile = await parseFile(filename, options);
  return shouldFileBeUpdated(filename, parsedFile);
};

export default checkFile;
