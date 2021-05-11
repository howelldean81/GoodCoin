/*
-------------------------------------------------------------------------------------
* Endpoints                                                                         *
-------------------------------------------------------------------------------------
* List                                  |   Live                                    *
https://api.coinlayer.com/api/list      |   http://api.coinlayer.com/api/live       *           
                                                                                    *
* Historical                            |   Convert - Not supported on free...      *
http://api.coinlayer.com/api/YYYY-MM-DD |   http://api.coinlayer.com/api/convert    *
                                                                                    *
* Timeframe - Not supported on free...  |   Change - Not supported on free...       *
http://api.coinlayer.com/api/timeframe  |   http://api.coinlayer.com/api/change     *
-------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------
* Endpoint Example                                                                  *
-------------------------------------------------------------------------------------
? Live      |   http://api.coinlayer.com/api/live?access_key=key                    ?
-------------------------------------------------------------------------------------
? My Key    |   a1f4a05d8a5c89bee72e0f45aa1082d4                                    ?
-------------------------------------------------------------------------------------
*/

// API stuff
const apiKeyAppend = "?access_key=a1f4a05d8a5c89bee72e0f45aa1082d4"
const apiExpand = "&expand=1"
const liveTickerAll = "https://api.coinlayer.com/api/live"
const listTickerAll = "https://api.coinlayer.com/api/list"

// Historical - Chain this with key and getLastMonth()
const hisTickerAll = "https://api.coinlayer.com/api/"

// Nav buttons
const homeButton = document.getElementById('home-button')
const popularButton = document.getElementById('popular')
const allCoinsButton = document.getElementById('all-coins')
const top3Button = document.getElementById('top-3')
const searchButton = document.getElementById('search-button')

// Div
const fluidDiv = document.getElementById('data-container')

// Dollar formatter
const usMoney = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

function homePage() {
    // Empty contents of 'data-container'
    fluidDiv.innerHTML = ""

    const cardBanner = document.createElement('div')
    const cardContainer = document.createElement('div')

    fluidDiv.appendChild(cardBanner)
    cardBanner.id = 'card-banner'
    cardBanner.className = 'cardBanner'
    cardBanner.innerHTML = 'Welcome to Goodcoin, home of the Goodcoin!'

    fluidDiv.appendChild(cardContainer)
    cardContainer.id = 'card-container'
    cardContainer.className = 'cardContainer'

    // Get and manipulate JSON from LIVE endpoint
    async function getChart() {
        try {
            const res = await fetch('https://api.coinlayer.com/api/live?access_key=a1f4a05d8a5c89bee72e0f45aa1082d4&expand=1')
            const data = await res.json()
            let newArr = []
            let finalArr = []
            for (names in data.rates) {
                Object.entries(data.rates).forEach(i => {
                    let obj = i[1]
                    if (i[0] === names) {
                        Object.assign(obj, {
                            names: names
                        })
                        newArr.push(obj)
                        finalArr = newArr.map((i) => (
                            {
                                Name: i.names,
                                Rate: i.rate,
                                Cap: i.cap,
                                Volume: Math.round(parseInt(i.vol)),
                            }
                        ))
                    }
                })
            }
            allCoins = finalArr.sort((cur, prev) => prev.Rate - cur.Rate)
            displayResults(allCoins)
        } catch (err) {
            console.log(err);
        }
    }

    getChart()

    function displayResults(coins) {
        coins.forEach((coin) => {
            const coinCard = document.createElement('div')
            const coinHeader = document.createElement('h1')
            const coinText = document.createElement('p')
            const coinIconDiv = document.createElement('div')

            coinCard.className = 'coinCardDiv'

            coinHeader.innerHTML = `${coin.Name}`
            coinText.innerHTML = `${usMoney.format(coin.Rate)}`

            async function getCoin() {
                try {
                    // Get icon and build elements
                    const res = await fetch(listTickerAll + apiKeyAppend)
                    const data = await res.json()

                    let coinIcon = data.crypto[coin.Name].icon_url
                    console.log(coinIcon)

                    coinIconDiv.innerHTML = `<img class="iconBox" src="${coinIcon}" alt="">`

                } catch (err) {
                    console.log(err);
                }
            }
            getCoin()

            cardContainer.appendChild(coinCard)
            coinCard.appendChild(coinHeader)
            coinCard.appendChild(coinText)
            coinCard.appendChild(coinIconDiv)

        })

    }
}

document.body.onload = function() {
    homePage()
}

homeButton.onclick = function() {
    homePage()
}

