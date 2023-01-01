import { Database } from "better-sqlite3"
import { deleteSafe, ModuleParameters } from "../moduleFactory"

export default function Delete(database: Database, parameters: ModuleParameters, table: string): boolean {
    let currentValue = database.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(parameters.id)

    if (currentValue === undefined) {
        return false
    }

    currentValue = JSON.parse(currentValue.json)

    if (parameters.options.target && parameters.options.subKeys !== false) {
        if (typeof currentValue !== "object") {
            throw new TypeError(`Cannot use subKeys on a non-object instance -> ${currentValue}. [${table}/${parameters.id}]`)
        }

        currentValue = deleteSafe(currentValue, parameters.options.target)
        currentValue = JSON.stringify(currentValue)

        database.prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`).run(currentValue, parameters.id)

        return true
    }

    database.prepare(`DELETE FROM ${table} WHERE ID = (?)`).run(parameters.id)

    return true
}