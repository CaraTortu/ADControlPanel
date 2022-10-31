import { getInfo } from '../../../lib/session'
import { userInfo } from '../../../lib/email'

export default function handler(req, res) {

    if (!("user" in req.body)) {
        res.status(403)
        res.json({ error: "Please supply all parameters"})
        return
    }

    if (!/^[A-F][0-1][0-9][0-9]$/.test(req.body["user"])) {
        res.status(401)
        res.json({ error: "Invalid user" })
        return
    }

    const session = req.cookies["sess"]

    if (session === undefined) {
        res.status(403)
        res.json({ error: 'Login first' })
        return
    }

    let sess = getInfo(session)

    if (sess === false || (sess['perm'] !== 0 && sess['username'] !== req.body["user"])) {
        res.status(403)
        res.json({ error: 'You do not have permissions to do this' })
        return
    }

    res.status(200)
    res.json(userInfo(req.body["user"]))
}
  