allCoinsButton.onclick = function () {
    // Empty contents of data container
    fluidDiv.innerHTML = ""

    // Create the table skeleton
    const createTable = document.createElement('table')
    const createTHead = document.createElement('thead')
    const createRow = document.createElement('tr')
    const createHeadingIcon = document.createElement('th')
    const createHeadingSym = document.createElement('th')
    const createHeadingName = document.createElement('th')
    const createHeadingCost = document.createElement('th')
    const createHeadingLast = document.createElement('th')
    const createHeadingCap = document.createElement('th')
    const createTBody = document.createElement('tbody')

    // Create table in data container
    fluidDiv.appendChild(createTable)

    createTable.className = 'annoyingLookingTable'
    createTable.id = 'loudTable'

    // Create the table header
    let loudTable = document.getElementById('loudTable')

    loudTable.appendChild(createTHead)
    loudTable.appendChild(createTBody)
    createTBody.id = 'coinChart'
    createTBody.className = 'annoyingLookingTable'
    createTHead.appendChild(createRow)
    createRow.appendChild(createHeadingIcon)
    createHeadingSym.id = 'head-icon'
    createHeadingSym.scope = 'col'
    createHeadingSym.innerHTML = ''
    createRow.appendChild(createHeadingSym)
    createHeadingSym.id = 'head-sym'
    createHeadingSym.scope = 'col'
    createHeadingSym.innerHTML = '<button id="head-sym-button" class="tableButton">Symbol</button>'
    createRow.appendChild(createHeadingCost)
    createHeadingCost.id = 'head-cost'
    createHeadingCost.scope = 'col'
    createHeadingCost.innerHTML = '<button id="head-cost-button" class="tableButton">Price</button>'
    createRow.appendChild(createHeadingName)
    createHeadingName.id = 'head-high'
    createHeadingName.scope = 'col'
    createHeadingName.innerHTML = '<button id="head-high-button" class="tableButton">24 Hour High</button>'
    createRow.appendChild(createHeadingLast)
    createHeadingLast.id = 'head-low'
    createHeadingLast.scope = 'col'
    createHeadingLast.innerHTML = '<button id="head-low-button" class="tableButton">24 Hour Low</button>'
    createRow.appendChild(createHeadingCap)
    createHeadingCap.id = 'head-cap'
    createHeadingCap.scope = 'col'
    createHeadingCap.innerHTML = '<button id="head-cap-button" class="tableButton">Market Cap</button>'

    // Define table buttons
    const sortSymButton = document.getElementById('head-sym-button')
    const sortCostButton = document.getElementById('head-cost-button')
    const sortHighButton = document.getElementById('head-high-button')
    const sortLowButton = document.getElementById('head-low-button')
    const sortCapButton = document.getElementById('head-cap-button')

    // Get and manipulate JSON from LIVE endpoint
    async function getChart() {
        try {
            const res = await fetch('https://api.coinlayer.com/api/live?access_key=a1f4a05d8a5c89bee72e0f45aa1082d4&expand=1')
            const data = await res.json()
            let newArr = []
            let finalArr = []
            for (names in data.rates) {
                Object.entries(data.rates).forEach(i => {
                    let obj = i[1]
                    if (i[0] === names) {
                        Object.assign(obj, {
                            names: names
                        })
                        newArr.push(obj)
                        finalArr = newArr.map((i) => (
                            {
                                Name: i.names,
                                Rate: i.rate,
                                High: i.high,
                                Low: i.low,
                                Cap: i.cap,
                                Volume: Math.round(parseInt(i.vol)),
                            }
                        ))
                    }
                })
            }
            displayResults(finalArr)

            sortSymButton.onclick = function () {
                finalArr.sort((a, b) => {
                    if (b.Name > a.Name)
                    return -1
                    if (b.Name < a.Name)
                    return 1
                    return 0
                })
                displayResults(finalArr)
            }

            sortCostButton.onclick = function () {
                finalArr.sort((cur, prev) => prev.Rate - cur.Rate)
                displayResults(finalArr)
            }

            sortHighButton.onclick = function () {
                finalArr.sort((cur, prev) => prev.High - cur.High)
                displayResults(finalArr)
            }

            sortLowButton.onclick = function () {
                finalArr.sort((cur, prev) => prev.Low - cur.Low)
                displayResults(finalArr)
            }

            sortCapButton.onclick = function () {
                finalArr.sort((cur, prev) => prev.Cap - cur.Cap)
                displayResults(finalArr)
            }
        } catch (err) {
            console.log(err);
        }
    }

    getChart()

    function displayResults(coins) {
        let coinChart = document.getElementById('coinChart')
        coinChart.innerHTML = ""

        coins.map(coins => {
            let coinRow = document.createElement('tr')
            let cell1 = coinRow.insertCell()
            let cell2 = coinRow.insertCell()
            let cell3 = coinRow.insertCell()
            let cell4 = coinRow.insertCell()
            let cell5 = coinRow.insertCell()
            let cell6 = coinRow.insertCell()

            async function getCoin() {
                try {
                    // Get icon and build elements
                    const res = await fetch(listTickerAll + apiKeyAppend)
                    const data = await res.json()

                    let coinIcon = data.crypto[coins.Name].icon_url
                    console.log(coinIcon)

                    cell1.innerHTML = `<img class="smallIconBox" src="${coinIcon}" alt="">`                    
                } catch (err) {
                    console.log(err);
                }
            }
            getCoin()

            cell2.innerText = `${coins.Name}`
            cell3.innerText = `${usMoney.format(coins.Rate)}`
            cell4.innerText = `${usMoney.format(coins.High)}`
            cell5.innerText = `${usMoney.format(coins.Low)}`
            cell6.innerHTML = `${usMoney.format(coins.Cap)}`

            coinChart.appendChild(coinRow)
        })
    }
}

