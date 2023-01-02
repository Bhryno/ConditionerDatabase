console.clear()

const databaseImpl = require(".")
const { Database } = require("./dist/index")

let cache = []

function test(name, testFN, result) {
    const updateStdout = () => {
        console.clear()

        for (let line of cache) {
            console.log(line)
        }
    }

    cache.push(`Running test "${name}"`)
    updateStdout()

    const startTime = process.hrtime()[1]
    const fnResult = testFN()
    const endTime = process.hrtime()[1]

    cache.pop()

    if (fnResult !== result) {
        cache.push(`Test '${name}' has failed. ${fnResult} !== ${result} [Duration: ${endTime - startTime} ns]`)
        updateStdout()
        process.exit(1)
    }

    cache.push(`Test 'name' finished [Duration: ${endTime - startTime} ns]`)
    updateStdout()
}

/**
 * @param {Database} database
 */
function runTests(database) {
    database.clear()

    /* Global Settings */
    test("Setting", () => database.set("set_me", 10) === 10 && database.get("set_me") === 10, true)
    /* Global Key Mappings */
    test("Setting Keys", () => database.set("set_keys.sub.keys", 10) === 10 && database.get("set_keys.sub.keys") === 10, true)
    /* Addition (Unit-test checks if 20 + 10 = 30) */
    database.set("add_me", 20)
    test("Addition", () => database.add("add_me", 10), 30)
    /* Subtraction (Unit-test checks if 20 - 10 = 10) */
    database.set("reduce_me", 20)
    test("Subtraction", () => database.subtract("reduce_me", 10), 10)
    /* Non-operator/Miscellanious flag check (Unit-test checks if the item that exists does in fact exist) */
    database.set("i_exist", true)
    test("Item Exists", () => database.has("i_exist"), true)
}

/* Run tests */
cache.push("\n [ ## STARTING DATABASE TESTS ## ]")
runTests(databaseImpl())