import {Command} from '@oclif/core'
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
      this.log("Couldn't find a token, run `humaans login` before using this command.")
      this.exit(1)
    }
  }

  protected async logHumaansApiError(response: Response) {
    this.log('Humaans API returned an unexpected error.')
    const data = await response.json()
    this.log(JSON.stringify(data) as string)
  }
}
