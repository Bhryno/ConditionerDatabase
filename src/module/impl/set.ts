import { Database } from "better-sqlite3"
import { getValue, getSafe, setSafe, ModuleParameters, setValue } from "../moduleFactory"

export default function Set(database: Database, parameters: ModuleParameters, table: string): any | null {
    let currentValue = getValue(database, parameters, table)

    currentValue = JSON.parse(currentValue.json)

    if (parameters.options.target && parameters.options.subKeys !== false) {
        if (typeof currentValue === "object") {
            parameters.data = setSafe(currentValue, parameters.options.target, parameters.data)
        } else {
            throw new TypeError(`Cannot use sub keys on a non-object instance -> "${currentValue}". [${table}/${parameters.id}]`)
        }
    }

    parameters.data = JSON.stringify(parameters.data)

    return setValue(database, parameters, table)
}