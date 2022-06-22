---
updated_after: aae5d38beb118faa20c94daf1b5d8b838923926c
dep: ../../package.json
dep: ../package.json

sidebar_position: 4
---

# For maintainers
# Project setup
Just clone git repository and run `npm install`. Make sure that you have the correct node and npm versions (they need to match versions in `engines` field of `package.json`)

# Publishing
1. Run `npm run release` and follow prompts.
2. Go to GitHub and create a release from a tag. All releases should be in format `vx.x.x` 

# Documentation
Documentation files are located at `docs/docs`. If you want to see live preview of docs go to `docs` folder and run `npm run start`.

## Running doccheck
Run `npm run build` in root folder and than you can run doccheck like this `node bin/index`