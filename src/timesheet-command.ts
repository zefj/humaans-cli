import fetch from 'node-fetch'

import {HumaansCommand} from './humaans-command.js'
import {HumaansListResponse, HumaansTimesheetEntry} from './types.js'

export abstract class TimesheetCommand extends HumaansCommand {
  protected getCurrentDate() {
    const date = new Date()
    return date.toISOString().slice(0, 10)
  }

  protected getCurrentTime() {
    return new Intl.DateTimeFormat('en-GB', {dateStyle: undefined, timeStyle: 'short'}).format()
  }

  protected async getLastTimesheetEntry() {
    const timesheetEntries = await this.getTimesheetEntriesForToday()

    if (timesheetEntries.length > 0) {
      return timesheetEntries[0]
    }

    return null
  }

  protected async getTimesheetEntriesForToday() {
    const params = new URLSearchParams({
      personId: this.auth.personId,
      date: this.getCurrentDate(),
    })

    const response = await fetch(`https://app.humaans.io/api/timesheet-entries?${params}`, {
      headers: {Authorization: `Bearer ${this.auth.token}`, 'Content-Type': 'application/json'},
      method: 'get',
    })

    if (response.status !== 200) {
      this.logHumaansApiError(response)
      this.exit(1)
    }

    const {data} = (await response.json()) as HumaansListResponse<HumaansTimesheetEntry>

    return data
  }
}
