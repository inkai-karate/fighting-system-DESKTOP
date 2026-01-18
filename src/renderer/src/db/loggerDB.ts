import type { ILogData } from '@interface/config.interface'
import Dexie, { type Table } from 'dexie'

export class LoggerDB extends Dexie {
  logs!: Table<ILogData>

  constructor() {
    super('tryoutLocalDB')

    this.version(1).stores({
      logs: '++id, type, action, created_at, [type+created_at]'
    })
  }
}

export const loggerDB = new LoggerDB()
