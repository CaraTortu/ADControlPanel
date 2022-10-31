import { resetDirectory } from "../../../lib/smb";
import { getInfo } from '../../../lib/session'

export default function deletefile(req, res) {

    const sess =  req.cookies["sess"]

    if (sess === undefined) {
        res.status(403)
        res.json({ error: "Please log in first"})
        return
    }

    const info = getInfo(sess)

    if (info === false) {
        res.status(403)
        res.json({ error: "Invalid session" })
        return
    }

    if (info["perm"] === "0") {
        if (!("user" in req.body)) {
            res.status(403)
            res.json({ error: "Please supply all parameters" })
            return
        }
        resetDirectory(req.body["user"])
        res.status(200)
        res.json({ success: true })
        return
    }

    resetDirectory(info["username"])
    res.status(200)
    res.json({ success: true })
}