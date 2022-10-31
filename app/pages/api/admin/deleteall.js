import { DeleteAll } from '../../../lib/ldap.js'
import { getInfo } from '../../../lib/session.js'
import { successMSG } from '../../../lib/utils.js'

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

    let status = DeleteAll()
    
    if (status === false) {
        res.status(403)
        res.json({ error: "There are no users created" })
        return
    }

    res.status(200)
    res.json({ success: true })
}
  