const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const { interface, bytecode } = require('./contractBuilds/CampaignFactory.json')
const dotenv = require('dotenv')
const { storeDeployedContractInfo } = require('./mongodb')

dotenv.config('./.env')

const provider = new HDWalletProvider(
   process.env.SECRET_PHRASE,
   process.env.INFURA_URL,
)

const web3 = new Web3(provider)

const deploy = async () => {
  let accounts = await web3.eth.getAccounts()

  console.log('attempting to deploy from account: ==>', + ' ' + accounts[0])

  const deployment = await new web3.eth.Contract( interface )
  .deploy({data: bytecode, arguments: []})
  .send({ gas: 3000000, from: accounts[0]})
  const storedContractData = await storeDeployedContractInfo({ abi: interface, address: deployment.options.address})
}

deploy()
