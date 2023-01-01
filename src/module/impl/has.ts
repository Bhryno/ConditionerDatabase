import { Database } from "better-sqlite3"
import { getSafe, ModuleParameters } from "../moduleFactory"

export default function Has(database: Database, parameters: ModuleParameters, table: string) : boolean {
    let currentValue = database.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(parameters.id)

    if (currentValue === undefined) {
        return false
    }

    currentValue = JSON.parse(currentValue.json)

    if (parameters.options.target && parameters.options.subKeys !== false) {
        currentValue = getSafe(currentValue, parameters.options.target)
    }

    return currentValue !== undefined
}