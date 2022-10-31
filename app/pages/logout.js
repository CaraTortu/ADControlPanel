export default function logout() {
    return
}

function redir(to) {
    return {
        redirect: {
            destination: to
        }
    }
}

export function getServerSideProps(ctx) {
    const session = require('../lib/session.js')
    const cookie = require('cookie')

    // There is no cookies set. Go to login
    if (ctx.req.headers.cookie === undefined) return redir("/")


    const sess = cookie.parse(ctx.req.headers.cookie)

    if ("sess" in sess) {
        session.deleteSession(sess.sess)
        ctx.res.setHeader("Set-Cookie", "sess=; Max-Age=0; path=/")
    }
    
    return redir("/")
}