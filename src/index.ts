/* eslint-disable no-console */
import { dim, green, red, underline, yellow } from 'colorette';
import yargs from 'yargs/yargs';

import { ParseFileOptions } from 'commands/check/types';
import { CreateDocumentationOptions } from 'commands/create/types';
import { UpdateFileOptions } from 'commands/update/types';

import checkFile from './commands/check';
import createDocumentation from './commands/create';
import updateFile from './commands/update';

const checkFiles = async (
  files: string[],
  options: ParseFileOptions,
): Promise<void> => {
  const result = await Promise.all(files.map(file => checkFile(file, options)));

  const updateRequiredFiles = result.filter(file => file.updateRequired);
  if (updateRequiredFiles.length !== 0)
    console.log(
      red(
        'Documentation is not up to date. Check these files if they do not need to be updated!',
      ),
    );
  else console.log(green('Documentation is up to date.'));

  updateRequiredFiles.forEach(file => {
    console.log(
      yellow(underline(file.filename)),
      dim('- These dependencies were updated:'),
    );
    file.updatedDependencies.forEach(dep => console.log('  -', dep));
  });
};

const updateFiles = async (
  files: string[],
  options: UpdateFileOptions,
): Promise<void> => {
  await Promise.resolve(files.map(fileName => updateFile(fileName, options)));

  console.log(green('Documentation files updated successfully.'));
};

const createDocumentationCommand = async (
  fileName: string,
  options: CreateDocumentationOptions,
): Promise<void> => {
  await createDocumentation(fileName, options);
  console.log(green('Documentation file was created successfully.'));
};

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(process.argv.slice(2))
  .scriptName('doccheck')
  .usage('$0 <cmd> [args]')
  .command(
    'check [files..]',
    'Check if documentation files are up to date',
    () => {},
    argv => {
      if (!Array.isArray(argv.files)) return;
      // TODO: options
      checkFiles(argv.files, {});
    },
  )
  .command(
    'update [files..]',
    'Update documentation files',
    () => {},
    argv => {
      if (!Array.isArray(argv.files)) return;
      // TODO: options
      updateFiles(argv.files, {});
    },
  )
  .command(
    'create [file]',
    'Create documentation file',
    () => {},
    argv => {
      if (typeof argv.file === 'string')
        // TODO: options
        createDocumentationCommand(argv.file, {});
    },
  )
  .demandCommand()
  .help().argv;
