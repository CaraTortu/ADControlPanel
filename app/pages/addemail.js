import { getInfo } from '../lib/session'

export default function AddEmail({ username }) {

    function verifyCreds(user, email) {
        if (user.match(/^[A-F][0-1][0-9][0-9]$/) === null) {
            return "Please supply a valid user"
        }
    
        if (email.match(/^[a-z0-9]+@sainteunans\.com/) === null) {
            return "Only @sainteunans.com emails are allowed"
        }

        return true
    }

    async function setEmail() {
        // Get email set and username
        const email = document.getElementById("Email").value + "@sainteunans.com"
        const username = document.getElementById("username").value
        const name = document.getElementById("Name").value
        const error = document.getElementById("Error")

        // Verify data
        const v = verifyCreds(username, email)

        // Verification failed
        if (v !== true) {
            error.innerText = "Error: "+v
            return
        }

        // Check if the name set is empty
        if (name === "") {
            error.innerText = "Error: Name cannot be empty"
            return
        }

        // Fetch our set email API endpoint
        const response = await fetch("/api/user/setemail", {
            method: "POST",
            body: JSON.stringify({
                user: username,
                email: email
            }),
            headers: {"Content-Type": "application/json"}
        })

        // Fetch out set name API endpoint
        const responseName = await fetch("/api/user/setname", {
            method: "POST",
            body: JSON.stringify({
                user: username,
                name: name
            }),
            headers: {"Content-Type": "application/json"}
        })

        // Convert the response to JSON
        const data = await response.json()

        // Failed to set email
        if ("error" in data) {
            error.innerText = "Error: "+data.error
            return
        }

        // Success. Redirect to their panel
        if (username.match(/[A-F]000/)) location.href = "/dashboard/teacher"
        else location.href = "/dashboard/student"

    }

    return (
        <div className='h-screen w-full login flex items-center justify-center text-white text-center'>
            <div className="bg-gray-600 bg-opacity-50 border-2 border-blue-700 backdrop-blur-lg py-4 px-8 rounded-xl max-w-xl">
                <h1 className="font-bold text-4xl font-mono">Set your email and name</h1>
                <div className="w-full mx-auto mt-4 bg-white" style={{height: 1}}></div>
                <p className="text-lg mt-4 text-center">In case you forget your password, we will send you a reset email for you to change your password.</p>
                <div className="w-full mx-auto mt-4 bg-white" style={{height: 1}}></div>
                <div className="flex flex-row">
                    <input id="Email" type="email" className="px-4 text-black py-1 bg-white font-sans rounded-xl border-black border-2 w-full mt-8 text-left" placeholder="JohnDoe2020" /> 
                    <p className="absolute right-12 text-black mt-9">@sainteunans.com</p>
                </div>
                <div className="flex flex-row">
                    <input id="Name" type="email" className="px-4 text-black py-1 bg-white font-sans rounded-xl border-black border-2 w-full mt-2 text-left" placeholder="John Doe" /> 
                </div>
                <input type="hidden" value={username} id="username"></input>
                <button className='py-2 bg-gray-700 w-1/3 mt-4 hover:bg-gray-800 duration-300 rounded-lg' onClick={setEmail}>Submit</button>
                <p id="Error" className="text-red-600 text-lg font-bold mt-2"></p>
            </div>
        </div>
    )
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

    return {
        props: {
            username: info["username"],
        }
    }
}