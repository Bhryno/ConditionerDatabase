import { Database } from "better-sqlite3"
import { getSafe, getValue, setSafe, setValue, ModuleParameters } from "../moduleFactory"

export default function Push(database: Database, parameters: ModuleParameters, table: string) {
    let currentValue = getValue(database, parameters, table)

    if (parameters.options.target && parameters.options.subKeys !== false) {
        currentValue = JSON.parse(currentValue.json)

        if (typeof currentValue !== "object") {
            throw new TypeError(`Cannot use sub keys on a non-object instance -> "${currentValue}". [${table}/${parameters.id}]`)
        }

        let prevValue = getSafe(currentValue, parameters.options.target) ?? []

        if (!Array.isArray(prevValue)) {
            throw new TypeError(`Cannot use on the non-array instance -> "${currentValue}" . [${table}/${parameters.id}]`)
        }

        prevValue.push(parameters.data)
        parameters.data = setSafe(currentValue, parameters.options.target, prevValue)
    } else {
        if (currentValue.json === "{}") {
            currentValue = []
        } else {
            currentValue = JSON.parse(currentValue.json)
        }

        if (!Array.isArray(currentValue)) {
            throw new TypeError(`Cannot use on the non-array instance -> "${currentValue}" . [${table}/${parameters.id}]`)
        }

        currentValue.push(parameters.data)
        parameters.data = currentValue
    }

    parameters.data = JSON.stringify(parameters.data)

    return setValue(database, parameters, table)
}