
const path = require('path')
const fs = require('fs')
const solc = require('solc')

const contractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source = fs.readFileSync(contractPath, 'utf-8')

const compiled = JSON.parse(solc.compile(JSON.stringify({
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
})))

if(compiled.errors?.length > 0){
  console.log(...compiled.errors)
}

const writeContractToExternalFile = () => {
  const campaignPath = path.resolve(__dirname, 'compiled', 'Campaign.json')
  const campaignFactoryPath = path.resolve(__dirname, 'compiled', 'CampaignFactory.json')

  const campaign = compiled.contracts['Campaign.sol'].Campaign
  const campaignFactory = compiled.contracts['Campaign.sol'].CampaignFactory

  const CampaignJSON = JSON.stringify({
    interface: campaign.abi,
    bytecode: campaign.evm.bytecode
  })
  const CampaignFactoryJSON = JSON.stringify({
    interface: campaignFactory.abi,
    bytecode: campaignFactory.evm.bytecode
  })
  fs.writeFileSync(campaignPath, CampaignJSON, 'utf-8')
  fs.writeFileSync(campaignFactoryPath, CampaignFactoryJSON, 'utf-8')
}

const compiledDirectory = path.resolve(__dirname, 'compiled')
if(fs.existsSync(compiledDirectory)){
  fs.rmSync(compiledDirectory, { recursive: true })
  fs.mkdirSync(compiledDirectory)
  writeContractToExternalFile()
}
else{
  fs.mkdirSync(compiledDirectory)
  writeContractToExternalFile()
}
