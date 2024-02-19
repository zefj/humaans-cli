oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g humaans-cli
$ humaans COMMAND
running command...
$ humaans (--version)
humaans-cli/0.0.0 darwin-arm64 node-v20.10.0
$ humaans --help [COMMAND]
USAGE
  $ humaans COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`humaans hello PERSON`](#humaans-hello-person)
* [`humaans hello world`](#humaans-hello-world)
* [`humaans help [COMMANDS]`](#humaans-help-commands)

## `humaans hello PERSON`

Say hello

```
USAGE
  $ humaans hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/andreicek/humaans-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `humaans hello world`

Say hello world

```
USAGE
  $ humaans hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ humaans hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/andreicek/humaans-cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `humaans help [COMMANDS]`

Display help for humaans.

```
USAGE
  $ humaans help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for humaans.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.12/src/commands/help.ts)_
<!-- commandsstop -->
