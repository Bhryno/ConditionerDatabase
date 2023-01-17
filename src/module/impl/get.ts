import { Database } from 'better-sqlite3'
import { createTrue } from 'typescript'
import { getSafe, ModuleParameters } from '../moduleFactory'

export default function Get(
    database: Database,
    parameters: ModuleParameters,
    table: string
): any | null {
    let currentValue = database
        .prepare(`SELECT * FROM ${table} WHERE ID = (?)`)
        .get(parameters.id)

    if (currentValue === undefined) {
        return null
    }

    currentValue = JSON.parse(currentValue.json)

    if (parameters.options.target && parameters.options.subKeys !== false) {
        currentValue = getSafe(currentValue, parameters.options.target)
    }

    return currentValue
}
