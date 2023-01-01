import { Database } from "better-sqlite3"
import { ModuleParameters } from "../moduleFactory"
import Get from "./get"

export default function Type(database: Database, parameters: ModuleParameters, table: string): string {
    let currentValue = Get(database, parameters, table)

    return typeof currentValue
}