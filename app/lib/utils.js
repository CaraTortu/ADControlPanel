
// Generate a random password
export function generatePassword(n) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

    let passwd = ''
    for (let i = 0; i<n; i++) {
        passwd += chars[Math.floor(Math.random() * chars.length)]
    }

    return passwd
}

// encodes the password for LDAP
export function encodePassword(password) {
    var newPassword = '';
    password = "\"" + password + "\"";
    for(var i = 0; i < password.length; i++){
        newPassword += String.fromCharCode( password.charCodeAt(i) & 0xFF,(password.charCodeAt(i) >>> 8) & 0xFF);
    }
    return newPassword;
}