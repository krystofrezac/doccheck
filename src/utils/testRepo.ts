import fs from 'fs';
import { dirname, join } from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

export const TEST_REPO_FOLDER = join(
  dirname(require.main?.filename || ''),
  'testRepo',
);

export const createRepo = (): SimpleGit => {
  fs.mkdirSync(TEST_REPO_FOLDER);

  return simpleGit()
    .init([TEST_REPO_FOLDER])
    .cwd({ path: TEST_REPO_FOLDER, root: true });
};
export const deleteRepo = (): void => {
  fs.rmSync(TEST_REPO_FOLDER, { recursive: true, force: true });
};

export const createDocumentationFile = (
  name: string,
  metadata: { updatedAfter: string; deps: string[] },
): string => {
  const deps = metadata.deps.map(dep => `dep: ${dep}`).join('\n');

  let content = '---\n';
  content += `updatedAfter: ${metadata.updatedAfter}\n`;
  content += `${deps}\n`;
  content += '---';

  fs.writeFileSync(`${TEST_REPO_FOLDER}/${name}`, content, 'utf-8');
  return name;
};
export const createFile = (name: string): string => {
  fs.writeFileSync(`${TEST_REPO_FOLDER}/${name}`, '', 'utf-8');
  return name;
};
