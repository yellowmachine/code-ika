const { readdir } = require('fs/promises')
const { v2: compose } = require('docker-compose')
const path = require('path')

async function cmd(cmd, source, options){
    try{
        const res = await compose[cmd]({
            cwd: path.join(source),
            commandOptions: options
        })
        return res
    }
    catch(err){
        console.log(err)
    }
}

const getDirectories = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const directoryState = async (source) => {
    return await cmd('ps', source)
}

async function main(){
    const root = 'workspaces'
    const dirs = await getDirectories(root)
    
    const states = await Promise.all(
        dirs.map(async (name) => {
            const v = await directoryState(`${root}/${name}`)
            return v.data
        })
    )
    
    var obj = {};
    dirs.forEach((key, i) => obj[key] = states[i]);
    console.log(obj);
}

main()