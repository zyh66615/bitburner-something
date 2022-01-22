const baseUrl = 'https://raw.githubusercontent.com/zyh66615/bitburner-something/main/scripts/'
const filesToDownload = [
  'common.js',
  'mainHack.js',
  'spider.js',
  'grow.js',
  'hack.js',
  'weaken.js',
  'playerServers.js',
  'killAll.js',
  'runHacking.js',
  'find.js',
  'contracter.js',
  'seeAllStock.js',
  'rmfile.js',
  'commitCrime.js',
  'getCrimeData.js',
  'getCrimeData2.js',
  'stock.js',
  'stockMaster4s.js',
]
const valuesToRemove = ['BB_SERVER_MAP']

function localeHHMMSS(ms = 0) {
  if (!ms) {
    ms = new Date().getTime()
  }

  return new Date(ms).toLocaleTimeString()
}

/** @param {NS} ns **/export async function main(ns) {
  ns.tprint(`[${localeHHMMSS()}] Starting initHacking.js`)

  let hostname = ns.getHostname()

  if (hostname !== 'home') {
    throw new Exception('Run the script from home')
  }

  for (let i = 0; i < filesToDownload.length; i++) {
    const filename = filesToDownload[i]
    const path = baseUrl + filename
    await ns.scriptKill(filename, 'home')
    await ns.rm(filename)
    await ns.sleep(200)
    ns.tprint(`[${localeHHMMSS()}] Trying to download ${path}`)
    await ns.wget(path + '?ts=' + new Date().getTime(), filename)
  }

  valuesToRemove.map((value) => localStorage.removeItem(value))

  ns.tprint(`[${localeHHMMSS()}] Spawning killAll.js`)
  ns.spawn('killAll.js', 1, 'runHacking.js')
}
