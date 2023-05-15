const { readdir, readFile, writeFile, stat, rm } = require('fs/promises')
const { v2: compose } = require('docker-compose')
const path = require('path')
const DockerEvents = require("docker-events")
const Dockerode = require('dockerode');
const { EventEmitter } = require('node:events');

const ROOT = 'workspaces'

const workspaceEmitter = new EventEmitter();

workspaceEmitter.on('event', (msg) => console.log('evento', msg))

function startEmitter(){
    const emitter = new DockerEvents({
        docker: new Dockerode({socketPath: '/var/run/docker.sock'}),
    });

    emitter.start();

    /*
    emitter.on("connect", function() {
        console.log("connected to docker api");
    });

    emitter.on("disconnect", function() {
        console.log("disconnected to docker api; reconnecting");
    });
    */

    emitter.on("_message", function(message) {
        workspaceEmitter.emit('event', message)
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

async function read(source){
    return await readFile(source, "utf8")
}

async function readReadme(name){
    return await read(`${ROOT}/${name}/README`)
}

async function readSpecification(name){
    return await read(`${ROOT}/${name}/docker-compose.yml`)
}

async function write(dest, txt){
    await writeFile(dest, txt, "utf8")
}

async function writeReadme(name, txt){
    await write(`${ROOT}/${name}/README`, txt)
}

async function writeSpecification(name, txt){
    await write(`${ROOT}/${name}/docker-compose.yml`, txt)
}

/// WORKSPACE

const getWorkspaces = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

async function getStates(){    
    const dirs = await getWorkspaces(ROOT)
    
    const states = await Promise.all(
        dirs.map(async (name) => {
            return await getWorkspaceState(`${ROOT}/${name}`)
        })
    )
    
    var obj = {};
    dirs.forEach((key, i) => obj[key] = states[i]);
    return obj
}

const getWorkspaceState = async (workspace) => {
    return (await cmd('ps', workspace)).data
}

async function getWorkspace(name){
    const readme = await readReadme(name)
    const specification = await readSpecification(name)
    return {readme, specification}
}

async function isWorkspace(name){
    const err = await stat(`${ROOT}/${name}`)
    if(!err) return true
    else return false
}

async function upWorkspace(workspace){
    await cmd('upAll', `${ROOT}/${workspace}`)
}

async function downWorkspace(workspace){
    await cmd('down', `${ROOT}/${workspace}`)
}

async function createWorkspace(name, specification, readme){
    if(isWorkspace(name)) throw "Workspace already exists"
    await writeReadme(name, readme)
    await writeSpecification(name, specification)
}

async function updateWorkspace(name, specification, readme){
    if(!isWorkspace(name)) throw "Workspace doesn't exist"
    await writeReadme(name, readme)
    await writeSpecification(name, specification)
}

async function deleteWorkspace(name){
    if(!isWorkspace(name)) throw "Workspace doesn't exist"
    await downWorkspace(name)
    await rm(`${ROOT}/${name}`, { recursive: true, force: true });
}

/// END WORKSPACE

// MAIN, testing API

async function main(){
    const stop = startEmitter()
    const x = await getStates()
    console.log(x)

    const w = await getWorkspace('ika')
    console.log(w)
    await upWorkspace('ika')
    await downWorkspace('ika')
    stop()
}

main()
