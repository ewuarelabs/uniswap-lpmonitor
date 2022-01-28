import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { userAction } from './getABI.js';
import { sendEmail } from './emailSender.js';
import dotenv from 'dotenv';

const etherscanApi = process.env.etherscanApiKey

dotenv.config();

export async function getPairPrice(pairAddress) {

    const aggregatorV3InterfaceABI = await userAction(pairAddress, etherscanApi);
    const web3 = new Web3(process.env.provider);
    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, pairAddress);
    const roundData = await priceFeed.methods.latestRoundData().call()
    const dec = await priceFeed.methods.decimals().call()
    let decimals = new BigNumber(dec);
    let latestPrice = await parseInt(roundData.answer) * 10**(-decimals)
    return latestPrice;
}

export async function HandlePairs(pairAddresses)  {
    const pairPrice = await getPairPrice(pairAddresses);
    const cursor = (await Position.find({ "liquidityPositions.pairAddress": pairs })).forEach(async (position) => {
        if (parseInt(position.liquidityPositions.lowerTick, 10) > pairPrice) {
            
            let message = `Your pair is currently below your ${position.liquidityPositions.lowerTick} lower trading bound. 
                You've stopped earning trading fees`
            let htmlMessage = `<p>Your pair is currently below your ${position.liquidityPositions.lowerTick} lower trading bound. 
                You've stopped earning trading fees</p>`
            sendEmail("Uniswap LP position status", message, htmlMessage)
        } 
        if (parseInt(position.liquidityPositions.upperTick, 10) < pairPrice) {
        
            let message = `Your pair is currently above your ${position.liquidityPositions.upperTick} upper trading bound. 
                You've stopped earning trading fees`
            let htmlMessage = `<p>Your pair is currently above your ${position.liquidityPositions.upperTick} upper trading bound. 
                You've stopped earning trading fees</p>`
            sendEmail("Uniswap LP position status", message, htmlMessage)
        }
    });
}