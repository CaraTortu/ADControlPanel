import fs from 'fs'
import Config from './config';

const config = new Config()

// Prevents LFI: https://www.acunetix.com/blog/articles/local-file-inclusion-lfi/
function cleanPath(path) {
    while (path.includes("../") || path.includes("..\\") ) {
        path.replace("../", "").replace("..\\", "")
    }
    return path
}

// Reads the files inside a folder
export function readFiles(user) {
    return fs.readdirSync(config.SMBPath+user)
}

// Check if a files exists
export function fileExists(user, file) {
    file = cleanPath(file)
    return fs.existsSync(config.SMBPath+user+"/"+file)
}

// Reads the contents of a file and returns it
export function getContents(user, file) {
    file = cleanPath(file)
    return fs.readFileSync(config.SMBPath+user+"/"+file).toString("utf-8")    
}

// Deletes the file
export function deleteFile(user, file) {
    file = cleanPath(file)
    return fs.unlinkSync(config.SMBPath+user+"/"+file)
}

// Delete a directory
export function deleteDirectory(user, file) {
    file = cleanPath(file)
    return fs.rmSync(config.SMBPath+user+"/"+file, { recursive: true, force: true})
}

// Resets the user directory
export async function resetDirectory(user) {
    // Delete the whole folder
    fs.rmSync(config.SMBPath+user+"/", { recursive: true, force: true})
    // Sleep for 1 second to give the filesystem time to refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Create the user's folder again
    return fs.mkdirSync(config.SMBPath+user)
}