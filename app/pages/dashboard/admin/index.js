import Head from 'next/head'
import { getInfo } from '../../../lib/session.js'
import NavBar from '../../../components/NavBar.js'

export default function Home({ username }) {
    return (
        <div>
            <Head>
                <title>AD Control Panel</title>
                <meta name="description" content="Web app to manage your AD credentials" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <NavBar />

            <main className="h-screen flex flex-col items-center justify-center bg-gray-600 ml-20">
                <h1 className='text-4xl text-white font-serif semibold'>Welcome to your admin dashboard <span className='text-orange-500'>{username}</span>!</h1>
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
    if (context.req.headers.cookie === undefined) return redir("/")

    const sess = cookie.parse(context.req.headers.cookie)
    if (!("sess" in sess)) return redir("/")

    const info = getInfo(sess.sess)
    if (info === false) {
        context.res.setHeader('Set-Cookie', 'sess=YouGotMail; path=/; Max-Age=0')
        return redir("/")
    }

    if (info["perm"] == "1")      return redir("/dashboard/student")
    else if (info["perm"] == "2") return redir("/dashboard/teacher")

    return {
        props: {
            username: info["username"],
        }
    }
}