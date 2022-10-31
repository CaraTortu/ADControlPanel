import Head from 'next/head'
import Script from 'next/script'
import { useEffect } from 'react'
import { getInfo } from '../lib/session.js'

export default function Home() {

    // Returns the dimensions of the screen for the amount of tiles
    function getSize() {
        const size = 55;
  
        const columns = Math.floor(document.body.clientWidth / size);
        const rows = Math.floor(document.body.clientHeight / size);

        return [columns, rows]
    }

    async function login() {

        // Get the username and password we set
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value
        const error = document.getElementById("error")

        if (username === "" || password === "") {
            error.innerHTML = "Incorrect username or password"
            return
        }

        // Fetch our login API endpoint
        const response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
                user: username,
                passwd: password
            }),
            headers: {"Content-Type": "application/json"}
        })
        
        // Convert the response to JSON
        const data = await response.json()

        if ("error" in data) {
            // Show the error to the user
            error.innerHTML = data.error
        } else {

            // Hide login and show redirect
            document.getElementById("Login").classList.add("hidden")
            document.getElementById("Success").classList.remove("hidden")

            // Get dimensions for the animation
            const size = getSize()
            const columns = size[0], rows = size[1]
            
            // Animate the background
            anime({
                targets: ".tile",
                opacity: 0,
                delay: anime.stagger(40, {
                  grid: [columns, rows],
                  from: Math.floor(rows*columns*0.5) // Center or close to it
                })
            });

            // Sleep for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Redirect to your dashboard
            switch (data["perm"]) {
                case 0: location.href = "/dashboard/admin"
                case 1: location.href = "/dashboard/student"
                case 2: location.href = "/dashboard/teacher"
            }
        }
        
    }

    useEffect(() => {

        // Check for enter key pressed to submit
        document.addEventListener("keypress", (e) => {
            if (e.code !== "Enter") return
            login()
        })

        // Get the tiles object and the amount of tiles
        const wrapper = document.getElementById("tiles");
        let size = getSize()

        // Configure CSS with the tile size
        wrapper.style.setProperty("--columns", size[0]);
        wrapper.style.setProperty("--rows", size[1]);

        // Calculate total tiles
        size = size[0]*size[1]

        // Add the tiles to our object
        let tile 
        for (let i = 0; i<size; i++) {
            tile = document.createElement("div")
            tile.classList.add("tile")
            tile.style.opacity = 1
            wrapper.appendChild(tile)
        }
    }, [])

    return (
        <div>
            <Head>
                <title>AD Control Panel</title>
                <meta name="description" content="Web app to manage your AD credentials" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="h-screen w-full flex flex-col items-center login">
                <div id="tiles">
                </div>
                <div id="Login" className='absolute z-10 rounded-lg maindiv border-blue-600 bg-gray-900 bg-opacity-70 border-2 duration-300'>
                    <div className='p-4 rounded-xl flex flex-col items-center'>
                        <h1 className='text-4xl font-script font-bold px-6'>Username Management Panel</h1>
                        <div className='flex flex-col gap-1 mt-10 w-full px-6 items-center'>
                            <p className='w-10/12 text-white'>Username:</p>
                            <input id="username" type="text" className='px-2 py-1 font-semibold rounded-lg w-10/12'/>
                        </div>
                        <div className='flex flex-col gap-1 mt-4 w-full px-6 items-center'>
                            <p className='w-10/12 text-white'>Password:</p>
                            <input id="password" type="password" className='px-2 py-1 font-semibold rounded-lg w-10/12' />
                            <a href="/forgotpass" className="text-md text-white w-full text-end px-10 hover:text-gray-300">Forgot Password?</a>
                        </div>
                        <div className='flex flex-col gap-1 mt-10 w-full px-6 items-center text-white'>
                            <button className='py-2 bg-gray-700 w-1/2 hover:bg-gray-800 duration-300 rounded-lg' onClick={login}>Submit</button>
                        </div>
                        <div className='mt-2 w-full text-center text-white flex justify-center'>
                            <p id="error" className='w-10/12 text-red-600 font-semibold text-lg'></p>
                        </div>
                    </div>
                </div>
                <div id="Success" className='hidden absolute z-10 rounded-lg maindiv bg-gray-800 bg-opacity-80 border-2 border-blue-600 duration-300'>
                    <div className='p-4 rounded-xl flex flex-col items-center'>
                        <h1 className='text-4xl text-green-300 font-mono font-bold px-6'>Redirecting you...</h1>
                    </div>
                </div>
            </main>

            <Script src="/js/anime.min.js" strategy="beforeInteractive" />
        </div>
    )
}

// Exit normally
function normalReturn() {
    return {
        props: {}
    }
}

// Redirect to a site we specify
function redir(to) {
    return {
        redirect: {
            destination: to
        }
    }
}

export async function getServerSideProps(context) {
    // Get the cookies library
    const cookie = require('cookie')

    // No cookies set, load normally since the user isnt signed in
    if (context.req.headers.cookie === undefined) return normalReturn()

    // Get the cookies
    const sess = cookie.parse(context.req.headers.cookie)

    // If session is not set in our cookies, it means we arent logged in. Load normally
    if (!("sess" in sess)) return normalReturn()

    // Get the user information from our cookie
    const info = getInfo(sess.sess)

    // If the cookie is invalid, load normally
    if (info === false) {
        // Remove invalid cookie
        context.res.setHeader('Set-Cookie', 'sess=NeverGonnaGiveYouUp; path=/; Max-Age=0')
        return normalReturn()
    }

    // Cookie is valid, redirect to the dashboard since they do not need to log in
    if (info["perm"] == "1")      return redir("/dashboard/student")
    else if (info["perm"] == "0") return redir("/dashboard/admin")
    else                          return redir("/dashboard/teacher")
}
