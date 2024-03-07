import {TimesheetCommand} from '../../timesheet-command.js'

export default class Today extends TimesheetCommand {
  static description = 'Generate an hour report for today'

  public async run(): Promise<void> {
    const timesheetEntries = await this.getTimesheetEntriesForToday()

    const data = this.prepareDataForReporting(timesheetEntries)

    this.log(`You clocked ${data.sum} (${data.sumBase10}) hours today.`)
  }
}
