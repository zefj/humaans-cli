import {ux} from '@oclif/core'
import _ from 'lodash'
import fetch from 'node-fetch'

import {HumaansCommand} from './humaans-command.js'
import {
  HoursClockedBreakdown,
  HumaansListResponse,
  HumaansTimeAwayEntry,
  HumaansTimesheetEntry,
  TimeAwayBreakdown,
} from './types.js'

export abstract class TimesheetCommand extends HumaansCommand {
  protected getCurrentDate() {
    const date = new Date()
    return date.toISOString().slice(0, 10)
  }

  protected getCurrentTime() {
    return new Intl.DateTimeFormat('en-GB', {dateStyle: undefined, timeStyle: 'short'}).format()
  }

  protected async getActiveTimesheetEntry() {
    const timesheetEntries = await this.getTimesheetEntriesForToday()

    if (timesheetEntries.length > 0) {
      // Find the unended timesheet. We use `Array.find` because we're not sure
      // how Humaans API sorts the results.
      return timesheetEntries.find(({endTime}) => !endTime) || null
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

  protected prepareDataForReporting(
    timesheetEntries: HumaansTimesheetEntry[],
    timeAwayBreakdown: TimeAwayBreakdown[] = [],
  ) {
    const timeAwayBreakdownAsTimesheetEntries = timeAwayBreakdown.map((breakdown) => ({
      date: breakdown.date,
      duration: {
        hours: breakdown.period === 'full' ? 8 : 4,
        minutes: 0,
      },
    }))

    const timeAwayDates = new Set(timeAwayBreakdownAsTimesheetEntries.map(({date}) => date))
    const timesheetAndTimeAwayEntries = [...timesheetEntries, ...timeAwayBreakdownAsTimesheetEntries]

    const data: HoursClockedBreakdown[] = _.flow([
      (rows) => _.sortBy(rows, 'date'),
      (rows) => _.reverse(rows),
      (rows) => _.groupBy(rows, 'date'),
      (rows) => _.mapValues(rows, (entries) => this.sumTimesheetEntries(entries)),
      (rows) =>
        _.flatMap(rows, (value, key) => ({
          date: key,
          hours: value.hours,
          minutes: value.minutes,
          pto: timeAwayDates.has(key),
        })),
    ])(timesheetAndTimeAwayEntries)

    const breakdownSum = this.sumHoursClockedBreakdown(data)

    return {
      breakdown: data,
      sum: this.formatHoursMinutes(breakdownSum),
      sumBase10: this.formatHoursMinutesBase10(breakdownSum),
    }
  }

  private sumTimesheetEntries(timesheetEntries: HumaansTimesheetEntry[]) {
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

  private sumHoursClockedBreakdown(breakdown: HoursClockedBreakdown[]) {
    let hours = 0
    let minutes = 0

    for (const entry of breakdown) {
      hours += entry.hours
      minutes += entry.minutes
    }

    hours += Math.floor(minutes / 60)
    minutes %= 60

    return {hours, minutes}
  }

  public dropSeconds(time: string) {
    // I know this is a bit lazy but it should be enough.
    return time.slice(0, -3)
  }

  private formatHoursMinutes({hours, minutes}: {hours: number; minutes: number}) {
    return `${hours}:${minutes.toString().padStart(2, '0')}`
  }

  private formatHoursMinutesBase10({hours, minutes}: {hours: number; minutes: number}) {
    const minutesBase10 = (100 * minutes) / 60
    return new Intl.NumberFormat('en-GB', {maximumFractionDigits: 2}).format(hours + minutesBase10 / 100)
  }

  protected async getTimeAwayBreakdownForRange(start: string, end: string) {
    const timeAwayEntries = await this.getTimeAwayWithPaddingForRange(start, end)
    return this.rejectIrrelevantTimeAway(timeAwayEntries, start, end)
  }

  private async getTimeAwayWithPaddingForRange(start: string, end: string) {
    // We fetch 2 months back and forward because of how time away periods in
    // Humaans work. We want to avoid a situation where a time away period
    // starts or ends outside of the specified range and we miss it.
    const paddedStart = new Date(start)
    paddedStart.setMonth(paddedStart.getMonth() - 2)

    const paddedEnd = new Date(end)
    paddedEnd.setMonth(paddedEnd.getMonth() + 2)

    const timeaway = await this.getTimeAway({
      'startDate[$gte]': paddedStart.toISOString().slice(0, 10),
      'endDate[$lte]': paddedEnd.toISOString().slice(0, 10),
    })

    return timeaway
  }

  private async getTimeAway(params: object) {
    const queryParams = new URLSearchParams({
      personId: this.auth.personId,
      ...params,
    })

    const response = await fetch(`https://app.humaans.io/api/time-away?${queryParams}`, {
      headers: {Authorization: `Bearer ${this.auth.token}`, 'Content-Type': 'application/json'},
      method: 'get',
    })

    if (response.status !== 200) {
      this.logHumaansApiError(response)
      this.exit(1)
    }

    const {data} = (await response.json()) as HumaansListResponse<HumaansTimeAwayEntry>

    return data
  }

  private rejectIrrelevantTimeAway(
    timeAwayEntries: HumaansTimeAwayEntry[],
    start: string,
    end: string,
  ): TimeAwayBreakdown[] {
    const timeAway = _.flow([
      (rows) => _.reject(rows, (row) => row.type !== 'pto' || row.days === 0 || row.requestStatus === 'rejected'),
      (rows) => _.flatMap(rows, (row) => row.breakdown),
      (rows) => _.reject(rows, (row) => row.weekend || row.holiday),
      (rows) => _.filter(rows, (row) => row.date >= start && row.date <= end),
    ])(timeAwayEntries)

    return timeAway
  }

  protected logHoursClockedBreakdownTable(breakdown: HoursClockedBreakdown[]) {
    ux.table(breakdown, {
      date: {},
      hours: {
        get: (row) => `${this.formatHoursMinutes(row as {hours: number; minutes: number})} ${row.pto ? '🌴' : ''}`,
      },
    })
  }
}
