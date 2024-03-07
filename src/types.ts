export type Config = {
  personId: string
  token: string
}

export type HumaansListResponse<T> = {
  total: number
  limit: number
  skip: number
  data: T[]
}

/**
 * https://docs.humaans.io/api/#me
 * The response obviously contains much more data, but we only care about `id`
 */
export type HumaansMeResponse = {
  id: string
}

/**
 * https://docs.humaans.io/api/#timesheet-entry-object
 */
export type HumaansTimesheetEntry = {
  id: string
  personId: string
  date: string
  startTime: string
  endTime: string | null
  duration: {
    hours: number
    minutes: number
  } | null
  createdAt: string
  updatedAt: string
}

/**
 * https://docs.humaans.io/api/#time-away-object
 */
export type HumaansTimeAwayEntry = {
  id: string
  personId: string
  startDate: string
  startPeriod: 'full' | 'am' | 'pm'
  endDate: string
  endPeriod: 'full' | 'am' | 'pm'
  timeAwayTypeId: string
  name: string
  isTimeOff: true
  workingFromLocationId: null
  note: string
  breakdown: TimeAwayBreakdown[]
  days: number
  requestStatus: 'approved' | 'declined'
  reviewedBy: string
  reviewedAt: string
  reviewNote: string
  publicHolidayCalendarId: string
  workingDays: {day: string}[]
  createdAt: string
  updatedAt: string
}

export type TimeAwayBreakdown = {
  date: string
  period: 'full' | 'am' | 'pm'
  weekend?: boolean
  holiday?: boolean
}

export type HoursClockedBreakdown = {
  date: string
  hours: number
  minutes: number
  pto: boolean
}
