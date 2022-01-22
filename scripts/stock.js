/** @param {NS} ns **/
export async function main(ns) {
    ns.tprint("Starting script here");
    ns.disableLog('sleep');
    ns.disableLog('getServerMoneyAvailable');

    let stockSymbols = ns.stock.getSymbols(); // all symbols
    let portfolio = []; // init portfolio
    let cycle = 0;
    // ~~~~~~~You can edit these~~~~~~~~
    const forecastThresh = 0.6 // Buy above this confidence level (forecast%)
    const moneyCouldSpent = 0.2 * ns.getServerMoneyAvailable('home'); // max of cash to keep
    const profitPercent = 1.05
    const forecastSell = 0.25
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    ns.tprint("Starting run - Do we own any stocks?"); //Finds and adds any stocks we already own
    for (const stock of stockSymbols) {
        let pos = ns.stock.getPosition(stock);
        if (pos[0] > 0) {
            portfolio.push({ sym: stock, value: pos[1], shares: pos[0] })
            ns.tprint('Detected: ' + stock + ' quant: ' + pos[0] + ' avg price: ' + pos[1]);
        };
    };

    while (true) {
        let stockNum = stockSymbols.length
        for (const stock of stockSymbols) { // for each stock symbol
            if (portfolio.findIndex(obj => obj.sym === stock) !== -1) { //if we already have this stock
                let i = portfolio.findIndex(obj => obj.sym === stock); // log index of symbol as i
                if (ns.stock.getAskPrice(stock) >= portfolio[i].value * profitPercent) { // if the price is higher than what we bought it at +10% then we SELL
                    ns.tprint('sell stock because of profit enough')
                    sellStock(stock);
                }
                else if (ns.stock.getForecast(stock) < forecastSell) {
                    ns.tprint('sell stock because of forecastSell')
                    sellStock(stock);
                }
            }

            else if (ns.stock.getForecast(stock) >= forecastThresh) { // if the forecast is better than threshold and we don't own then BUY
                buyStock(stock, stockNum);
            }
        } // end of for loop (iterating stockSymbols)
        cycle++;
        if (cycle % 10 === 0) { ns.tprint('Cycle ' + cycle + ' Complete') };
        await ns.sleep(6000);
    } // end of while true loop

    function buyStock(stock, stockNum) {
        let stockPrice = ns.stock.getAskPrice(stock); // Get the stockprice
        let shares = stockBuyQuantCalc(stockPrice, stock, stockNum); // calculate the shares to buy using StockBuyQuantCalc

        if (shares < 0) {
            ns.tprint('No money for stock: ' + stock)
            return
        }

        if (ns.stock.getVolatility(stock) <= 0.1) { // if volatility is < 5%, buy the stock
            ns.stock.buy(stock, shares);
            ns.tprint('Bought: ' + stock + ' shares: ' + Math.round(shares) + ' price: ' + Math.round(stockPrice));

            portfolio.push({ sym: stock, value: stockPrice, shares: shares }); //store the purchase info in portfolio
        }
    }

    function sellStock(stock) {
        let position = ns.stock.getPosition(stock);

        let i = portfolio.findIndex(obj => obj.sym === stock); //Find the stock info in the portfolio
        ns.tprint('SOLD: ' + stock + 'shares: ' + portfolio.shares + ' price: ' + portfolio.value + 'earn: ' + (position[0] * position[1]) - (portfolio.shares * portfolio.value));
        portfolio.splice(i, 1); // Remove the stock from portfolio
        ns.stock.sell(stock, position[0]);

    };

    function stockBuyQuantCalc(stockPrice, stock, stockNum) { // Calculates how many shares to buy
        let calcShares = (moneyCouldSpent * (1 / stockNum)) / stockPrice;

        if (calcShares < 0) {
            return -1
        }
        let maxShares = ns.stock.getMaxShares(stock);

        if (calcShares > maxShares) {
            return maxShares
        }
        else { return calcShares }
    }
}