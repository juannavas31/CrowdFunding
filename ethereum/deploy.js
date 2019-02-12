const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const path = require('path');
const fs = require('fs');



const campaignFactoryABI = path.resolve(__dirname, './bin', 'CampaignFactory.abi');
const CampaignFactoryIf = fs.readFileSync(campaignFactoryABI, 'utf-8');

const CampaignFactoryBin = path.resolve(__dirname, './bin', 'CampaignFactory.bin');
const CampaignFactoryByteCode = fs.readFileSync(CampaignFactoryBin, 'utf-8');

// rinkeby provider : https://rinkeby.infura.io/v3/73dd0c0298744ea388c58d6feb7996c7
//
// Ropsten provider :  https://ropsten.infura.io/v3/73dd0c0298744ea388c58d6feb7996c7
//
const provider = new HDWalletProvider(
  'undo kitten country glare crater wood owner cruel gadget stem layer neglect',
  'https://rinkeby.infura.io/v3/73dd0c0298744ea388c58d6feb7996c7'
);



// this instance is completely enabled to interact with rinkeby network.
const web3js = new Web3(provider);

// now let's deploy the smart contract
// we need to make 2 async calls.
// 1.- we need to make a call to get the list of acounts we have access to
// 2.- we need to create and deploy the contract.
// we are going to use the async/await sintax.

const deploy = async () =>{
    const accounts = await web3js.eth.getAccounts();

    console.log("Using account: ", accounts[0]);

    // we only need to deply the factory contract.
    // campaign contracts will be created from the factory.

    let factoryContract = await new web3js.eth.Contract(JSON.parse(CampaignFactoryIf))
              .deploy({data:'0x'+CampaignFactoryByteCode})
              .send({gas:'6000000', from: accounts[0]});

    console.log('Factory Contract deployed to:', factoryContract.options.address);

};

deploy();
