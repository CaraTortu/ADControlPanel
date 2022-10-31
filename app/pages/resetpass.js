export default function forgotpass({ username, token }) {

    async function resetPass() {
        const password = document.getElementById("pass").value
        const password2 = document.getElementById("pass2").value
        const error = document.getElementById("Error")

        if (password !== password2) {
            error.innerText = "Error: The passwords do not match"
            return
        }

        if (password.length < 8) {
            error.innerText = "Error: The password should be at least 8 characters"
            return
        }

        // Fetch our sendrecoveryemail API endpoint
        const response = await fetch("/api/user/resetpasswd", {
            method: "POST",
            body: JSON.stringify({
                user: username,
                passwd: password,
                token: token
            }),
            headers: {"Content-Type": "application/json"}
        })
        
        // Convert the response to JSON
        const data = await response.json()

        if ("error" in data) {
            error.innerText = "Error: "+data.error
        } else {
            error.className = "text-green-500 font-bold text-lg mt-2"
            error.innerText = "Password reset! Redirecting you..."
            await new Promise(resolve => setTimeout(resolve, 2000))
            location.href = "/"
        }
    }

    return (
        <div className='h-screen w-full login flex items-center justify-center text-white text-center'>
            <div className="bg-gray-600 bg-opacity-50 border-2 border-blue-700 backdrop-blur-lg py-4 px-8 rounded-xl max-w-lg">
                <h1 className="font-bold text-4xl font-mono">Reset your password</h1>
                <div className="w-full mx-auto mt-4 bg-white" style={{height: 1}}></div>
                <p className="text-lg mt-4 text-center">Put your new password!</p>
                <div className="w-full mx-auto mt-4 bg-white" style={{height: 1}}></div>
                <input id="pass" type="password" className="px-2 text-black py-1 bg-white font-sans rounded-xl border-black border-2 w-full mt-8 text-center" placeholder="Password"/>
                <input id="pass2" type="password" className="px-2 text-black py-1 bg-white font-sans rounded-xl border-black border-2 w-full mt-8 text-center" placeholder="Repeat password"/>
                <button className='py-2 bg-gray-700 w-1/3 mt-4 hover:bg-gray-800 duration-300 rounded-lg' onClick={resetPass}>Submit</button>
                <p id="Error" className="text-red-600 text-lg font-bold mt-2"></p>
            </div>
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

export function getServerSideProps(ctx) {
    if (!("token" in ctx.query)) return redir("/")
    
    const recovery = require("../lib/recovery")

    if(!recovery.validToken(ctx.query["token"])) return redir("/")

    return {
        props: {
            username: recovery.getUser(ctx.query["token"]),
            token: ctx.query["token"]
        }
    }
}