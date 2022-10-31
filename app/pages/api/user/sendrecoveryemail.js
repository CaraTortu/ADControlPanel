import nodemailer from 'nodemailer'
import { getEmail, EmailSet } from "../../../lib/email"
import { generatePassword } from "../../../lib/utils"
import { setToken } from "../../../lib/recovery"
import Config from '../../../lib/config'

// Define config object
const config = new Config()

export default async function resetpass(req, res) {
    if (!("user" in req.body)) {
        res.status(403)
        res.json({ error: "Please supply all parameters" })
        return
    }

    if (req.body["user"].match(/^[A-F][0-1][0-9][0-9]/) === null) {
        res.status(403)
        res.json({ error: "Invalid user" })
        return
    }

    if (!EmailSet(req.body["user"])) {
        res.status(403)
        res.json({ error: "Email not set for this user" })
        return
    }

    const token = generatePassword(64)

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: config.resetEmail, 
          pass: config.resetEmailPwd, 
        },
      })

    await transporter.sendMail({
        from: config.resetEmail,
        to: getEmail(req.body["user"]),
        subject: "Reset Password Request",
        html: "Please click the following link to reset your password: "+config.siteURL+"resetpass?token="+token
    })

    setToken(token, req.body["user"])

    res.status(200)
    res.json({ success: true })
}