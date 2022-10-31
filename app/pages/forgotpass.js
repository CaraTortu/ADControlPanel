export default function forgotpass() {

    async function resetPass() {
        const username = document.getElementById("username").value
        const error = document.getElementById("Error")

        if (username.match(/^[A-F][0-1][0-9][0-9]$/) === null) {
            error.innerText = "Error: Please put a valid user"
            return
        }

        // Fetch our sendrecoveryemail API endpoint
        const response = await fetch("/api/user/sendrecoveryemail", {
            method: "POST",
            body: JSON.stringify({
                user: username
            }),
            headers: {"Content-Type": "application/json"}
        })
        
        // Convert the response to JSON
        const data = await response.json()

        if ("error" in data) {
            error.innerText = "Error: "+data.error
        } else {
            error.className = "text-green-500 font-bold text-lg mt-2"
            error.innerText = "Reset email sent!"
        }
    }

    return (
        <div className='h-screen w-full login flex items-center justify-center text-white text-center'>
            <div className="bg-gray-600 bg-opacity-50 border-2 border-blue-700 backdrop-blur-lg py-4 px-8 rounded-xl max-w-lg">
                <h1 className="font-bold text-4xl font-mono">Reset your password</h1>
                <div className="w-full mx-auto mt-4 bg-white" style={{height: 1}}></div>
                <p className="text-lg mt-4 text-center">Put your username here and we will send a password reset email!</p>
                <div className="w-full mx-auto mt-4 bg-white" style={{height: 1}}></div>
                <input id="username" type="text" className="px-2 text-black py-1 bg-white font-sans rounded-xl border-black border-2 w-full mt-8 text-center" placeholder="A037" />
                <button className='py-2 bg-gray-700 w-1/3 mt-4 hover:bg-gray-800 duration-300 rounded-lg' onClick={resetPass}>Submit</button>
                <p id="Error" className="text-red-600 text-lg font-bold mt-2"></p>
            </div>
        </div>
    )
}