import {Args} from '@oclif/core'
import chalk from 'chalk'
import fetch from 'node-fetch'

import {TimesheetCommand} from '../../timesheet-command.js'
import {HumaansTimesheetEntry} from '../../types.js'

export default class ClockOut extends TimesheetCommand {
  static args = {
    time: Args.string({description: 'Time at which to clock out'}),
  }

  static description = 'Clock out'

  static examples = [
    {description: `Clock out now:`, command: `$ <%= config.bin %> <%= command.id %>`},
    {description: `Clock out at the given hour:`, command: `$ <%= config.bin %> <%= command.id %> 17:00`},
  ]

  public async run(): Promise<void> {
    const activeTimesheetEntry = await this.getActiveTimesheetEntry()

    if (!activeTimesheetEntry) {
      this.logError(`You're not clocked in.`)
      this.exit()
    }

    this.clockOut(activeTimesheetEntry)
  }

  private async clockOut(timesheetEntry: HumaansTimesheetEntry) {
    const {args} = await this.parse(ClockOut)

    const time = args.time ?? this.getCurrentTime()

    const body = {
      endTime: time,
    }

    const response = await fetch(`https://app.humaans.io/api/timesheet-entries/${timesheetEntry.id}`, {
      body: JSON.stringify(body),
      headers: {Authorization: `Bearer ${this.auth.token}`, 'Content-Type': 'application/json'},
      method: 'patch',
    })

    if (response.status !== 200) {
      this.logHumaansApiError(response)
      this.exit(1)
    }

    const data = (await response.json()) as HumaansTimesheetEntry
    const clockOutTime = this.dropSeconds(data.startTime)

    this.log(`⏱️  Clocked out at ${chalk.bold(clockOutTime)}.`)
  }
}
