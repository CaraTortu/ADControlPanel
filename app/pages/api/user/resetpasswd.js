import { ResetPassword } from '../../../lib/ldap.js'
import { getUser, validToken, deleteToken } from '../../../lib/recovery.js'
import { getInfo } from '../../../lib/session.js'
import config from '../../../lib/config'

// Create Config object
const Config = new config()

export default function handler(req, res) {
    if (!('user' in req.body) || !('passwd' in req.body)) {
        res.status(401)
        res.json({ error: 'Please supply all parameters' })
        return
    }

    if ('token' in req.body) {
        if (!validToken(req.body["token"]) || getUser(req.body["token"]) !== req.body["user"]) {
            res.status(403)
            res.json({ error: "Invalid token" })
            return
        }

        if (req.body["passwd"].length < 8) {
            res.status(401)
            res.json({ error: "Your password should be at least 8 characters long"})
            return
        }

        ResetPassword(req.body['user'].replace(/\d+/, ""), req.body['user'], req.body["passwd"])

        deleteToken(req.body["token"])

        res.status(200)
        res.json({ success: true })
        return
    }

    const session = req.cookies["sess"]

    if (session === undefined) {
        res.status(403)
        res.json({ error: 'Login first' })
        return
    }

    let sess = getInfo(session)

    if (sess !== false && sess['perm'] === 0 ) {
        ResetPassword(req.body['user'].replace(/\d+/, ""), req.body['user'], req.body["passwd"])
        res.status(200)
        res.json({ success: true })
        return
    }

    if (sess === false || req.body["user"] !== sess["username"]) {
        res.status(403)
        res.json({ error: 'You do not have permissions to do this' })
        return
    }

    if (req.body['user'] === Config.adAdminUser) {
        res.status(403)
        res.json({ error: 'You can\'t reset the password for this user' })
        return
    }

    if (!/^[A-F]{1}[0-1][0-9][0-9]$/.test(req.body['user'])) {
        res.status(401)
        res.json({ error: 'Your username isn\'t valid' })
        return
    }

    if (req.body["passwd"].length < 8) {
        res.status(401)
        res.json({ error: "Your password should be at least 8 characters long"})
        return
    }

    ResetPassword(req.body['user'].replace(/\d+/, ""), req.body['user'], req.body["passwd"])

    res.status(200)
    res.json({ success: true })
}
  