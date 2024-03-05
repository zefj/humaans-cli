import {TimesheetCommand} from '../../timesheet-command.js'

export default class Today extends TimesheetCommand {
  static description = 'Generate an hour report for today'

  public async run(): Promise<void> {
    const timesheetEntries = await this.getTimesheetEntriesForToday()

    const sum = this.sumTimesheetEntries(timesheetEntries)
    const sumHours = this.formatTimesheetEntriesSum(sum)
    const sumBase10 = this.formatTimesheetEntriesSumBase10(sum)

    this.log(`You clocked ${sumHours} (${sumBase10}) hours today.`)
  }
}
