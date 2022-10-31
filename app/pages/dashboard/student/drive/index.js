import Head from 'next/head'
import { getInfo } from '../../../../lib/session'
import NavBarStudent from '../../../../components/NavBarStudent'

export default function Home({ username }) {
    return (
        <div>
            <Head>
                <title>AD Control Panel</title>
                <meta name="description" content="Web app to manage your AD credentials" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <NavBarStudent />

            <main className="h-screen flex flex-col items-center justify-center bg-gray-600 ml-20">
                <h1 className='text-4xl text-white font-serif semibold'>Coming soon!</h1>
            </main>
        </div>
    )
}

function redir(to) {
    return {
        redirect: {
            destination: to
        }
    }
}

export async function getServerSideProps(context) {
    const cookie = require('cookie')
    const email = require('../../../../lib/email')
    if (context.req.headers.cookie === undefined) return redir("/")

    const sess = cookie.parse(context.req.headers.cookie)
    if (!("sess" in sess)) return redir("/")

    const info = getInfo(sess.sess)
    if (info === false) {
        context.res.setHeader('Set-Cookie', 'sess=YouGotMail; path=/; Max-Age=0')
        return redir("/")
    }

    if (info["perm"] == "2")      return redir("/dashboard/teacher")
    else if (info["perm"] == "0") return redir("/dashboard/admin")

    if (!email.EmailSet(info["username"])) return redir("/addemail")

    return {
        props: {
            username: info["username"],
        }
    }
}