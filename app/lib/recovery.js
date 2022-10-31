import fs from 'fs'
import Config from './config'

const config = new Config()

// Returns the DB for recovery tokens
function getDB() {
    return JSON.parse(fs.readFileSync(config.resetDBFile))
}

// Writes the updated DB
function putDB(db) {
    fs.writeFileSync(config.resetDBFile, JSON.stringify(db))
}

// Assigns the token to a user object
export function setToken(token, user) {
    const db = getDB()
    db[token] = user
    putDB(db)
}

// Deletes the token as we reset our password
export function deleteToken(token) {
    const db = getDB()
    delete db[token]
    putDB(db)
}

// Checks if the token is valid or not
export function validToken(token) {
    const db = getDB()
    return token in db
}

// Gets the username from the token given
export function getUser(token) {
    const db = getDB()
    return db[token]
}