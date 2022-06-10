/* eslint-disable no-console */
import { dim, green, red, underline, yellow } from 'colorette';
import fastGlob from 'fast-glob';
import yargs from 'yargs/yargs';

import checkFile from './commands/check';
import { ParseFileOptions } from './commands/check/types';
import createDocumentation from './commands/create';
import { CreateDocumentationOptions } from './commands/create/types';
import updateFile from './commands/update';
import { UpdateFileOptions } from './commands/update/types';

const globFiles = (files: string[], basePath?: string): Promise<string[]> =>
  fastGlob(files, { cwd: basePath });

const checkFiles = async (
  filePatterns: string[],
  options: ParseFileOptions,
): Promise<void> => {
  const files = await globFiles(filePatterns, options.gitDir);
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

  .option('git-dir', {
    type: 'string',
    description: 'Path to git versioned directory (parent of .git)',
  })

  .command(
    'check [filePatterns..]',
    'Check if documentation files are up to date',
    y =>
      y.positional('filePatterns', {
        type: 'string',
        array: true,
        description: 'File patterns to check',
      }),
    argv => {
      if (!argv.filePatterns) return;
      checkFiles(argv.filePatterns, { gitDir: argv.gitDir });
    },
  )
  .command(
    'update [files..]',
    'Update documentation files',
    y =>
      y.positional('files', {
        type: 'string',
        array: true,
        description: 'Path to files to update',
      }),
    argv => {
      if (!argv.files) return;
      updateFiles(argv.files, { gitDir: argv.gitDir });
    },
  )
  .command(
    'create [file]',
    'Create documentation file',
    y =>
      y.positional('file', {
        type: 'string',
        description: 'File path',
      }),
    argv => {
      if (!argv.file) return;
      createDocumentationCommand(argv.file, { gitDir: argv.gitDir });
    },
  )
  .demandCommand()
  .help().argv;
