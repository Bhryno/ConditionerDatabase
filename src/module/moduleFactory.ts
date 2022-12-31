import { Database } from "better-sqlite3"

const safeEcho = false

const modules = {
    
}

export type ModuleOptions = {

    table?: string,
    target?: string,
    subKeys?: boolean

}

type ArbitrateModuleParameters = {

    id?: string,
    options?: ModuleOptions,
    data?: any

}

export type ModuleParameters = {

    id?: string,
    options: ModuleOptions,
    data?: any

}

export function arbitrate(database: Database, module: keyof typeof modules, _parameters: ArbitrateModuleParameters, table?: string): any {
    
    let parameters: ModuleParameters = { ...(_parameters || {}), options: {} }

    table = table || parameters.options?.table || "json"

    database.prepare(`CREATE TABLE IF NOT EXISTS ${table} (ID TEXT, json TEXT)`).run()

    if (parameters.options.target && parameters.options.target.includes(".") && parameters.options.subKeys !== false) {

        parameters.options.target = parameters.options.target.slice(1)

    }

    if (parameters.data && parameters.data === Infinity) {

        throw new TypeError(`Cannot set value to infinity -> [${table}/${parameters.id}]`)

    }

    if (parameters.id && parameters.id.includes(".") && parameters.options.subKeys !== false) {

        let split = parameters.id.split(".")

        parameters.id = split.shift()
        parameters.options.target = split.join(".")

    }

    return modules[module](database, parameters, table)

}