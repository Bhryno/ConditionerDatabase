import { Database } from "better-sqlite3"
import { ModuleParameters } from "../moduleFactory"
import Add from "./add"

export default function Subtract(database: Database, parameters: ModuleParameters, table: string) {
    return Add(database, { ...parameters, data: -parameters.data }, table)
}