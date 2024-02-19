import {Args, Command} from '@oclif/core'

export default class ClockIn extends Command {
  static args = {
    time: Args.string({description: 'Time at which to clock in'}),
  }

  static description = 'Clock in'

  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> 9:00']

  public async run(): Promise<void> {
    const {args} = await this.parse(ClockIn)

    const time = args.time ?? new Intl.DateTimeFormat('en-GB', {dateStyle: undefined, timeStyle: 'short'}).format()

    this.log(`Clocking in at ${time}`)
  }
}
