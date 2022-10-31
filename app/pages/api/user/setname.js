import { setName } from '../../../lib/name'
import { getInfo } from '../../../lib/session'
import cookies from 'cookie'

export default function setEmailAPI(req, res) {
    if (!("name" in req.body) || !("user" in req.body)) {
        res.status(403)
        res.json({ error: "Please supply all parameters" })
        return
    }

    const c = cookies.parse(req.headers.cookie)

    if (!("sess" in c)) {
        res.status(403)
        res.json({ error: "Please log in first" })
        return
    }

    const info = getInfo(c.sess)

    if (info === false) {
        res.setHeader('Set-Cookie', 'sess=; path=/; Max-Age=0')
        res.status(403)
        res.json({ error: "Please log in first" })
        return
    }

    if (req.body["user"].match(/^[A-F][0-1][0-9][0-9]$/) === null || (info["username"] !== req.body["user"] && info["perm"] !== 0)) {
        res.status(403)
        res.json({ error: "Please supply a valid user" })
        return
    }

    setName(req.body["user"], req.body["name"])
    res.status(200)
    res.json({ success: true })
}