const { readdir, readFile, writeFile, stat, rm } = require('fs/promises')
const { v2: compose } = require('docker-compose')
const path = require('path')
const DockerEvents = require("docker-events")
const Dockerode = require('dockerode');

function startEmitter(){
    const emitter = new DockerEvents({
        docker: new Dockerode({socketPath: '/var/run/docker.sock'}),
    });

    emitter.start();

    emitter.on("connect", function() {
        console.log("connected to docker api");
    });

    emitter.on("disconnect", function() {
        console.log("disconnected to docker api; reconnecting");
    });

    emitter.on("_message", function(message) {
        console.log("got a message from docker: %j", message);
    });

    return emitter.stop
}

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

async function getWorkspace(name){
    const readme = readReadme(name)
    const specification = readSpecification(name)
    return {readme, specification}
}

async function readReadme(name){
    return await readFile(`${root}/${name}/README`, "utf8")
}

async function readSpecification(name){
    return await readFile(`${root}/${name}/docker-compose.yml`, "utf8")
}

async function write(dest, txt){
    await writeFile(`${dest}`, txt, "utf8")
}

async function writeReadme(name, txt){
    await write(`${root}/${name}/README`, txt)
}

async function writeSpecification(name, txt){
    await write(`${root}/${name}/docker-compose.yml`, txt)
}

async function isWorkspace(name){
    const err = await stat(`${root}/${name}`)
    if(!err) return true
    else return false
}

async function upWorkspace(workspace){
    await cmd('upAll', workspace)
}

async function downWorkspace(workspace){
    await cmd('down', workspace)
}

async function createWorkspace(name, specification, readme){
    if(isWorkspace(name)) throw "Workspace already exists"
    await writeReadme(name, readme)
    await writeSpecification(name, readme)
}

async function updateWorkspace(name, specification, readme){
    if(!isWorkspace(name)) throw "Workspace doesn't exist"
    await writeReadme(name, readme)
    await writeSpecification(name, readme)
}

async function deleteWorkspace(name){
    if(!isWorkspace(name)) throw "Workspace doesn't exist"
    await downWorkspace(name)
    await rm(`${root}/${name}`, { recursive: true, force: true });
}

async function main(){
    const stop = startEmitter()
    const x = await getStates()
    console.log(x)
    stop()
}

main()

//readReadme('ika')
//writeReadme('puf', 'hola ;)')