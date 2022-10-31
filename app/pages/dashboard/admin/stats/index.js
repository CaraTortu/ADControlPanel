import Head from 'next/head'
import React from 'react'
import { getInfo } from '../../../../lib/session.js'
import {Chart, ArcElement} from 'chart.js'
import NavBar from '../../../../components/NavBar.js'
import {Doughnut} from 'react-chartjs-2';

Chart.register(ArcElement);

export default function Home({ username, cpuUsage, cpuData, ramData, ramUsage, ramTotal, diskTotal, diskUsed }) {
    return (
        <div>
            <Head>
                <title>AD Control Panel</title>
                <meta name="description" content="Web app to manage your AD credentials" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <NavBar />

            <main className="h-screen flex flex-col items-center justify-center bg-gray-600 ml-20 p-4">
                <div className="absolute top-10">
                    <p className="text-5xl text-white text-center">System Statistics</p>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div id="cpuUsage" className="bg-gray-600 rounded-xl p-4 relative">
                        <p className="text-xl text-white text-center font-semibold">CPU Utilisation</p>
                        <div className="w-full flex justify-center items-center mt-4">
                            <div className="w-56"> 
                                <Doughnut data={cpuData} width={96} height={96} />
                            </div>
                            <p className='absolute text-white text-2xl'>{cpuUsage}%</p>
                        </div>
                    </div>
                    <div id="ramUsage" className="bg-gray-600 rounded-xl p-4 relative ">
                        <p className="text-xl text-white text-center font-semibold">RAM Utilisation</p>
                        <div className="w-full flex justify-center items-center mt-4">
                            <div className="w-56"> 
                                <Doughnut data={ramData} width={96} height={96} />
                            </div>
                            <p className='absolute text-white text-lg text-center'>{ramUsage}<br />----<br />{ramTotal}</p>
                        </div>
                    </div>
                    <div id="diskUsage" className="bg-gray-600 rounded-xl p-4 relative">
                        <p className="text-xl text-white text-center font-semibold">Disk Utilisation</p>
                        <div id="disks" className="w-full h-full flex flex-wrap relative">
                            <div className="w-5/12 mx-auto h-1/3 bg-gray-500 mt-4 rounded-lg border">
                                <p className="text-md text-white text-center px-3 mt-1">Total Space</p>
                                <div className="w-10/12 bg-gray-600 mx-auto mt-2 rounded-lg">
                                    <p id="totalSpace" className="text-sm py-1 text-white text-center px-3">{diskTotal} GB</p>
                                </div>
                            </div>
                            <div className="w-5/12 mx-auto h-1/3 bg-gray-500 mt-4 rounded-lg border">
                                <p className="text-md text-white text-center px-3 mt-1">Total Used</p>
                                <div className="w-10/12 bg-gray-600 mx-auto mt-2 rounded-lg">
                                    <p id="totalUsed" className="text-sm py-1 text-white text-center px-3">{diskUsed} GB</p>
                                </div>
                            </div>
                            <div className="w-5/12 mx-auto h-1/3 bg-gray-500 mb-4 rounded-lg border">
                                <p className="text-md text-white text-center px-3 mt-1">Mountpoint</p>
                                <div className="w-10/12 bg-gray-600 mx-auto mt-2 rounded-lg">
                                    <p className="text-md text-white text-center px-3">/</p>
                                </div>
                            </div>
                            <div className="w-5/12 mx-auto h-1/3 bg-gray-500 mb-4 rounded-lg border">
                                <p className="text-md text-white text-center px-3 mt-1">Disk Name</p>
                                <div className="w-10/12 bg-gray-600 mx-auto mt-2 rounded-lg">
                                    <p className="text-md text-white text-center px-3">/</p>
                                </div>
                            </div>
                            <div className="absolute inset-0 flex justify-center items-center mb-7 z-10">
                                <p id="RAMUsage" className="text-3xl text-white text-center">+</p>
                            </div>
                        </div>
                    </div>
                    <div id="network" className="bg-gray-600 rounded-xl p-4 relative ">
                        <p className="text-xl text-white text-center font-semibold">Interfaces</p>

                        <div id="disks" className="w-full h-full flex flex-wrap relative">
                            <div className="w-11/12 mx-4 my-4 mb-8 h-11/12 bg-gray-500 rounded-lg border">
                                <p className="text-md text-white text-center px-3 mt-1">ETH0</p>
                                <div className="mt-2 w-full h-full flex flex-wrap justify-center">
                                    <div className="bg-gray-600 w-10/12 px-auto rounded-lg h-1/4 flex justify-center items-center">
                                        <p id="addr" className="px-3 text-white text-md ">Address: 87.34.177.107</p>
                                    </div>
                                    <div className="bg-gray-600 w-10/12 px-auto mb-10 rounded-lg h-1/4 flex justify-center items-center">
                                        <p id="netmask" className="px-3 text-white text-md ">Netmask: 255.255.0.0</p>
                                    </div>
                                </div>
                            </div>
                        </div>
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

function getDataCPU(data) {

    let cpuColour

    if (data["cpu"] < 100/3) cpuColour = "rgb(0, 133, 0)"
    else if (data["cpu"] > 100/3 && data["cpu"] < 200/3) cpuColour = "rgb(133, 133, 0)"
    else cpuColour = "rgb(133, 0, 0)"

    return {
        label: 'CPU Usage',
        datasets: [{
            data: [data["cpu"], 100-data["cpu"]],
            backgroundColor: [
            cpuColour,
            'rgb(100,100,100)'
            ]
        }]
      }
}

function getDataRAM(data) {

    let ramColour

    const diff = data["ram"][0]*100/data["ram"][1]

    if (diff < 100/3) ramColour = "rgb(0, 133, 0)"
    else if (diff > 100/3 && diff < 200/3) ramColour = "rgb(133, 133, 0)"
    else ramColour = "rgb(133, 0, 0)"

    return {
        label: 'RAM Usage',
        datasets: [{
            data: [data["ram"][0], data["ram"][1]],
            backgroundColor: [
            ramColour,
            'rgb(100,100,100)'
            ]
        }]
      }
}

export async function getServerSideProps(context) {
    const cookie = require('cookie')
    const os = require('node-os-utils');

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

    let cpuUsage
    await os.cpu.usage().then(p => { cpuUsage = Math.floor(p) })

    let ramusage, ramtotal
    await os.mem.used().then(info => { ramusage = info["usedMemMb"]; ramtotal = info["totalMemMb"] })

    //let diskused, disktotal
    //await os.drive.used().then(info => { disktotal = info["totalGb"]; diskused = info["usedGb"] })

    const data = { 
        cpu: cpuUsage, 
        ram: [ramusage, ramtotal],
        //disk: [diskused, disktotal]
    }

    const cpuData = await getDataCPU(data)
    const ramData = await getDataRAM(data)

    return {
        props: {
            username: info["username"],
            cpuUsage: data["cpu"],
            cpuData: cpuData,
            ramData: ramData,
            ramUsage: String(Math.floor(data["ram"][0]/1000))+"GB",
            ramTotal: String(Math.floor(data["ram"][1]/1000))+"GB",
            //diskUsed: diskused,
            //diskTotal: disktotal
            diskUsed: "185",
            diskTotal: "913"
        }
    }
}