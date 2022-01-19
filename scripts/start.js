/** @param {NS} ns **/export async function main(ns) {
    if (ns.getHostname() !== "home") {
      throw new Exception("Run the script from home");
    }
  
    await ns.wget(
      `https://raw.githubusercontent.com/zyh66615/bitburner-something/main/scripts/initHacking.js?ts=${new Date().getTime()}`,
      "initHacking.ns"
    );
    ns.spawn("initHacking.ns", 1);
  }