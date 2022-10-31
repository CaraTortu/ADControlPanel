import { createSession } from '../../lib/session.js'
import config from '../../lib/config'
import ldap from 'ldapjs'

// Create Config object
const Config = new config()

// Define the LDAP object
const LDAPClient = ldap.createClient({
  url: Config.adURL,
  reconnect: true
})

// Ignore self signed certs
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

export default function handler(req, res) {
    if (!('user' in req.body) || !('passwd' in req.body) || req.body["user"] === "") {
        res.status(401)
        res.json({ error: 'Please supply all parameters' })
        return
    }

    LDAPClient.bind(req.body['user']+"@"+Config.adHost, req.body['passwd'], function(err) {
        if (err) {
            res.status(403)
            res.json({ error: 'Incorrect username or password'})
            return
        }

        let perm

        if (req.body['user'].toLowerCase() === Config.adUserName.toLowerCase()) perm = 0
        else if (req.body['user'].toLowerCase().match(/[a-f]000/) !== null) perm = 2
        else perm = 1

        const token = createSession(perm, req.body['user'])
        res.setHeader("Set-Cookie", "sess="+token+"; path=/")
        res.json({ perm: perm })
    })
}
  