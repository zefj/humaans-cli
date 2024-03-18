import {Args} from '@oclif/core'
import chalk from 'chalk'
import fetch from 'node-fetch'

import {TimesheetCommand} from '../../timesheet-command.js'
import {HumaansTimesheetEntry} from '../../types.js'

export default class ClockIn extends TimesheetCommand {
  static args = {
    time: Args.string({description: 'Time at which to clock in'}),
  }

  static description = 'Clock in'

  static examples = [
    {description: `Clock in now:`, command: `$ <%= config.bin %> <%= command.id %>`},
    {description: `Clock in at the given hour:`, command: `$ <%= config.bin %> <%= command.id %> 9:00`},
  ]

  public async run(): Promise<void> {
    const activeTimesheetEntry = await this.getActiveTimesheetEntry()

    if (activeTimesheetEntry) {
      this.logError(`You're already clocked in (since ${activeTimesheetEntry.startTime}).`)
      this.exit()
    }

    await this.clockIn()
  }

  private async clockIn() {
    const {args} = await this.parse(ClockIn)

    const time = args.time ?? this.getCurrentTime()

    const body = {
      personId: this.auth.personId,
      date: this.getCurrentDate(),
      startTime: time,
    }

    const response = await fetch('https://app.humaans.io/api/timesheet-entries', {
      body: JSON.stringify(body),
      headers: {Authorization: `Bearer ${this.auth.token}`, 'Content-Type': 'application/json'},
      method: 'post',
    })

    if (response.status !== 201) {
      this.logHumaansApiError(response)
      this.exit(1)
    }

    const data = (await response.json()) as HumaansTimesheetEntry
    const clockInTime = this.dropSeconds(data.startTime)

    this.log(`⏱️  Clocked in at ${chalk.bold(clockInTime)}.`)
  }
}
