import {Command} from '@oclif/core'
import chalk from 'chalk'
import fs from 'fs-extra'
import * as path from 'node:path'
import {Response} from 'node-fetch'

import {Config} from './types.js'

export abstract class HumaansCommand extends Command {
  protected auth!: Config

  public async init(): Promise<void> {
    this.auth = await this.getAuthConfig()

    await super.init()
  }

  private async getAuthConfig() {
    try {
      return (await fs.readJson(path.join(this.config.configDir, 'config.json'))) as Config
    } catch {
      this.logError("Couldn't find a token, run `humaans login` before using this command.")
      this.exit(1)
    }
  }

  protected async logHumaansApiError(response: Response) {
    this.logError('Humaans API returned an unexpected error.')
    const data = await response.json()
    this.log(JSON.stringify(data) as string)
  }

  // TODO: if we ever get another command that doesn't fit this class, extend
  // the inheritance chain and move this over.
  public logError(text: string) {
    this.log(`${chalk.red('Error:')} ${text}`)
  }
}