popularButton.onclick = function () {
    // Empty contents of data container
    fluidDiv.innerHTML = ""

    // Create the table skeleton
    const createTable = document.createElement('table')
    const createTHead = document.createElement('thead')
    const createRow = document.createElement('tr')
    const createHeadingIcon = document.createElement('th')
    const createHeadingSym = document.createElement('th')
    const createHeadingCost = document.createElement('th')
    const createHeadingCap = document.createElement('th')
    const createHeadingVol = document.createElement('th')
    const createTBody = document.createElement('tbody')

    // Create table in data container
    fluidDiv.appendChild(createTable)

    createTable.className = 'annoyingLookingTable'
    createTable.id = 'loudTable'

    // Create the table header
    let loudTable = document.getElementById('loudTable')

    loudTable.appendChild(createTHead)
    loudTable.appendChild(createTBody)
    createTBody.id = 'coinChart'
    createTBody.className = 'annoyingLookingTable'
    createTHead.appendChild(createRow)
    createRow.appendChild(createHeadingIcon)
    createHeadingSym.id = 'head-icon'
    createHeadingSym.scope = 'col'
    createHeadingSym.innerHTML = ''
    createRow.appendChild(createHeadingSym)
    createHeadingSym.id = 'head-sym'
    createHeadingSym.scope = 'col'
    createHeadingSym.innerHTML = '<button id="head-sym-button" class="tableButton">Symbol</button>'
    createRow.appendChild(createHeadingVol)
    createHeadingVol.id = 'head-vol'
    createHeadingVol.scope = 'col'
    createHeadingVol.innerHTML = '<button id="head-vol-button" class="tableButton">Volume</button>'
    createRow.appendChild(createHeadingCost)
    createHeadingCost.id = 'head-cost'
    createHeadingCost.scope = 'col'
    createHeadingCost.innerHTML = '<button id="head-cost-button" class="tableButton">Price</button>'
    createRow.appendChild(createHeadingCap)
    createHeadingCap.id = 'head-cap'
    createHeadingCap.scope = 'col'
    createHeadingCap.innerHTML = '<button id="head-cap-button" class="tableButton">Market Cap</button>'

    // Define table buttons
    const sortSymButton = document.getElementById('head-sym-button')
    const sortCostButton = document.getElementById('head-cost-button')
    const sortVolButton = document.getElementById('head-vol-button')
    const sortCapButton = document.getElementById('head-cap-button')

    // Get and manipulate JSON from LIVE endpoint
    async function getChart() {
        try {
            const res = await fetch('https://api.coinlayer.com/api/live?access_key=a1f4a05d8a5c89bee72e0f45aa1082d4&expand=1')
            const data = await res.json()
            let newArr = []
            let finalArr = []
            for (names in data.rates) {
                Object.entries(data.rates).forEach(i => {
                    let obj = i[1]
                    if (i[0] === names) {
                        Object.assign(obj, {
                            names: names
                        })
                        newArr.push(obj)
                        finalArr = newArr.map((i) => (
                            {
                                Name: i.names,
                                Rate: i.rate,
                                Cap: i.cap,
                                Volume: Math.round(parseInt(i.vol)),
                            }
                        ))
                    }
                })
            }

            topTenArr = finalArr.sort((cur, prev) => prev.Cap - cur.Cap).slice([0], [10])

            displayResults(topTenArr)

            sortSymButton.onclick = function () {
                topTenArr.sort((a, b) => {
                    if (b.Name > a.Name)
                    return -1
                    if (b.Name < a.Name)
                    return 1
                    return 0
                })
                displayResults(topTenArr)
            }

            sortVolButton.onclick = function () {
                topTenArr.sort((cur, prev) => prev.Volume - cur.Volume)
                displayResults(topTenArr)
            }

            sortCostButton.onclick = function () {
                topTenArr.sort((cur, prev) => prev.Rate - cur.Rate)
                displayResults(topTenArr)
            }

            sortCapButton.onclick = function () {
                topTenArr.sort((cur, prev) => prev.Cap - cur.Cap)
                displayResults(topTenArr)
            }
        } catch (err) {
            console.log(err);
        }
    }

    getChart()

    function displayResults(coins) {
        let coinChart = document.getElementById('coinChart')
        coinChart.innerHTML = ""

        coins.map(coins => {
            let coinRow = document.createElement('tr')
            let cell1 = coinRow.insertCell()
            let cell2 = coinRow.insertCell()
            let cell3 = coinRow.insertCell()
            let cell4 = coinRow.insertCell()
            let cell5 = coinRow.insertCell()

            async function getCoin() {
                try {
                    // Get icon and build elements
                    const res = await fetch(listTickerAll + apiKeyAppend)
                    const data = await res.json()

                    let coinIcon = data.crypto[coins.Name].icon_url
                    console.log(coinIcon)

                    cell1.innerHTML = `<img class="smallIconBox" src="${coinIcon}" alt="">`                    
                } catch (err) {
                    console.log(err);
                }
            }
            getCoin()

            cell2.innerHTML = `${coins.Name}`
            cell3.innerHTML = `${usMoney.format(coins.Volume)}`
            cell4.innerHTML = `${usMoney.format(coins.Rate)}`
            cell5.innerHTML = `${usMoney.format(coins.Cap)}`

            coinChart.appendChild(coinRow)
        })
    }
}

