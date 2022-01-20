const commission = 100000
let stockSymbols

function localeHHMMSS(ms = 0) {
  if (!ms) {
    ms = new Date().getTime()
  }

  return new Date(ms).toLocaleTimeString()
}

function sellShorts(ns, stockSymbol) {
  const stockInfo = getStockInfo(ns, stockSymbol)
  const shortSellValue = ns.stock.sell(stockSymbol, stockInfo.sharesShort)

  if (shortSellValue) {
    ns.print(
      `[${localeHHMMSS()}][${stockSymbol}] Sold ${stockInfo.sharesShort} shorts for ${ns.nFormat(shortSellValue, '$0.000a')}. Profit: ${ns.nFormat(
        stockInfo.sharesLong * (stockInfo.avgPriceShort - shortSellValue) - 2 * commission,
        '$0.000a'
      )}`
    )
  }
}
/** @param {NS} ns **/
function sellLongs(ns, stockSymbol) {
  const stockInfo = getStockInfo(ns, stockSymbol)
  const longSellValue = ns.stock.sell(stockSymbol, stockInfo.sharesLong)

  if (longSellValue) {
    ns.print(
      `[${localeHHMMSS()}][${stockSymbol}] Sold ${stockInfo.sharesLong} longs for ${ns.nFormat(longSellValue, '$0.000a')}. Profit: ${ns.nFormat(
        stockInfo.sharesLong * (longSellValue - stockInfo.avgPriceLong) - 2 * commission,
        '$0.000a'
      )}`
    )
  }
}
/** @param {NS} ns **/
function getStockInfo(ns, stockSymbol) {
  const [sharesLong, avgPriceLong, sharesShort, avgPriceShort] = ns.stock.getPosition(stockSymbol)

  const stockAskPrice = ns.stock.getAskPrice(stockSymbol)
  const stockBidPrice = ns.stock.getBidPrice(stockSymbol)

  return {
    stockSymbol,
    sharesLong,
    avgPriceLong,
    stockAskPrice,
    sharesShort,
    avgPriceShort,
    stockBidPrice,
  }
}

/** @param {NS} ns **/export async function main(ns) {
  ns.disableLog('ALL')

  stockSymbols = ns.stock.getSymbols()
  stockSymbols.forEach((stockSymbol) => {
    sellLongs(ns, stockSymbol)
    sellShorts(ns, stockSymbol)
  })
}