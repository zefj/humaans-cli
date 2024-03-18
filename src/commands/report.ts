import {Args} from '@oclif/core'
import chalk from 'chalk'

import {TimesheetCommand} from '../timesheet-command.js'

const getStartDate = (start?: string) => {
  // TODO: would be nice to parse and check if valid date
  if (start) {
    return start
  }

  const date = new Date()
  date.setDate(1)

  return date.toISOString().slice(0, 10)
}

const getEndDate = (end?: string) => {
  // TODO: would be nice to parse and check if valid date
  if (end) {
    return end
  }

  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  date.setDate(0)

  return date.toISOString().slice(0, 10)
}

export default class Report extends TimesheetCommand {
  static args = {
    start: Args.string({description: 'Start date'}),
    end: Args.string({description: 'End date'}),
  }

  static description = 'Generate an hour report.'
  static examples = [
    {
      description: `Calculate report from the first day to the last day of the current month:`,
      command: `$ <%= config.bin %> <%= command.id %>`,
    },
    {
      description: `Calculate report for today:`,
      command: `$ <%= config.bin %> <%= command.id %> today`,
    },
    {
      description: `Calculate report from the given day to the last day of the current month:`,
      command: `$ <%= config.bin %> <%= command.id %> 2023-03-01`,
    },
    {
      description: `Calculate report for the given period:`,
      command: `$ <%= config.bin %> <%= command.id %> 2023-03-10 2023-04-10`,
    },
  ]

  public async run(): Promise<void> {
    const {args} = await this.parse(Report)

    if (args.start === 'today') {
      return this.runForToday()
    }

    return this.runForPeriod()
  }

  public async runForPeriod(): Promise<void> {
    const {args} = await this.parse(Report)

    const start = getStartDate(args.start)
    const end = getEndDate(args.end)

    const timesheetEntries = await this.getTimesheetEntriesForRange(start, end)
    const timeAwayBreakdown = await this.getTimeAwayBreakdownForRange(start, end)

    const data = this.prepareDataForReporting(timesheetEntries, timeAwayBreakdown)

    this.log(
      `🗓️  You clocked ${chalk.bold(data.sum)} hours (${data.sumBase10}) between ${chalk.bold(start)} and ${chalk.bold(
        end,
      )}.`,
    )

    if (data.breakdown.length > 0) {
      this.log()
      this.logHoursClockedBreakdownTable(data.breakdown)
    }
  }

  public async runForToday(): Promise<void> {
    const timesheetEntries = await this.getTimesheetEntriesForToday()

    const data = this.prepareDataForReporting(timesheetEntries)

    this.log(`🗓️  You clocked ${chalk.bold(data.sum)} hours (${data.sumBase10}) ${chalk.bold('today')}.`)
  }
}
