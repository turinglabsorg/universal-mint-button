import _ from 'lodash';
import Web3 from "web3";
import Web3Modal, { isMobile } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
let web3
let account
let balance
let isMinting = false

const networks = {
    ethereum: 1,
    rinkeby: 4,
    mumbai: 80001,
    polygon: 137,
    ganache: 5777
}


const el = document.getElementById('um-button');
if (el === null) {
    console.warn('um-button not found, can\'t init minting element.')
} else {
    if (ABI !== undefined) {
        console.log('ABI found, init process completed!')
        el.addEventListener("click", connect, false);
    } else {
        console.warn('ABI not found, please include it in your web page.')
    }
}

async function connect() {
    let network = 'ethereum'
    // Checking if different network was chosen
    if (el.getAttribute('network') !== undefined) {
        network = el.getAttribute('network')
    }
    console.log('Connecting using network: ' + network)
    // Checking if infura exists for WalletConnect
    let providerOptions = {}
    if (el.getAttribute('infura') !== undefined) {
        providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: el.getAttribute('infura'),
                },
            },
        }
    }
    // Instantiating Web3Modal
    const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: providerOptions,
    });
    const provider = await web3Modal.connect();
    web3 = await new Web3(provider);
    // Checking if networkId matches
    const netId = await web3.eth.net.getId();
    if (netId !== networks[network]) {
        console.log('Found different network: ' + netId + ',needed ' + networks[network])
        await switchNetwork(network);
    } else {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            balance = await web3.eth.getBalance(accounts[0]);
            account = accounts[0];
            balance = parseFloat(
                web3.utils.fromWei(balance, "ether")
            ).toFixed(10);
            console.log('Found account: ' + account)
            console.log('Account balance: ' + balance)
            document.getElementById('um-button').innerText = "MINT"
            mint()
        }
    }
}

async function mint() {
    if (!isMinting) {
        isMinting = true
        try {
            document.getElementById('um-button').innerText = "MINTING, PLEASE WAIT..."
            const method = el.getAttribute('method')
            const price = parseFloat(el.getAttribute('price'))
            const amount = parseFloat(document.getElementById(el.getAttribute('amount')).value)
            const contract = el.getAttribute('contract')
            const value = price * amount
            const wei = web3.utils.toWei(value.toString(), "ether")
            console.log('Using method `' + method + '` in contract: ' + contract)
            console.log('Price is ' + price + ', amount requested is ' + amount)
            console.log('Final transaction value is: ' + wei)
            let gasLimit = 500000
            if (amount > 1) {
                gasLimit = 500000 + 100000 * amount
            }
            const nftContract = new web3.eth.Contract(ABI, contract, { gasLimit: gasLimit.toString() })
            const tx = await nftContract.methods[method]().send({ from: account, value: wei.toString() })
            console.log('Tx confirmed', tx)
            document.getElementById('um-button').innerText = "MINT"
            alert('Transaction confirmed!')
            isMinting = false
        } catch (e) {
            isMinting = false
            document.getElementById('um-button').innerText = "MINT"
            alert(e.message)
        }
    }
}

async function switchNetwork() {
    await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
            {
                chainId: "0x89",
                chainName: "Polygon",
                rpcUrls: ["https://rpc-mainnet.matic.network"],
                nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18,
                },
                blockExplorerUrls: ["https://polygonscan.com/"],
            },
        ],
    });
}