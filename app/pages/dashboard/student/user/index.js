import Head from 'next/head'
import { getInfo } from '../../../../lib/session.js'
import { useEffect } from 'react'
import NavBarStudent from '../../../../components/NavBarStudent'

export default function User({ username }) {

    function showPasswd() {
        document.getElementById("ShowPass").classList.add("hidden")
        document.getElementById("UserPassword").classList.remove("hidden")
    }

    function switchTextColour(error, status) {
        if (error.classList.contains("text-green-500") && !status) {
            error.classList.add("text-red-600")
            error.classList.remove("text-green-500")
        } else if (error.classList.contains("text-red-600") && status) {
            error.classList.remove("text-red-600")
            error.classList.add("text-green-500")
        }
    }

    async function setPassword() {
        const response = await fetch("/api/user/resetpasswd", {
            method: "POST",
            body: JSON.stringify({
                user: username,
                passwd: document.getElementById("PasswordUser").value
            }),
            headers: {"Content-Type": "application/json"}
        })

        const r = await response.json()

        const error = document.getElementById("PasswordSetError") 

        if ("error" in r) {
            switchTextColour(error, false)
            error.innerText = "Error: "+r.error
        } else {
            setup()
            switchTextColour(error, true)
            document.getElementById("PasswordUser").value = ""
            error.innerText = "New password was set!"
        }
    }

    function FileAccess() {
        location.href = "/dashboard/student/drive?user="+username
    }

    async function setup() {

        let userinfo = await fetch("/api/admin/userinfo", {
            method: "POST",
            body: JSON.stringify({
                user: username
            }),
            headers: {"Content-Type": "application/json"}
        })

        userinfo = await userinfo.json()

        document.getElementById("UserEmail").innerText = userinfo["email"]
        document.getElementById("UserName").innerText = username
        document.getElementById("UserN").innerText = userinfo["name"]
        document.getElementById("UserPassword").innerText = userinfo["password"]
    }

    useEffect(() => {

        setup()

        window.showPasswd =  () => {
            const passwd = document.getElementById("UserPassword")
            const showPass = document.getElementById("ShowPass")
                    
            showPass.className += " hidden"
            passwd.classList.remove("hidden")
        }
    })

    return (
        <div>
            <Head>
                <title>AD Control Panel</title>
                <meta name="description" content="Web app to manage your AD credentials" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <NavBarStudent />

            <main id="ChangeView" className="h-screen bg-gray-600 ml-20 p-8 flex flex-col">
                <h1 className="text-white text-4xl w-full text-center">User Info</h1>
                <div className='grid grid-cols-5 grid-rows-4 gap-4 mt-8 flex-grow'>
                    <div className='col-span-1'></div>
                    <div class="bg-gray-500 rounded-xl border-2 border-white p-4 gap-2 grid grid-cols-2 grid-rows-2 text-center col-span-3">
                        <div className="bg-gray-600 rounded-lg flex flex-row gap-2 items-center w-full border-2 justify-center border-black text-white">
                            <p className='font-bold text-md'>Email:</p>
                            <p id="UserEmail" className='text-orange-200'></p>
                        </div>
                        <div className="bg-gray-600 rounded-lg flex flex-row gap-2 items-center w-full border-2 justify-center border-black text-white">
                            <p className='font-bold text-md'>Username:</p>
                            <p id="UserName" className='text-orange-200'></p>
                        </div>
                        <div className="bg-gray-600 rounded-lg flex flex-row gap-2 items-center w-full border-2 justify-center border-black text-white">
                            <p className='font-bold text-md'>Name:</p>
                            <p id="UserN" className='text-orange-200'></p>
                        </div>
                        <div className="bg-gray-600 rounded-lg flex flex-row gap-2 items-center w-full border-2 justify-center border-black text-white">
                            <p className='font-bold text-md'>Password:</p>
                            <button id="ShowPass" className="py-1 px-2 bg-slate-500 rounded-xl" onClick={showPasswd}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                </svg>
                            </button>
                            <p id="UserPassword" className='hidden text-orange-300'></p>
                        </div>
                    </div>
                    <div className='col-span-5 row-span-3 grid grid-cols-6 gap-4 grid-rows-1 pt-8'>
                        <div className="col-span-1"></div>
                        <div className='bg-gray-500 rounded-lg border border-white flex flex-col items-center p-4 col-span-2'>
                            <h1 className="font-bold text-orange-300 text-3xl">Set password</h1>
                            <div className="flex flex-row w-11/12">
                                <input id="PasswordUser" type="text" className="px-4 text-black py-1 bg-white font-sans rounded-xl border-black border-2 w-full mt-11 text-center" placeholder="P4SsW0rd123!" /> 
                            </div>
                            <button className='rounded-xl bg-gray-600 hover:bg-gray-700 py-2 px-8 text-white mt-4 duration-300' onClick={setPassword}>Set password</button>
                            <p id="PasswordSetError" className='flex-grow w-full mt-8 border-2 border-black bg-gray-600 rounded-xl p-4 flex items-center justify-center text-center text-red-600 text-lg font-bold break-all'><span className=''></span></p>
                        </div>
                        <div className='bg-gray-500 rounded-lg border border-white flex flex-col items-center p-4 col-span-2'>
                            <h1 className="font-bold text-orange-300 text-3xl">Manage Files</h1>
                            <div className="flex-grow w-full flex justify-center items-center">
                                <button className='rounded-xl bg-gray-600 hover:bg-gray-700 py-2 px-8 text-white mt-4 duration-300 text-xl' onClick={FileAccess}>Access Files</button>
                            </div>
                        </div>
                        <div className="col-span-1"></div>
                    </div>
                </div>
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