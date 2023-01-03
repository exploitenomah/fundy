
const path = require('path')
const fs = require('fs')
const solc = require('solc')

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const factoryPath = path.resolve(__dirname, 'contracts', 'Factory.sol')
const contractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source = fs.readFileSync(contractPath, 'utf-8')
const campaignSrc = fs.readFileSync(campaignPath, 'utf-8')
const factorySrc = fs.readFileSync(factoryPath, 'utf-8')

const compiled = JSON.parse(solc.compile(JSON.stringify({
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: campaignSrc
    },
    'Factory.sol': {
      content: factorySrc
    }
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
  const campaignPath = path.resolve(__dirname, 'contractBuilds', 'Campaign.json')
  const campaignFactoryPath = path.resolve(__dirname, 'contractBuilds', 'CampaignFactory.json')

  const campaign = compiled.contracts['Campaign.sol'].Campaign
  const factory = compiled.contracts['Factory.sol'].CampaignFactory

  const CampaignJSON = JSON.stringify({
    interface: campaign.abi,
    bytecode: campaign.evm.bytecode.object
  })
  const CampaignFactoryJSON = JSON.stringify({
    interface: factory.abi,
    bytecode: factory.evm.bytecode.object
  })
  fs.writeFileSync(campaignPath, CampaignJSON, 'utf-8')
  fs.writeFileSync(campaignFactoryPath, CampaignFactoryJSON, 'utf-8')
}

const compiledDirectory = path.resolve(__dirname, 'contractBuilds')
if(fs.existsSync(compiledDirectory)){
  fs.rmSync(compiledDirectory, { recursive: true })
  fs.mkdirSync(compiledDirectory)
  writeContractToExternalFile()
}
else{
  fs.mkdirSync(compiledDirectory)
  writeContractToExternalFile()
}
