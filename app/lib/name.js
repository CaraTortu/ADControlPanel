import fs from 'fs'
import Config from './config'
import { ResetEmail } from './ldap'

// Get the config we set
const config = new Config()

// Return the parsed DB user file
export function getUsers() {
    const db = fs.readFileSync(config.userDBFile)
    return JSON.parse(db)
}

// Writes the updated users DB
export function putUsers(db) {
    fs.writeFileSync(config.userDBFile, JSON.stringify(db))
}

// Check if the user's has been set
export function NameSet(user) {
    const db = getUsers()
    return db[user]["name"] !== ""
}

// Sets the name of a user
export function setName(user, email) {
    const db = getUsers()
    db[user]["name"] = email
    ResetEmail(user.replace(/\d+/, ""), user, email)
    putUsers(db)
}

// Returns the name of a user
export function getName(user) {
    const db = getUsers()
    return db[user]["name"]
}
