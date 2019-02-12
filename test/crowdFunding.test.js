const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3js = new Web3(ganache.provider());
const fs = require('fs');
const path = require('path');


const campaignABI = path.resolve(__dirname, '../ethereum/bin', 'Campaign.abi');
CampaignIf = fs.readFileSync(campaignABI, 'utf-8');

const campaignFactoryABI = path.resolve(__dirname, '../ethereum/bin', 'CampaignFactory.abi');
CampaignFactoryIf = fs.readFileSync(campaignFactoryABI, 'utf-8');

const CampaignBin = path.resolve(__dirname, '../ethereum/bin', 'Campaign.bin');
CampaignByteCode = fs.readFileSync(CampaignBin, 'utf-8');

const CampaignFactoryBin = path.resolve(__dirname, '../ethereum/bin', 'CampaignFactory.bin');
CampaignFactoryByteCode = fs.readFileSync(CampaignFactoryBin, 'utf-8');

// reusable variables in all coming functions
let accounts;
let factory;
let campaignAddress;
let campaign;
let singleCampaignAddress;

beforeEach(async() => {
    accounts = await web3js.eth.getAccounts();

    // deploy campaignFactory contract
    factory = await new web3js.eth.Contract(JSON.parse(CampaignFactoryIf))
          .deploy({data:CampaignFactoryByteCode})
          .send({from:accounts[0], gas:'6000000'});

    // let's create a new campaign using factory
    await factory.methods.createCampaign('100')
                            .send({from:accounts[0],
                                    gas: '6000000'});

    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    // let's create a javascript representation of the newly created contract.
    campaign = await new web3js.eth.Contract(JSON.parse(CampaignIf), campaignAddress);


});

describe ('Campaigns', ()=>{

    it('deploys a factory and a campaign', ()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('correct manager set', async()=>{
        // as manager property is public, there is a call() function on it
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('check contributor can donate', async()=>{
        await campaign.methods.contribute().send({
            value:1000,
            from:accounts[1]});
        // let's check that account[1] is in the approvers list, considering it is a mapping type
        // the returned value is a boolean, true or false
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor, true);
    });

    // let's check that the minimum contribution is enforced
    it('requires minimum contribution', async()=>{
        // let's use the try/catch block to work with the error we are going to force
        try{
            await campaign.methods.contribute().send({
                value: 10, // less than minimum = 100
                from: accounts[2]
            });
            // if the sentences above don't fail, then something's wrong, the test case fails
            assert(false);
        } catch (error){
            assert(error); // if error has some value, assert will succeed.
        }

    });

    it('creation of a payment request', async()=>{
        // let's create a new request using the function in the Contract
        await campaign.methods.createRequest('Call for buying missiles', '10000', accounts[2])
                            .send({from:accounts[0],
                                    gas:1000000});
        // mind that the component 0 in the array is indicated in parenthesis
        const lastRequest = await campaign.methods.requests(0).call();
        // let's check for instance that the value is correctly set
        assert('10000', lastRequest.value);
    });

    // now let's test the e2e of the whole exercise
    it('processes request', async()=>{
        // contribute with a significant amount of ether
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3js.utils.toWei('10', 'ether'),
            gas:1000000 });

        // new request created
        await campaign.methods.createRequest('Call for buying a car',
                                              web3js.utils.toWei('5', 'ether'),
                                              accounts[1]).send({from:accounts[0],
                                                                 gas:'1000000'});

        // keep the initial balance in accounts[1], before receiving the money
        let initialBalance = await web3js.eth.getBalance(accounts[1]);
        initialBalance = web3js.utils.fromWei(initialBalance, 'ether');
        initialBalance = parseFloat(initialBalance);

        // now let's approve the request,
        await campaign.methods.approveRequest(0).send({from: accounts[0],
                                                        gas: '1000000'

        });

        // now let's finalize the request, send the money to accounts[1]
        await campaign.methods.finalizeRequest(0).
                                send({from: accounts[0], gas: '1000000'});

        // let's check the balance of accounts[1]
        let balance = await web3js.eth.getBalance(accounts[1]);
        balance = web3js.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log('balance increment: ', (balance - initialBalance));
        assert.equal(5, (balance - initialBalance));

    });


});
