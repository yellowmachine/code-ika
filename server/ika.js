const { readdir, readFile, writeFile } = require('fs/promises')
const { v2: compose } = require('docker-compose')
const path = require('path')

async function cmd(cmd, workspace, options){
    try{
        const res = await compose[cmd]({
            cwd: path.join(workspace),
            commandOptions: options
        })
        return res
    }
    catch(err){
        console.log(err)
        throw err
    }
}

const getWorkspaces = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const getWorkspaceState = async (workspace) => {
    return (await cmd('ps', workspace)).data
}

const root = 'workspaces'

async function getStates(){    
    const dirs = await getWorkspaces(root)
    
    const states = await Promise.all(
        dirs.map(async (name) => {
            return await getWorkspaceState(`${root}/${name}`)
        })
    )
    
    var obj = {};
    dirs.forEach((key, i) => obj[key] = states[i]);
    return obj
}

async function readReadme(name){
    return await readFile(`${root}/${name}/README`, "utf8")
}


async function writeReadme(name, txt){
    await writeFile(`${root}/${name}/README`, txt, "utf8")
}

async function up(workspace){
    await cmd('upAll', workspace)
}


async function down(workspace){
    await cmd('down', workspace)
}

async function main(){
    const x = await getStates()
    console.log(x)
}

main()

//readReadme('ika')
//writeReadme('puf', 'hola ;)')