top3Button.onclick = function () {
    // Empty contents of 'data-container'
    fluidDiv.innerHTML = ""

    const cardBanner = document.createElement('div')
    const cardContainer = document.createElement('div')

    fluidDiv.appendChild(cardBanner)
    cardBanner.id = 'card-banner'
    cardBanner.className = 'cardBanner'
    cardBanner.innerHTML = 'Top 3 Coins by Market Cap'

    fluidDiv.appendChild(cardContainer)
    cardContainer.id = 'card-container'
    cardContainer.className = 'cardContainer'

    // Get and manipulate JSON from LIVE endpoint
    async function getChart() {
        try {
            const res = await fetch('https://api.coinlayer.com/api/live?access_key=a1f4a05d8a5c89bee72e0f45aa1082d4&expand=1')
            const data = await res.json()
            let newArr = []
            let finalArr = []
            for (names in data.rates) {
                Object.entries(data.rates).forEach(i => {
                    let obj = i[1]
                    if (i[0] === names) {
                        Object.assign(obj, {
                            names: names
                        })
                        newArr.push(obj)
                        finalArr = newArr.map((i) => (
                            {
                                Name: i.names,
                                Rate: i.rate,
                                Cap: i.cap,
                                Volume: Math.round(parseInt(i.vol)),
                            }
                        ))
                    }
                })
            }
            topThreeArr = finalArr.sort((cur, prev) => prev.Cap - cur.Cap).slice([0], [3])
            displayResults(topThreeArr)
        } catch (err) {
            console.log(err);
        }
    }

    getChart()

    function displayResults(coins) {
        coins.forEach((coin) => {
            const coinCard = document.createElement('div')
            const coinHeader = document.createElement('h1')
            const coinText = document.createElement('p')
            const coinIconDiv = document.createElement('div')

            coinCard.className = 'coinCardDiv'

            coinHeader.innerHTML = `${coin.Name}`
            coinText.innerHTML = `${usMoney.format(coin.Cap)}`

            async function getCoin() {
                try {
                    // Get icon and build elements
                    const res = await fetch(listTickerAll + apiKeyAppend)
                    const data = await res.json()

                    let coinIcon = data.crypto[coin.Name].icon_url
                    console.log(coinIcon)

                    coinIconDiv.innerHTML = `<img class="iconBox" src="${coinIcon}" alt="">`
                    
                } catch (err) {
                    console.log(err);
                }
            }
            getCoin()
            cardContainer.appendChild(coinCard)
            coinCard.appendChild(coinHeader)
            coinCard.appendChild(coinText)
            coinCard.appendChild(coinIconDiv)
        })
        
    }
}

