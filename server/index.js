const { v2: compose } = require('docker-compose')
const path = require('path')


async function cmd(cmd, options){
    try{
        const res = await compose[cmd]({
            cwd: path.join(__dirname),
            commandOptions: options
        })
        console.log(res.data)
    }
    catch(err){
        console.log(err)
    }
}

async function main(){
    await cmd('upAll')
    await cmd('ps')
}

main()