import { Database } from "better-sqlite3"
import { ModuleParameters } from "../moduleFactory"

export default function clear(database: Database, parameters: ModuleParameters, table: string): number | null {
    let rowCount = database.prepare(`DELETE FROM ${table}`).run()

    if (!rowCount) {
        return null
    }

    return rowCount.changes
}