import {expect, test} from '@oclif/test'

describe('clock:out', () => {
  test
    .stdout()
    .command(['clock:out'])
    .it('clocks out at current time', (ctx) => {
      const time = new Intl.DateTimeFormat('en-GB', {dateStyle: undefined, timeStyle: 'short'}).format()
      expect(ctx.stdout).to.contain(`Clocking out at ${time}`)
    })

  test
    .stdout()
    .command(['clock:out', '9:00'])
    .it('clocks out at given time', (ctx) => {
      expect(ctx.stdout).to.contain(`Clocking out at 9:00`)
    })
})
