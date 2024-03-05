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
    return this.getTimesheetEntries({
      date: this.getCurrentDate(),
    })
  }

  protected async getTimesheetEntriesForRange(start: string, end: string) {
    return this.getTimesheetEntries({
      'date[$gte]': start,
      'date[$lte]': end,
    })
  }

  private async getTimesheetEntries(params: object) {
    const queryParams = new URLSearchParams({
      personId: this.auth.personId,
      ...params,
    })

    const response = await fetch(`https://app.humaans.io/api/timesheet-entries?${queryParams}`, {
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

  protected sumTimesheetEntries(timesheetEntries: HumaansTimesheetEntry[]) {
    let hours = 0
    let minutes = 0

    for (const timesheetEntry of timesheetEntries) {
      if (timesheetEntry.duration) {
        if (timesheetEntry.duration.hours) {
          hours += timesheetEntry.duration.hours
        }

        if (timesheetEntry.duration.minutes) {
          minutes += timesheetEntry.duration.minutes
        }
      } else {
        // Calculate elapsed time for an unended timesheet
        const startTime = new Date(`${this.getCurrentDate()} ${timesheetEntry.startTime}`)
        const endTime = new Date()
        const difference = endTime.getTime() - startTime.getTime()
        const minutesElapsed = Math.round(difference / 60_000)

        minutes += minutesElapsed
      }
    }

    hours += Math.floor(minutes / 60)
    minutes %= 60

    return {hours, minutes}
  }

  protected formatTimesheetEntriesSum({hours, minutes}: {hours: number; minutes: number}) {
    return `${hours}:${minutes.toString().padStart(2, '0')}`
  }

  protected formatTimesheetEntriesSumBase10({hours, minutes}: {hours: number; minutes: number}) {
    const minutesBase10 = (100 * minutes) / 60
    return new Intl.NumberFormat('en-GB', {maximumFractionDigits: 2}).format(hours + minutesBase10 / 100)
  }
}
