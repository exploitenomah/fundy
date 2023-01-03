
const assert = require('assert')
const ganache = require('ganache')
const Web3 = require('web3')

const CampaignFactory = require('../ethereum/contractBuild/CampaignFactory')
const Campaign = require('../ethereum/contractBuild/Campaign.json')

const web3 = new Web3(ganache.provider())

let accounts
let factory
let campaignAddress
let campaign

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(CampaignFactory.interface)
  .deploy({data: '0x' + CampaignFactory.bytecode, arguments: []})
  .send({ from: accounts[0], gas: 3000000,})
  await factory.methods.createCampaign('100').send({
    from: accounts[0], gas: 3000000
  })
  const allCampaigns = await factory.methods.getDeployedCampaigns().call()
  campaignAddress = allCampaigns[0]
  campaign = await new web3.eth.Contract(Campaign.interface, campaignAddress)
})

describe('test', () => {
  it('deploys a factory and an campaign', () => {
    assert.ok(factory.options.address)
    assert.ok(campaign.options.address)
  })
})