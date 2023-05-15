const { readdir, readFile, writeFile } = require('fs/promises')
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
    return (await cmd('ps', source)).data
}

const root = 'workspaces'

async function main(){    
    const dirs = await getDirectories(root)
    
    const states = await Promise.all(
        dirs.map(async (name) => {
            return await directoryState(`${root}/${name}`)
        })
    )
    
    var obj = {};
    dirs.forEach((key, i) => obj[key] = states[i]);
    console.log(obj);
}

async function readReadme(name){
    const data = await readFile(`${root}/${name}/README`, "utf8")
    console.log(data)
}


async function writeReadme(name, txt){
    await writeFile(`${root}/${name}/README`, txt)
}

main()
readReadme('ika')
writeReadme('puf', 'hola ;)')