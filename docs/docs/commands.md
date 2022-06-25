---
updated_at: 2022-06-25T08:45:45.521Z
deps: []

dep: [src/index.ts]
sidebar_position: 3
---


# CLI commands
## `doccheck --help`
List all available commands with options.

## `doccheck check [file patterns..]`
Check all files that match the pattern. The pattern uses the Unix bash globbing syntax, for details of the syntax see [this](https://github.com/mrmlnc/fast-glob#pattern-syntax).

## `doccheck update [files..]`
Mark documentation files as up-to-date.
:::caution
Use this command only after you updated the documentation, or you decided that it's already up-to-date. If you do not follow these rules, this tool will become useless.
:::

## `doccheck create [file]`
Create new documentation file.

# Global options
- `--git-dir` 
  - Path to git versioned directory (parent of .git). All absolute paths will be resolved from here.
  - default: `.`