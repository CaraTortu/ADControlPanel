import fs from 'fs'
import config from './config'
import { generatePassword } from './utils'

// Create Config object
const Config = new config()

/*  
    PERMISSIONS
     0 - admin
     1 - normal user
     2 - teacher
*/

// Returns the parson DB session file
export function getDBFile() {
    return JSON.parse(fs.readFileSync(Config.sessionDBFile))
}

// Writes the newly edited DB file
export function writeDBFile(db) {
    fs.writeFileSync(Config.sessionDBFile, JSON.stringify(db))
}

// Generates a session with a user object so we can keep track of who's who
export function createSession(perm, username) {
    let cursess = getDBFile()

    const newSession = generatePassword(32)
    cursess[newSession] = {
        username: username,
        perm: perm,
        expires: Date.now() + (1000*3600), // Current date plus one hour in ms
    }

    // Write the session DB file
    writeDBFile(cursess)

    return newSession
}

// Deletes a session from the db (Logout or more than 1h old)
export function deleteSession(sess) {
    let db = getDBFile()
    delete db[sess]
    writeDBFile(db)
}

// Returns the information from the user that has the token
export function getInfo(sess) {
    const db = getDBFile()

    if (!(sess in db)) return false

    if (Date.now() > db[sess]["expires"]) {
        deleteSession(sess)
        return false
    }

    return db[sess]
}