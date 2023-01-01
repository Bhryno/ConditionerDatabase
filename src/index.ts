import Sqlite from "better-sqlite3"
import { ModuleOptions } from "./module/moduleFactory"

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