import fs from 'fs'
import Config from './config'
import { ResetEmail } from './ldap'

// Get the config file we set
const config = new Config()

// Get and parse the users DB file
export function getUsers() {
    const db = fs.readFileSync(config.userDBFile)
    return JSON.parse(db)
}

// Return the information of a user
export function userInfo(user) {
    const db = getUsers()
    if (user in db) return db[user]
    return { error: "You need to create all the users first" }
}

// Write the newly edited DB
export function putUsers(db) {
    fs.writeFileSync(config.userDBFile, JSON.stringify(db))
}

// Check if that user's email has been set already
export function EmailSet(user) {
    const db = getUsers()
    return !(!(user in db) || db[user]["email"] === "") 
}

// Sets the user's email sent through the API
export function setEmail(user, email) {
    const db = getUsers()
    db[user]["email"] = email
    ResetEmail(user.replace(/\d+/, ""), user, email)
    putUsers(db)
}

// Returns the email from a user
export function getEmail(user) {
    const db = getUsers()
    return db[user]["email"]
}

// Checks if an email has been set in the DB
export function emailExists(email) {
    const db = getUsers()
    let exists = false
    for (const user in db) {
        if (db[user]["email"] === email) { 
            exists = true
            break
        }
    }
    return exists
}