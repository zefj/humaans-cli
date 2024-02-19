import {expect, test} from '@oclif/test'

describe('report', () => {
  test
    .stdout()
    .command(['report'])
    .it('generates report for default period', (ctx) => {
      const startDate = new Date()
      startDate.setDate(16)
      startDate.setMonth(startDate.getMonth() - 1)
      const start = startDate.toISOString().slice(0, 10)

      const endDate = new Date()
      endDate.setDate(15)
      const end = endDate.toISOString().slice(0, 10)

      expect(ctx.stdout).to.contain(`Getting hour report for period ${start} - ${end}`)
    })

  test
    .stdout()
    .command(['report', '2023-03-01', '2023-03-31'])
    .it('generates report for given period', (ctx) => {
      expect(ctx.stdout).to.contain('Getting hour report for period 2023-03-01 - 2023-03-31')
    })
})
