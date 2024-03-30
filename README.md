# KS TOKEN

Sepolia Testnet Ethereum token built on top of the OpenZeppelin framework for added functionality and security.
Deployed with a market cap of 100 million tokens of which 70 million are allocated to the contract owner.

Check out the deployed token contract information at sepolia.etherscan.io.
Token address: 0xa5f616cA4A391172110DB98F5FE7f1223C0966D0

# NPM INSTALL and other info

After cloning this repo,
run an `npm i` in a cmd window opened in the current working directory, where the package.json is located.
After installing the dependencies, you can start making changes to the smart contract in the contracts folder.
For the smart contract (KSToken.sol) in the contracts folder, the constructor defines the total supply of tokens and the block reward.

The extensions inherited from the OpenZeppelin framework, ERC20Capped [allows us to set a total supply of tokens] and the ERC20Burnable [allows us to burn some tokens in the future to create scarcity].
We mint the tokens using the address deploying the contract (owner) and send 70 million to the owner while doing so.

We then create functions to mint some tokens as block rewards and set that block reward.

The access modifier limits access to some function calls to only the owner of the contract.

# HARDHAT STEPS
After all is done in the smart contract, it's time to set things up in Hardhat.
Go to hardhat.config.js and make sure the solidity version matches that of the smart contract.

Now in the same current working directory:
`npx hardhat compile` == to compile the smart contract in the contracts folder.

Some tests have been created to assert some token functionality and spot irregular behaviour.
`npx hardhat test` to run these tests.
You can add some of the tests for other functionality 

# Deployment
Create a .env file in your working directory with the following content:
PRIVATE_KEY=private_key_goes_here
INFURA_SEPOLIA_ENDPOINT=infura_endpoint_goes_here

Open Metamask in your browser and grab the private key of your wallet address, paste it in the .env file.
Create an account on infura.io if you don't have one , create an API KEY and copy your sepolia testnet endpoint url and paste it in the .env file.

Navigate to your hardhat.config.js file and add 
`require("dotenv").config()` to import the .env file's content.
In the module.exports, add a new entry:
`
networks: {
	sepolia:{
		url: process.env.INFURA_ENDPOINT,
		accounts: [process.env.PRIVATE_KEY]
	}
}
`
In script/deploy.js:
The script to deploy the token is here
You can now deploy the token specifying the total supply cap and block reward.

Now to deploy the token:
`npx hardhat run --network sepolia scripts/deploy.js`

The contract address of the token will be logged onto the console.
Copy the address and go to: sepolia.etherscan.io , to see token info.

You can import your token by going into Metamask and selecting "import tokens"
Choose custom token 
Paste your deployed token address
Check if the ticker name matches 

Now you can test out your token by transferring it etc..
