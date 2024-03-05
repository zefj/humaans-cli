# oclif-hello-world

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [oclif-hello-world](#oclif-hello-world)
* [Usage](#usage)
* [Development](#development)
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

# Development
```sh-session
$ yarn install
$ yarn prepack
$ ./bin/dev.js help 
```

Run `yarn prepack` every time you make changes.

# Commands

<!-- commands -->
* [`humaans clock in [TIME]`](#humaans-clock-in-time)
* [`humaans clock out [TIME]`](#humaans-clock-out-time)
* [`humaans help [COMMANDS]`](#humaans-help-commands)
* [`humaans login`](#humaans-login)
* [`humaans report [START] [END]`](#humaans-report-start-end)

## `humaans clock in [TIME]`

Clock in

```
USAGE
  $ humaans clock in [TIME]

ARGUMENTS
  TIME  Time at which to clock in

DESCRIPTION
  Clock in

EXAMPLES
  $ humaans clock in

  $ humaans clock in 9:00
```

_See code: [src/commands/clock/in.ts](https://github.com/andreicek/humaans-cli/blob/v0.0.0/src/commands/clock/in.ts)_

## `humaans clock out [TIME]`

Clock out

```
USAGE
  $ humaans clock out [TIME]

ARGUMENTS
  TIME  Time at which to clock out

DESCRIPTION
  Clock out

EXAMPLES
  $ humaans clock out

  $ humaans clock out 17:00
```

_See code: [src/commands/clock/out.ts](https://github.com/andreicek/humaans-cli/blob/v0.0.0/src/commands/clock/out.ts)_

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

## `humaans login`

Login to Humaans

```
USAGE
  $ humaans login

DESCRIPTION
  Login to Humaans

EXAMPLES
  $ humaans login
```

_See code: [src/commands/login.ts](https://github.com/andreicek/humaans-cli/blob/v0.0.0/src/commands/login.ts)_

## `humaans report [START] [END]`

Generate an hour report

```
USAGE
  $ humaans report [START] [END]

ARGUMENTS
  START  Start date
  END    End date

DESCRIPTION
  Generate an hour report

EXAMPLES
  $ humaans report

  $ humaans report 2023-03-01 2023-03-31
```

_See code: [src/commands/report.ts](https://github.com/andreicek/humaans-cli/blob/v0.0.0/src/commands/report.ts)_
<!-- commandsstop -->
