import {Command, ux} from '@oclif/core'
import chalk from 'chalk'
import fs from 'fs-extra'
import * as path from 'node:path'
import fetch from 'node-fetch'

import {Config, HumaansMeResponse} from '../types.js'

export default class Login extends Command {
  static description = 'Login to Humaans.'

  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    this.log(`To use the CLI, you need to provide an ${chalk.bold('API access token:')}`)
    this.log()
    this.log(`1. Log in to ${chalk.bold('https://app.humaans.io/')}`)
    this.log(
      `2. Click on the dropdown next to your profile picture and go to ${chalk.bold(
        'API access tokens',
      )} > ${chalk.bold('Generate new token')}`,
    )
    this.log(
      `3. Give your token a label and the following scopes: ${chalk.bold('`private:read`')}, ${chalk.bold(
        '`private:write`',
      )}`,
    )
    this.log(`4. Click on ${chalk.bold('Generate token')}, then insert the token below`)
    this.log()

    const token = await ux.prompt(chalk.bold('What is your API token?'), {type: 'hide'})

    const response = await fetch('https://app.humaans.io/api/me', {
      headers: {Authorization: `Bearer ${token}`},
      method: 'get',
    })

    if (response.status === 200) {
      const data = (await response.json()) as HumaansMeResponse

      const config: Config = {
        personId: data.id,
        token,
      }

      await fs.ensureFile(path.join(this.config.configDir, 'config.json'))
      await fs.writeJson(path.join(this.config.configDir, 'config.json'), config)

      this.log('Access token saved 🎉')
      return
    }

    this.log('Could not access the Humaans API, please make sure that the token is correct.')
    const data = await response.json()
    this.log(JSON.stringify(data) as string)
  }
}