searchButton.onclick = function() {
    // Empty contents of 'data-container'
    fluidDiv.innerHTML = ""
    
    const searchTerm = document.getElementById('search-box').value
    
    const cardBanner        = document.createElement('div')
    const cardContainer     = document.createElement('div')
    
    fluidDiv.appendChild(cardBanner)
    cardBanner.id           = 'card-banner'
    cardBanner.className    = 'cardBanner'
    cardBanner.innerHTML    = searchTerm

    fluidDiv.appendChild(cardContainer)
    cardContainer.id           = 'card-container'
    cardContainer.className    = 'cardContainer'
    
    async function getCoin() {
        try {
            // Get Today and build elements
            const res = await fetch(liveTickerAll + apiKeyAppend)
            const data = await res.json()
            const searchTerm = document.getElementById('card-banner').innerHTML
            let todayRate = data.rates[searchTerm]

            const infoCard = document.createElement('div')
            const todayPrice = document.createElement('h1')
            const infoTodayPrice = document.createElement('h2')
            
            infoCard.className = 'searchCardDiv'

            todayPrice.innerHTML = "Price"
            infoTodayPrice.innerHTML = `${usMoney.format(todayRate)}`

            // Get last month and build elements
            let lastMonth = new Date()
            lastMonth.setDate(lastMonth.getDate() - 30)
            const res2 = await fetch(hisTickerAll + lastMonth.toISOString().substring(0, 10) + apiKeyAppend)
            const data2 = await res2.json()
            
            let lastMonthRate = data2.rates[searchTerm]
            
            const lastMonthPrice = document.createElement('h1')
            const infoLastMonthPrice = document.createElement('h2')
            
            lastMonthPrice.innerHTML = "Last Month"
            infoLastMonthPrice.innerHTML = `${usMoney.format(lastMonthRate)}`

            // Get yesterday and build elements
            let yesterDay = new Date()
            yesterDay.setDate(yesterDay.getDate() -1)
            const res3 = await fetch(hisTickerAll + yesterDay.toISOString().substring(0, 10) + apiKeyAppend)
            const data3 = await res3.json()
            
            let yesterDayRate = data3.rates[searchTerm]
            
            const yesterDayPrice = document.createElement('h1')
            const infoYesterDayPrice = document.createElement('h2')

            yesterDayPrice.innerHTML = "Yesterday"
            infoYesterDayPrice.innerHTML = `${usMoney.format(yesterDayRate)}`
            
            // Get last Year's Price and build elements
            let lastYear = new Date()
            lastYear.setDate(lastYear.getDate() -365)
            const res4 = await fetch(hisTickerAll + lastYear.toISOString().substring(0, 10) + apiKeyAppend)
            const data4 = await res4.json()

            let lastYearRate = data4.rates[searchTerm]

            const lastYearPrice = document.createElement('h1')
            const infoLastYearPrice = document.createElement('h2')

            lastYearPrice.innerHTML = "Last Year"
            infoLastYearPrice.innerHTML = `${usMoney.format(lastYearRate)}`

            // Get 5 Year's Ago and build elements
            let fiveYears = new Date()
            fiveYears.setDate(fiveYears.getDate() -1825)
            const res5 = await fetch(hisTickerAll + fiveYears.toISOString().substring(0, 10) + apiKeyAppend)
            const data5 = await res5.json()

            let fiveYearsRate = data5.rates[searchTerm]

            const fiveYearsPrice = document.createElement('h1')
            const infoFiveYearsPrice = document.createElement('h2')

            fiveYearsPrice.innerHTML = "5 Years Ago"
            infoFiveYearsPrice.innerHTML = `${usMoney.format(fiveYearsRate)}`

            // Get icon and build elements
            const res6 = await fetch(listTickerAll + apiKeyAppend)
            const data6 = await res6.json()
            
            let coinIcon = data6.crypto[searchTerm].icon_url
            console.log(coinIcon)

            const iconBox = document.createElement('div')
            iconBox.innerHTML = `<img class="iconBox" src="${coinIcon}" alt="">`
            
            // Append elements to div
            infoCard.append(iconBox)
            cardContainer.appendChild(infoCard)
            infoCard.appendChild(todayPrice)
            infoCard.appendChild(infoTodayPrice)
            infoCard.appendChild(yesterDayPrice)
            infoCard.appendChild(infoYesterDayPrice)
            infoCard.appendChild(lastMonthPrice)
            infoCard.appendChild(infoLastMonthPrice)
            infoCard.appendChild(lastYearPrice)
            infoCard.appendChild(infoLastYearPrice)
            infoCard.appendChild(fiveYearsPrice)
            infoCard.appendChild(infoFiveYearsPrice)
            
        } catch (err) {
            console.log(err);
        }
    }
    
    getCoin()
}    