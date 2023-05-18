import { readdir, readFile, writeFile, stat, rm, mkdir } from 'fs/promises';
import { v2 as compose } from 'docker-compose';
import  path from 'path';
// @ts-ignore
import DockerEvents from "@direktspeed/docker-events";
import Dockerode from 'dockerode';
import { EventEmitter } from 'node:events';
import type { WORKSPACE } from './types'

const ROOT = "/home/miguel/dev/docker/code01/server/workspaces"

export const workspaceEmitter = new EventEmitter();

function startEmitter(){
    const emitter = new DockerEvents({
        docker: new Dockerode({socketPath: '/var/run/docker.sock'}),
    });

    emitter.start();

    emitter.on("start", function(message: string) {
        workspaceEmitter.emit('event:ps', getStates())
    });
      
    emitter.on("stop", function(message: string) {
        workspaceEmitter.emit('event:ps', getStates())
    });

    return emitter.stop
}

//startEmitter()

export async function cmd(cmd: "ps" | "upAll" | "down" | "config", workspace: string, options?: string[]){
    try{
        const res = await compose[cmd]({
            cwd: workspace,
            commandOptions: options
        })
        return res
    }
    catch(err){
        console.log(err)
        throw err
    }
}

async function read(source: string){
    return await readFile(source, "utf8")
}

async function readReadme(name: string){
    return await read(`${name}/README`)
}

async function readSpecification(name: string){
    return await read(`${name}/docker-compose.yml`)
}

async function write(dest: string, txt: string){
    await writeFile(dest, txt, "utf8")
}

async function writeReadme(name: string, txt: string){
    await write(`${name}/README`, txt)
}

async function writeSpecification(name: string, txt: string){
    await write(`${name}/docker-compose.yml`, txt)
}

/// WORKSPACE

export async function isValidConfig(name: string){
    return await cmd("config", name)
}

const getWorkspaces = async (source: string) =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

export async function getStates(){    
    const dirs = await getWorkspaces(ROOT)
    
    const states = await Promise.all(
        dirs.map(async (name) => {
            return await getWorkspaceState(name)
        })
    )

    return states
}

const getWorkspaceState = async (workspace: string) => {
    const p = path.join(ROOT, workspace)
    // @ts-ignore
    const services = (await cmd('ps', p)).data.services
    const readme = await readReadme(p)
    const specification = await readSpecification(p)
    const configError = (await cmd('config', p)).exitCode
    
    const ret: WORKSPACE = {
        workspace,
        readme,
        specification,
        isValid: configError === 0 ? true: false,
        services
    }

    return ret
}

async function getWorkspace(name: string){
    const readme = await readReadme(name)
    const specification = await readSpecification(name)
    return {readme, specification}
}

async function isWorkspace(name: string){
    const err = await stat(`${ROOT}/${name}`)
    if(!err) return true
    else return false
}

export async function upWorkspace(workspace: string){
    return await cmd('upAll', `${ROOT}/${workspace}`)
}

export async function downWorkspace(workspace: string){
    return await cmd('down', `${ROOT}/${workspace}`)
}

async function createWorkspace(name: string, specification: string, readme: string){
    if(await isWorkspace(name)) throw "Workspace already exists"
    await mkdir(`${ROOT}/${name}`)
    await writeReadme(name, readme)
    await writeSpecification(name, specification)
    return {done: true}
}

export async function saveWorkspace(name: string, specification: string, readme: string){
    if(! await isWorkspace(name)){
        return await createWorkspace(name, specification, readme)
    }else{
        await writeReadme(name, readme)
        await writeSpecification(name, specification)
        return {done: true}
    }
}

export async function deleteWorkspace(name: string){
    if(!isWorkspace(name)) throw "Workspace doesn't exist"
    await downWorkspace(name)
    await rm(`${ROOT}/${name}`, { recursive: true, force: true });
    return {done: true}
}

/// END WORKSPACE
