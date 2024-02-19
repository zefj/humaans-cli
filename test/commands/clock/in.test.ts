import {expect, test} from '@oclif/test'

describe('clock:in', () => {
  test
    .stdout()
    .command(['clock:in'])
    .it('clocks in at current time', (ctx) => {
      const time = new Intl.DateTimeFormat('en-GB', {dateStyle: undefined, timeStyle: 'short'}).format()
      expect(ctx.stdout).to.contain(`Clocking in at ${time}`)
    })

  test
    .stdout()
    .command(['clock:in', '9:00'])
    .it('clocks in at given time', (ctx) => {
      expect(ctx.stdout).to.contain(`Clocking in at 9:00`)
    })
})
