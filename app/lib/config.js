export default class config {
    siteURL       = "http://localhost:3000/"

    adUserName    = ""                              // AD Administrator User 
    adHost        = "test.local"                    // Domain name for login
    adPasswd      = ""                              // AD password for Admin
    adURL         = "ldaps://192.168.0.54"          // LDAP connection string (SSL/TLS Required)
    adBase        = "OU=Students,DC=test,DC=local"  // DN Path base to add users

    resetEmail    = ""                              // Email to send reset emails from
    resetEmailPwd = ""                              // Password for the reset email

    SMBPath = "X:/"

    userDBFile    = "./DB/users.json"               // File to store the users for AD
    sessionDBFile = "./DB/sess.json"                // File to store the web sessions
    resetDBFile   = "./DB/resetTokens.json"         // File to store the tokens to reset your password
}
