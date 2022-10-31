import { getInfo } from '../../../lib/session.js'
import { RegenerateDB } from '../../../lib/ldap.js'

export default function handler(req, res) {
    const session = req.cookies["sess"]

    if (session === undefined) {
        res.status(403)
        res.json({ error: 'Login first' })
        return
    }

    let sess = getInfo(session)

    if (sess === false || sess['perm'] !== 0) {
        res.status(403)
        res.json({ error: 'You do not have permissions to do this' })
        return
    }

    let status = RegenerateDB()

    if (status === false) {
        res.status(403)
        res.json({ error: "The users are already created" })
        return
    }

    res.status(200)
    res.json({ success: true })
}
