import fetch from "node-fetch";

export const userAction = async (pairAddress, etherscanApi) => {
    const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${pairAddress}&apikey=${etherscanApi}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const myJson = await response.json(); 
    let abi = myJson.result;
    
    abi = JSON.parse(abi)
  return abi
  }
//userAction() 