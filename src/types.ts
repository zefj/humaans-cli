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
