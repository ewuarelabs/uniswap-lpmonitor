const axios = require('axios')
const sendEmail = require('./emailSender.js')
const lowerTick = process.env.lowerTick.split(",")
const upperTick = process.env.upperTick.split(",")

axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3', {
  query: `
  {
    bundles {
        id
        ethPriceUSD
        }
  }  
  `
})
.then((res) => {
    var ethPriceUSD = res.data.data.bundles[0].ethPriceUSD
    console.log(ethPriceUSD)
    for (let i=0; i<lowerTick.length; i++) {
        if (lowerTick[i] > ethPriceUSD) {
            console.log(lowerTick[i])
            //You can edit this message and tailor it to anything of your choice
            message = `ethPriceUSD is currently below your ${lowerTick[i]} lower trading bound. 
                You've stopped earning trading fees`
            sendEmail("Uniswap LP position status", message)
        } 
    }
    for (let i=0; i<upperTick.length; i++) {
        if (upperTick[i] < ethPriceUSD) {
            console.log(upperTick[i])
            message = `ethPriceUSD is currently above your ${upperTick[i]} upper trading bound. 
                You've stopped earning trading fees`
            sendEmail("Uniswap LP position status", message)
        }
    }
})
.catch((error) => {
  console.error(error)
})


