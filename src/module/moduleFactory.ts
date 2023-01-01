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

export function getSafe(object: any, path: string): undefined | any {

    if (safeEcho) {

        console.log(`<GET SAFE> :: IN:`, object, `, PATH:`, path)

    }

    let parent = object

    for (let subPath of path.split(".")) {

        if (!parent[subPath]) {

            return undefined

        }

        parent = parent[subPath]

    }

    if (safeEcho) {

        console.log(`<GET SAFE RETURN> :: IN:`, object, `, PATH:`, path, `, VALUE:`, parent)

    }

    return parent

}

export function setSafe(object: any, path: string, value: any) {

    if (safeEcho) {

        console.log(`<SET SAFE> :: IN:`, object, `, PATH:`, path, `, VALUE:`, value)

    }

    let parent = object
    const splits = path.split(".")

    for (let i = 0; i < splits.length; i++) {

        let subPath = splits[i]

        if (parent[subPath] === undefined) {

            parent[subPath] = {}

        }

        if (i === splits.length - 1) {

            parent[subPath] = value

        }
        else {

            parent = parent[subPath]

        }

    }

    return object

}

export function deleteSafe(object: any, path: string): object {
    
    if (safeEcho) {

        console.log(`<DELETE SAFE> :: IN:`, object, `, PATH:`, path)

    }

    let parent = object
    const splits = path.split(".")

    for (let i = 0; i < splits.length; i++) {
        
        let subPath = splits[i]

        if (parent[subPath] === undefined) {

            parent[subPath] = {}

        }

        if (i === splits.length - 1) {

            delete parent[subPath]

        }
        else {

            parent = parent[subPath]

        }

    }

    return object

}