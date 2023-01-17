import { Database } from 'better-sqlite3'
import {
    getSafe,
    getValue,
    setSafe,
    setValue,
    ModuleParameters
} from '../moduleFactory'

export default function Add(
    database: Database,
    parameters: ModuleParameters,
    table: string
): number | null {
    let currentValue = getValue(database, parameters, table)

    if (parameters.options.target && parameters.options.subKeys !== false) {
        currentValue = JSON.parse(currentValue.json)

        let numericalValue =
            getSafe(currentValue, parameters.options.target) ?? 0

        if (isNaN(numericalValue)) {
            throw new Error(
                `Expect numerical value is NaN [Found "${numericalValue}" at ${table}/${parameters.id}]`
            )
        }

        parameters.data = setSafe(
            currentValue,
            parameters.options.target,
            numericalValue + parameters.data
        )
    } else {
        if (currentValue.json === '{}') {
            currentValue.json = 0
        } else {
            currentValue.json = JSON.parse(currentValue.json)
        }

        if (isNaN(currentValue.json)) {
            throw new Error(
                `Expect numerical value is NaN [Found "${currentValue}" at ${table}/${parameters.id}]`
            )
        }

        parameters.data = Number(currentValue.json) + parameters.data
    }

    parameters.data = JSON.stringify(parameters.data)

    return setValue(database, parameters, table)
}
