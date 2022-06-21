---
updated_after: 57dbce66193a85543a8b6cb765f0bae5b599e4d9
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