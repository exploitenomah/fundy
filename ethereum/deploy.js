const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const { interface: contractInterface, bytecode } = require('./contractBuilds/CampaignFactory.json')
const dotenv = require('dotenv')
const axios = require('axios')


dotenv.config('../.env')

const provider = new HDWalletProvider(
   process.env.SECRET_PHRASE,
   process.env.INFURA_URL,
)

const web3 = new Web3(provider)

const deploy = async () => {
  let accounts = await web3.eth.getAccounts()

  console.log('attempting to deploy from account: ==>', + ' ' + accounts[0])

  try{
    const deployment = await new web3.eth.Contract( contractInterface )
    .deploy({data: bytecode, arguments: []})
    .send({ gas: 3000000, from: accounts[0]})

    const done = await axios({
      method: 'POST',
      url: 'http:127.0.0.1:3000/api/contracts', 
      data: {
        abi: contractInterface, address: deployment.options.address
      }
    })
    console.log(done.data, 'done.')
  }catch(err){
    console.log(err)
  }
}

deploy()
