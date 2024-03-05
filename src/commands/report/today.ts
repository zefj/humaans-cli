import {TimesheetCommand} from '../../timesheet-command.js'

export default class Today extends TimesheetCommand {
  static description = 'Generate an hour report for today'

  public async run(): Promise<void> {
    const start = this.getCurrentDate()
    const end = this.getCurrentDate()

    this.log(`Getting hour report for period ${start} - ${end}`)

    const timesheetEntries = await this.getTimesheetEntriesForToday()

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
        const startTime = new Date(`${start} ${timesheetEntry.startTime}`)
        const endTime = new Date()
        const difference = endTime.getTime() - startTime.getTime()
        const minutesElapsed = Math.round(difference / 60_000)

        minutes += minutesElapsed
      }
    }

    hours += Math.floor(minutes / 60)
    minutes %= 60

    this.log(`You clocked ${hours}:${minutes.toString().padStart(2, '0')} hours today.`)
  }
}
