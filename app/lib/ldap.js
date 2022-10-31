import fs from 'fs'
import config from './config'
import ldap from 'ldapjs'
import { generatePassword, encodePassword } from './utils'

// Create Config object
const Config = new config()

// Define the LDAP object
const LDAPClient = ldap.createClient({
  url: Config.adURL,
  reconnect: true
})

// Ignore errors
LDAPClient.addListener('error', function (err) {
    if (!("ECONNRESET" in err)) {
        console.log(err)
    }
})

// Ignore self signed certs
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// Resets the password for a user
export function ResetPassword(letter, user, passwd) {

    LDAPClient.bind(Config.adUserName+"@"+Config.adHost, Config.adPasswd, function(err) {

        if (err) {
            console.log(err)
            return false
        }

        // Set DN path and change string
        const DN = 'CN=' + user + ',OU=' + letter + ',' + Config.adBase
        const change = {
            operation: 'replace',
            modification: {
                unicodePwd: encodePassword(passwd)
            }
        }

        // Delete the user
        LDAPClient.modify(DN, change, function (err) { 
            if (err) { console.log(err) }
        })

        // Insert new password in the JSON file
        let j = JSON.parse(fs.readFileSync(Config.userDBFile))
        j[user]["password"] = passwd
        fs.writeFileSync(Config.userDBFile, JSON.stringify(j))

    })
    return passwd
}

// Sets the email for a user
export function ResetEmail(letter, user, email) {

    LDAPClient.bind(Config.adUserName+"@"+Config.adHost, Config.adPasswd, function(err) {

        if (err) {
            console.log(err)
            return false
        }

        // Set DN path and change string
        const DN = 'CN=' + user + ',OU=' + letter + ',' + Config.adBase
        const change = {
            operation: 'replace',
            modification: {
                mail: email
            }
        }

        // Set the email
        LDAPClient.modify(DN, change, function (err) { 
            if (err) { console.log(err) }
        })
    })
}

// Check if there are any users in the DB
function DBCreated() {
    const db = fs.readFileSync(Config.userDBFile).toString('utf-8')
    return db != "{}"
}

// Delete ALL users from A-F 0-100
export function DeleteAll() {
    const letters = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F'}
    let username, DN

    if (!DBCreated()) {
        return false
    }

    LDAPClient.bind(Config.adUserName+"@"+Config.adHost, Config.adPasswd, function(err) {

        if (err) {
            console.log(err)
            return false
        }

        for (let i = 0; i<6; i++) {
            for (let j = 0; j<101; j++) {
                username = letters[i] + ('0'.repeat(3-String(j).length)) + String(j)

                // Set DN path
                DN = 'CN=' + username + ',OU=' + letters[i] + ',' + Config.adBase

                // Delete the user
                LDAPClient.del(DN, function (err) { return })
            }
        }

        // Write values to json DB
        fs.writeFile(Config.userDBFile, "{}", function (err) { return })
    })

    return true
}

// Regenerate ALL usernames and password
export function RegenerateDB() {
    let DB = {}
    const letters = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F'}
    let [passwd, username, DN, user] = ['', '', '', {}]

    if (DBCreated()) {
        return false
    }

    LDAPClient.bind(Config.adUserName+"@"+Config.adHost, Config.adPasswd, function(err) {

        if (err) {
            console.log(err)
            return false
        }

        for (let i = 0; i<6; i++) {
            for (let j = 0; j<101; j++) {
                passwd = generatePassword(10)
                username = letters[i] + ('0'.repeat(3-String(j).length)) + String(j)

                // ADD TO DB
                DB[username] = {password: passwd, email: "", name: ""}

                // ADD to AD
                DN = 'CN=' + username + ',OU=' + letters[i] + ',' + Config.adBase
                user = {
                    cn: username,
                    objectClass: 'user',
                    unicodePwd: encodePassword(passwd),
                    sAMAccountName: username,
                    company: '2022',
                    givenName: username,
                    displayName: username,
                    userPrincipalNAme: username + '@' + Config.adHost,
                    department: username,
                    userAccountControl: 512
                }

                // Add to AD
                LDAPClient.add(DN, user, function (err) { return })
            }
        }

        // Write values to json DB
        fs.writeFile(Config.userDBFile, JSON.stringify(DB), function (err) { return })
    })
    return true
}
