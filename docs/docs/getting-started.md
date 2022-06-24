---
updated_after: aae5d38beb118faa20c94daf1b5d8b838923926c
dep: [src/index.ts]

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
Add `dep` to generated metadata like this:
```diff
 ---
 updated_after: xxx
+dep: path-to-dependency-file
 ---
```
## Check that your documentation is up to date
`npx doccheck check pattern-to-match`