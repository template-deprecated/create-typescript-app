# create-node-cli-app
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
3. learn more `create-node-cli-app --help`

#### Option B

Install by `yarn` or `npm`

- Yarn
  1. run `yarn create node-cli-app <app-name> [option...]`
  2. learn more by `yarn create node-cli-app --help`
- Npm
  1. run `npm init node-cli-app <app-name> [option...]` or `npx create-node-cli-app <app-name> [option...]`
  2. learn more by `npm init node-cli-app --help` or `npx create-node-cli-app --help`

## Usage

```bash
create-node-cli-app <app-name...>

Create node cli app with typescript, yargs, tracer (as logger),
prompts, listr (as progressing), chalk (as colorize),
typedoc (as doc generator), jest (as testing tools).

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

This generate command contain only 1 javasccript file which is [index.js](index.js).
This use only `yargs` to create cli, `prompts` to make prompts command, 
`listr` to output result as progress text, `mustache` to create file templates and `pkg` to build binary file (which shouldn't be use).

You will have only 3 command possible with `yarn` or `npm`

1. **start**: which run `node index.js`
2. **build**: which build execuable file in bin folder (separate by os).
3. **deploy**: which basically call `npm publish`
