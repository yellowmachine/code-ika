const { readdir, readFile, writeFile } = require('fs/promises')
const { v2: compose } = require('docker-compose')
const path = require('path')
const DockerEvents = require("docker-events")
const Dockerode = require('dockerode');

var emitter = new DockerEvents({
    docker: new Dockerode({socketPath: '/var/run/docker.sock'}),
});

function startEmitter(){
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

async function readReadme(name){
    return await readFile(`${root}/${name}/README`, "utf8")
}


async function writeReadme(name, txt){
    await writeFile(`${root}/${name}/README`, txt, "utf8")
}

async function upWorkspace(workspace){
    await cmd('upAll', workspace)
}


async function downWorkspace(workspace){
    await cmd('down', workspace)
}

async function main(){
    const x = await getStates()
    console.log(x)
}

main()

//readReadme('ika')
//writeReadme('puf', 'hola ;)')