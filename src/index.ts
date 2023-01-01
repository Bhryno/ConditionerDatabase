import Sqlite from "better-sqlite3"
import { arbitrate, ModuleOptions } from "./module/moduleFactory"

export interface Database {
    add: (key: string, value: number, options?: ModuleOptions) => null | number

    subtract: (key: string, value: any, options?: ModuleOptions) => null | number

    push: (key: string, value: any, options?: ModuleOptions) => any[] | null

    get: (key: string, options?: ModuleOptions) => any | null

    set: (key: string, value: any, options?: ModuleOptions) => any | null

    has: (key: string, options?: ModuleOptions) => boolean

    type: (key: string, options?: ModuleOptions) => boolean

    delete: (key: string, options?: ModuleOptions) => boolean

    all: (options?: ModuleOptions) => { ID: any, data: any }[]

    clear: (options?: ModuleOptions) => number
}

export interface DatabaseImpl extends Database {
    fileLocation: string,
    table: TableConstructor
}

export interface Table extends Database {
    tableName: string
}

export interface DatabaseImplConstructor {
    new(file?: string): DatabaseImpl
    (file?: string): DatabaseImpl
}

export interface TableConstructor {
    new(tableName: string): Table
    (tableName: string): Table
}

const DatabaseImpl: DatabaseImplConstructor = function(this: DatabaseImpl | void, file?: string) {
    if (!(this instanceof DatabaseImpl)) {
        return new DatabaseImpl(file)
    }

    const databaseImplThis = this

    databaseImplThis!.fileLocation = file || "data.sqlite"

    let database = Sqlite(this.fileLocation)

    /* Register modules */
    databaseImplThis!.add = (key, value, options?) => arbitrate(database, "Add", {
        id: key,
        data: value, options
    })

    databaseImplThis!.subtract = (key, value, options?) => arbitrate(database, "Subtract", {
        id: key,
        data: value, options
    })

    databaseImplThis!.push = (key, value, options?) => arbitrate(database, "Push", {
        id: key,
        data: value, options
    })

    databaseImplThis!.set = (key, value, options?) => arbitrate(database, "Set", {
        id: key,
        data: value, options
    })

    databaseImplThis!.get = (key, options?) => arbitrate(database, "Get", {
        id: key, options
    })

    databaseImplThis!.has = (key, options?) => arbitrate(database, "Has", {
        id: key, options
    })

    databaseImplThis!.type = (key, options?) => arbitrate(database, "Type", {
        id: key, options
    })

    databaseImplThis!.delete = (key, options?) => arbitrate(database, "Delete", {
        id: key, options
    })

    databaseImplThis!.all = (options?) => arbitrate(database, "All", {
        options
    })

    databaseImplThis!.clear = (options?) => arbitrate(database, "Clear", {
        options
    })

    /* Register table instance for every module (There's probably a more effective way) */
    databaseImplThis.table = function (this: Table | void, tableName: string) {
        if (!(this instanceof databaseImplThis.table)) {
            return new databaseImplThis.table(tableName)
        }

        const tableThis = this

        tableThis!.tableName = tableName

        tableThis!.add = (key, value, options?) => arbitrate(database, "Add", {
            id: key,
            data: value, options
        }, tableThis.tableName)
    
        tableThis!.subtract = (key, value, options?) => arbitrate(database, "Subtract", {
            id: key,
            data: value, options
        }, tableThis.tableName)
    
        tableThis!.push = (key, value, options?) => arbitrate(database, "Push", {
            id: key,
            data: value, options
        }, tableThis.tableName)
    
        tableThis!.set = (key, value, options?) => arbitrate(database, "Set", {
            id: key,
            data: value, options
        }, tableThis.tableName)
    
        tableThis!.get = (key, options?) => arbitrate(database, "Get", {
            id: key, options
        }, tableThis.tableName)
    
        tableThis!.has = (key, options?) => arbitrate(database, "Has", {
            id: key, options
        }, tableThis.tableName)
    
        tableThis!.type = (key, options?) => arbitrate(database, "Type", {
            id: key, options
        }, tableThis.tableName)
    
        tableThis!.delete = (key, options?) => arbitrate(database, "Delete", {
            id: key, options
        }, tableThis.tableName)
    
        tableThis!.all = (options?) => arbitrate(database, "All", {
            options
        }, tableThis.tableName)
    
        tableThis!.clear = (options?) => arbitrate(database, "Clear", {
            options
        }, tableThis.tableName)
    } as TableConstructor


} as DatabaseImplConstructor

export default DatabaseImpl
module.exports = DatabaseImpl