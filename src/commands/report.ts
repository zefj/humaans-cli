import {Args} from '@oclif/core'

import {TimesheetCommand} from '../timesheet-command.js'

const getStartDate = (start?: string) => {
  // TODO: would be nice to parse and check if valid date
  if (start) {
    return start
  }

  const date = new Date()
  date.setDate(16)
  date.setMonth(date.getMonth() - 1)

  return date.toISOString().slice(0, 10)
}

const getEndDate = (end?: string) => {
  // TODO: would be nice to parse and check if valid date
  if (end) {
    return end
  }

  const date = new Date()
  date.setDate(15)

  return date.toISOString().slice(0, 10)
}

export default class Report extends TimesheetCommand {
  static args = {
    start: Args.string({description: 'Start date'}),
    end: Args.string({description: 'End date'}),
  }

  static description = 'Generate an hour report'

  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> 2023-03-01 2023-03-31']

  public async run(): Promise<void> {
    const {args} = await this.parse(Report)

    const start = getStartDate(args.start)
    const end = getEndDate(args.end)

    const timesheetEntries = await this.getTimesheetEntriesForRange(start, end)

    const sum = this.sumTimesheetEntries(timesheetEntries)
    const sumHours = this.formatTimesheetEntriesSum(sum)
    const sumBase10 = this.formatTimesheetEntriesSumBase10(sum)

    this.log(`You clocked ${sumHours} hours (${sumBase10}) between ${start} and ${end}.`)

    this.logTimesheetTable(timesheetEntries)
  }
}
