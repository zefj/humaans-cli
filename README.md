# humaans-cli

A simple CLI for [humaans.io](https://humaans.io), put together to provide easier access to time tracking features and reporting right from the command line.

Not affiliated with Humaans. Built for internal needs.

<!-- toc -->
* [humaans-cli](#humaans-cli)
* [Why](#why)
* [Usage](#usage)
* [Development](#development)
* [Commands](#commands)
<!-- tocstop -->

# Why

Humaans is missing a few crucial features:

- No desktop app, lackluster Slack app
- No easy access to total time clocked today
- No sum of hours clocked in a period


# Usage

<!-- usage -->
```sh-session
$ npm install -g humaans-cli
$ humaans COMMAND
running command...
$ humaans (--version)
humaans-cli/0.1.2 darwin-arm64 node-v20.10.0
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
  Clock in now:

    $ humaans clock in

  Clock in at the given hour:

    $ humaans clock in 9:00
```

_See code: [src/commands/clock/in.ts](https://github.com/zefj/humaans-cli/blob/v0.1.2/src/commands/clock/in.ts)_

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
  Clock out now:

    $ humaans clock out

  Clock out at the given hour:

    $ humaans clock out 17:00
```

_See code: [src/commands/clock/out.ts](https://github.com/zefj/humaans-cli/blob/v0.1.2/src/commands/clock/out.ts)_

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

Login to Humaans.

```
USAGE
  $ humaans login

DESCRIPTION
  Login to Humaans.

EXAMPLES
  $ humaans login
```

_See code: [src/commands/login.ts](https://github.com/zefj/humaans-cli/blob/v0.1.2/src/commands/login.ts)_

## `humaans report [START] [END]`

Generate an hour report.

```
USAGE
  $ humaans report [START] [END]

ARGUMENTS
  START  Start date
  END    End date

DESCRIPTION
  Generate an hour report.

EXAMPLES
  Calculate report from the first day to the last day of the current month:

    $ humaans report

  Calculate report for today:

    $ humaans report today

  Calculate report from the given day to the last day of the current month:

    $ humaans report 2023-03-01

  Calculate report for the given period:

    $ humaans report 2023-03-10 2023-04-10
```

_See code: [src/commands/report.ts](https://github.com/zefj/humaans-cli/blob/v0.1.2/src/commands/report.ts)_
<!-- commandsstop -->
