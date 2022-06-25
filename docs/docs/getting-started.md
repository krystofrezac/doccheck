---
updated_at: 2022-06-25T09:17:09.824Z
deps: [src/index.ts]

sidebar_position: 2
---

# Getting started
:::caution
Doccheck heavily relies on `git` and assumes that you use it to version your project.
:::

## Installation
`npm install --save-dev doccheck`

## Create documentation file
`npx doccheck create name-of-file`
:::info
If you already have a documentation file and want to add it to docheck run `npx doccheck update path-to-file`.
:::

## Add dependencies
Add `deps` to generated metadata like this:
```diff
 ---
 updated_after: xxx
+deps: [path-to-dependency-file1, path-to-dependency-file2]
 ---
```
## Check that your documentation is up to date
`npx doccheck check pattern-to-match`