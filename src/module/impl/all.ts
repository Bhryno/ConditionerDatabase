import { Database } from 'better-sqlite3'
import { ModuleParameters } from '../moduleFactory'

export default function All(
    database: Database,
    parameters: ModuleParameters,
    table: string
): { ID: any; data: any }[] {
    let currentValues = [
        ...database.prepare(`SELECT * FROM ${table}`).iterate()
    ]

    return currentValues.map(r => ({
        ID: r.ID,
        data: JSON.parse(r.json)
    }))
}
