# Universal Mint Button

![](https://media2.giphy.com/media/1kTHYEtLiLB1wUBwCS/giphy.gif?cid=ecf05e47z7lkhr05v8t5ze43h1f21ia8kthfdrp36xzjl7nq&rid=giphy.gif&ct=g)

This is a super-simple method to add a minting interface in plain web2 websites (PHP, pure HTML etc). Don't worry if you don't have any skill, the script will do the magic for you.

## How to use it

Add an input and a button as showed below:

```
<input type="number" id="amount-input" value="1">
<button id="um-button" network="polygon" method="buyNFT" price="50" amount="amount-input" infura="INFURA_KEY" contract="0x324ecF8184D84AD7b8687b2130eC82ac0D3af3ab">CONNECT WALLET</button>
```

Here you can see what's needed to fit into your contract (ask your web3 dev):

- network: your blockchain, now using `polygon`
- method: the smart contract method, now using `buyNFT`
- price: the price for a single nft, it will multiply with amount to buy (first input)
- infura: the infura key, this is needed for Wallet Connect
- contract: the address of smart contract, now using `0x324ecF8184D84AD7b8687b2130eC82ac0D3af3ab`

Then add you ABI (ask your web3 dev) inserting it in a constant like:

```
const ABI = [
    {
      "inputs": [],
      "name": "buyNFT",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    }
]
```

And, at the end include the magic:

```
<script src="./umb.min.js"></script>
```

That's it! You can now interact with your smart contract!

## Contribute

Want to understand how it works on background? Simply run:

```
npm run dev
```

or, if you want to build again:

```
npm run build
```

At the end of the process will be needed to fix some `undefined` issues, you can add trailing `?` to be sure the code will not crash.