const settings = {
    keys: {
        serverMap: 'BB_SERVER_MAP',
    },
}
function getItem(key) {
    let item = localStorage.getItem(key)

    return item ? JSON.parse(item) : undefined
}

const excluedFiles = ['start.js', 'rmfile.js']
/** @param {NS} ns **/
export async function main(ns) {
    const servers = getItem(settings.keys.serverMap).servers;
    ns.exec('killAll.js', 'home', 1)
    Object.keys(servers).forEach((server) => {
        const files = ns.ls(server)
        for (const file of files){
            if (file.endsWith('js') && !excluedFiles.includes(file)){
                ns.rm(file, server)
            }
        }
    })

}