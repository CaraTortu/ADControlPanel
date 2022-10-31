import { deleteFile, fileExists } from "../../../lib/smb";
import { getInfo } from '../../../lib/session'

export default function deletefile(req, res) {

    if (!("file" in req.body)) {
        res.status(403)
        res.json({ error: "Please supply all parameters" })
        return
    }

    const sess = req.cookies["sess"]

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
        deleteFile(req.body["user"], req.body["file"])
        res.status(200)
        res.json({ success: true })
        return
    }

    if (!fileExists(info["username"], req.body["file"])) {
        res.status(404)
        res.json({ error: "File does not exist"})
        return
    }

    deleteFile(info["username"], req.body["file"])
    res.status(200)
    res.json({ success: true })
}