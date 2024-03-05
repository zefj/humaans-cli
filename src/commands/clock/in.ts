import {Args} from '@oclif/core'
import fetch from 'node-fetch'

import {TimesheetCommand} from '../../timesheet-command.js'
import {HumaansTimesheetEntry} from '../../types.js'

export default class ClockIn extends TimesheetCommand {
  static args = {
    time: Args.string({description: 'Time at which to clock in'}),
  }

  static description = 'Clock in'

  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> 9:00']

  public async run(): Promise<void> {
    const lastTimesheetEntry = await this.getLastTimesheetEntry()

    if (lastTimesheetEntry && !lastTimesheetEntry.endTime) {
      this.log(`You're already clocked in (since ${lastTimesheetEntry.startTime}).`)
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

    this.log(`Clocked in at ${data.startTime} ✅`)
  }
}
