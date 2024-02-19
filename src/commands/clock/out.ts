import {Args, Command} from '@oclif/core'

export default class ClockOut extends Command {
  static args = {
    time: Args.string({description: 'Time at which to clock out'}),
  }

  static description = 'Clock out'

  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> 17:00']

  public async run(): Promise<void> {
    const {args} = await this.parse(ClockOut)

    const time = args.time ?? new Intl.DateTimeFormat('en-GB', {dateStyle: undefined, timeStyle: 'short'}).format()

    this.log(`Clocking out at ${time}`)
  }
}
