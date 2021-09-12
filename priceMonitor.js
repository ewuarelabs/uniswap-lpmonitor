import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { userAction } from './getABI.js';
//import { config } from './config.js';
import { sendEmail } from './emailSender.js';
const lowerTick = process.env.lowerTick.split(",")
lowerTick = parseInt(lowerTick, 10)
const upperTick = process.env.upperTick.split(",")
upperTick = parseInt(upperTick, 10)
const etherscanApi = process.env.etherscanApiKey
const pairAddress = process.env.pairAddress

//if address is not defined, the ETH/USDC pair will be used
if (pairAddress == "") {
  pairAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
}

const aggregatorV3InterfaceABI = await userAction(pairAddress, etherscanApi);
const web3 = new Web3(process.env.provider);
const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);

const price = async () => {priceFeed.methods.latestRoundData().call()
    .then((roundData) => {
        priceFeed.methods.decimals().call()
        .then((dec) => {
            let decimals = new BigNumber(dec);      
            const latestPrice = +roundData.answer * 10**(-decimals)
            //console.log("Latest Round Data", latestPrice)
            return latestPrice
        })
    })
}

const pairPrice = await price();
for (let i=0; i<lowerTick.length; i++) {
    if (lowerTick[i] > pairPrice) {
        
        //You can edit this message and tailor it to anything of your choice
        message = `Your pair is currently below your ${lowerTick[i]} lower trading bound. 
            You've stopped earning trading fees`
        sendEmail("Uniswap LP position status", message)
    } 
}
for (let i=0; i<upperTick.length; i++) {
    if (upperTick[i] < pairPrice) {
       
        message = `Your pair is currently above your ${upperTick[i]} upper trading bound. 
            You've stopped earning trading fees`
        sendEmail("Uniswap LP position status", message)
    }
}



