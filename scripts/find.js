import { getPlayerDetails } from 'spider.js'
const settings = {
  keys: {
    serverMap: 'BB_SERVER_MAP',
  },
}

function getItem(key) {
  let item = localStorage.getItem(key)

  return item ? JSON.parse(item) : undefined
}

function localeHHMMSS(ms = 0) {
  if (!ms) {
    ms = new Date().getTime()
  }

  return new Date(ms).toLocaleTimeString()
}

function printPathToServer(servers, serverToFind) {
  if (serverToFind === 'home') return 'home'
  if (!servers[serverToFind]) return `-- Unable to locate ${serverToFind} --`

  const jumps = []

  let isParentHome = servers.parent === 'home'
  let currentServer = serverToFind

  while (!isParentHome) {
    jumps.push(servers[currentServer].parent)

    if (servers[currentServer].parent !== 'home') {
      currentServer = servers[currentServer].parent
    } else {
      isParentHome = true
    }
  }

  jumps.unshift(serverToFind)

  return jumps.reverse().join('; connect ')
}

/** @param {NS} ns **/ export async function main(ns) {
  ns.tprint(`[${localeHHMMSS()}] Starting find.js`)

  const serverToFind = ns.args[0]

  let hostname = ns.getHostname()

  if (hostname !== 'home') {
    throw new Exception('Run the script from home')
  }

  const serverMap = getItem(settings.keys.serverMap)

  if (serverToFind) {
    if (Object.keys(serverMap.servers).includes(serverToFind)) {
      ns.tprint(`[${localeHHMMSS()}] Path to ${serverToFind} found:`)
      ns.tprint(printPathToServer(serverMap.servers, serverToFind))
    } else {
      ns.tprint(`[${localeHHMMSS()}] Unable to find the path to ${serverToFind}`)
    }
  } else {
    ns.tprint(`[${localeHHMMSS()}] Common servers:`)

    const playerDetials = getPlayerDetails(ns)
    var currentLevels = playerDetials.hackingLevel
    var currentPorts = playerDetials.portHacks

    ns.tprint('now hackinglevels: ' + currentLevels + ' portHacks: ' + currentPorts)

    var currentHost = 'CSEC'
    var requiredLevels = ns.getServerRequiredHackingLevel(currentHost)
    var requiredPorts = ns.getServerNumPortsRequired(currentHost)
    var flag = currentLevels >= requiredLevels && currentPorts >= requiredPorts ? '√' : '×'
    var rootAccess = ns.hasRootAccess(currentHost)

    ns.tprint(`* CSEC (CyberSec faction)` + ' access: ' + rootAccess + ' hacking levels:' + requiredLevels + ' ports:' + requiredPorts + ' hackable:' + flag)
    ns.tprint(printPathToServer(serverMap.servers, 'CSEC') + '; backdoor;')
    ns.tprint('')

    currentHost = 'avmnite-02h'
    requiredLevels = ns.getServerRequiredHackingLevel(currentHost)
    requiredPorts = ns.getServerNumPortsRequired(currentHost)
    flag = currentLevels >= requiredLevels && currentPorts >= requiredPorts ? '√' : '×'
    rootAccess = ns.hasRootAccess(currentHost)

    ns.tprint(`* avmnite-02h (NiteSec faction)` + ' access: ' + rootAccess + ' hacking levels:' + requiredLevels + ' ports:' + requiredPorts + ' hackable:' + flag)
    ns.tprint(printPathToServer(serverMap.servers, 'avmnite-02h') + '; backdoor;')
    ns.tprint('')

    currentHost = 'I.I.I.I'
    requiredLevels = ns.getServerRequiredHackingLevel(currentHost)
    requiredPorts = ns.getServerNumPortsRequired(currentHost)
    flag = currentLevels >= requiredLevels && currentPorts >= requiredPorts ? '√' : '×'
    rootAccess = ns.hasRootAccess(currentHost)

    ns.tprint(`* I.I.I.I (The Black Hand faction)` + ' access: ' + rootAccess + ' hacking levels:' + requiredLevels + ' ports:' + requiredPorts + ' hackable:' + flag)
    ns.tprint(printPathToServer(serverMap.servers, 'I.I.I.I') + '; backdoor;')
    ns.tprint('')

    currentHost = 'run4theh111z'
    requiredLevels = ns.getServerRequiredHackingLevel(currentHost)
    requiredPorts = ns.getServerNumPortsRequired(currentHost)
    flag = currentLevels >= requiredLevels && currentPorts >= requiredPorts ? '√' : '×'
    rootAccess = ns.hasRootAccess(currentHost)

    ns.tprint(`* run4theh111z (Bitrunners faction)` + ' access: ' + rootAccess + ' hacking levels:' + requiredLevels + ' ports:' + requiredPorts + ' hackable:' + flag)
    ns.tprint(printPathToServer(serverMap.servers, 'run4theh111z') + '; backdoor;')
    ns.tprint('')
    ns.tprint(`[${localeHHMMSS()}] Looking for servers with coding contracts:`)
    Object.keys(serverMap.servers).forEach((hostname) => {
      const files = ns.ls(hostname)
      if (files && files.length) {
        const contract = files.find((file) => file.includes('.cct'))

        if (!!contract) {
          ns.tprint('')
          ns.tprint(`* ${hostname} has a coding contract(s)! Connect using:`)
          ns.tprint(printPathToServer(serverMap.servers, hostname) + `; run ${contract};`)
        }
      }
    })
    ns.tprint('')
    ns.tprint('Buy all hacks command:')
    ns.tprint('home; connect darkweb; buy BruteSSH.exe; buy FTPCrack.exe; buy relaySMTP.exe; buy HTTPWorm.exe; buy SQLInject.exe; home;')
    ns.tprint('')
  }
}
