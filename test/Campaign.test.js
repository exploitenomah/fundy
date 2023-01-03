
const assert = require('assert')
const ganache = require('ganache')
const Web3 = require('web3')

const CampaignFactory = require('../ethereum/contractBuilds/CampaignFactory')
const Campaign = require('../ethereum/contractBuilds/Campaign.json')

const web3 = new Web3(ganache.provider())

let accounts
let factory
let campaignAddress
let campaign
let primaryAccount
const minimumContribution = 100
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(CampaignFactory.interface)
  .deploy({data: '0x' + CampaignFactory.bytecode, arguments: []})
  .send({ from: accounts[0], gas: 3000000,})
  await factory.methods.createCampaign(minimumContribution.toString()).send({
    from: accounts[0], gas: 3000000
  })
  const allCampaigns = await factory.methods.getDeployedCampaigns().call()
  campaignAddress = allCampaigns[0]
  campaign = await new web3.eth.Contract(Campaign.interface, campaignAddress)
  primaryAccount = accounts[0]
})

describe('Campaign', () => {
  it('deploys a factory and an campaign', () => {
    assert.ok(factory.options.address)
    assert.ok(campaign.options.address)
  })

  it('campaign manager is same as address as account used to create campaign with factory', async () => {
    const manager = await campaign.methods.manager().call()
    assert.equal(primaryAccount, manager)
  })
  
  it('does not allow contribution below minimum', async () => {
    try{
      await campaign.methods.contribute().send({
        from: accounts[1], value: minimumContribution - 1, gas: 3000000
      })
      assert(false)
    }catch(err){
      assert(true)
    }
  })

  it('allows donation with value greater than minimum and marks them as contributors.', async () => {
    try{
      await campaign.methods.contribute().send({
        from: accounts[1], value: minimumContribution + 1, gas: 3000000
      })
      const contributed = await campaign.methods.contributors(accounts[1]).call()
      assert.ok(contributed)
    }catch(err){
      assert(false)
    }
  })

  it('non-manager cannot create spending request', async () => {
    try {
      await campaign.methods.createRequest('buy batteries', '150', accounts[1]).send({
        from: accounts[1], gas: 3000000
      })
      assert(false)
    } catch (err) {
      assert(true)
    }
  })

  it('manager can create spending request', async () => {
    try {
      const manager = await campaign.methods.manager().call()
      await campaign.methods
      .createRequest('buy batteries', '150', accounts[1]).send({
        from: manager, gas: 3000000
      })
      const latestRequest = await campaign.methods.requests(0).call()
      assert.equal(latestRequest.description, 'buy batteries')
      assert.equal(latestRequest.value, 150)
      assert.equal(latestRequest.recipient, accounts[1])
    } catch (err) {
      assert(false)
    }
  })
})


