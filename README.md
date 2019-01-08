# create-typescript-template-app

Create node cli application.

## Table of content

1. [Installation](#installation)
2. [Usage](#usage)
3. [Development](#development)

## Installation

#### Option A

You can install by using [bin script](bin).

1. Download file that match you os and cpu in [bin](bin)
2. make it execuable by `chmod +x <path/to/file>`
3. learn more `create-typescript-template-app --help`

#### Option B

Install by `yarn` or `npm`

- Yarn
  1. run `yarn create typescript-app <app-name> [option...]`
  2. learn more by `yarn create typescript-app --help`
- Npm
  1. run `npm init typescript-app <app-name> [option...]` or `npx create-typescript-template-app <app-name> [option...]`
  2. learn more by `npm init typescript-app --help` or `npx create-typescript-template-app --help`

## Usage

```bash
create-typescript-template-app <app-name...>

Create typescript application.

Positionals:
  app-name  Application name, can be capital, and space name            [string]

Options:
  --help           Show help                                           [boolean]
  --version        Show version number                                 [boolean]
  --to-dir, -P     Instead of create in current folder, use this.       [string]
  --space-replace  this replacement will replace spaces           [default: "-"]
  --current, -C    Create application to current folder                 [string]
```

## Development

This generate command contain only 1 javasccript file which is [index.js](index.js). This use only `yargs` to create cli, `prompts` to make prompts command, `listr` to output result as progress text, `mustache` to create file templates and `pkg` to build binary file (which shouldn't be use).

You will have only 3 command possible with `yarn` or `npm`

1. **start**: which run `node index.js`
2. **build**: which build execuable file in bin folder (separate by os).
3. **deploy**: which basically call `npm run publish`, you might got error when use by `yarn`
