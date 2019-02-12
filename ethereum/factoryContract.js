import web3js from './web3.js';


// address of a deployed factory contract
const contractAddress = '0xfCB5640CAA552364C6046e91695C08716434b95f';

// not making use of account in this case
// const account = '0xD46981a35F854f72e3662519Bdf96200aDF57F0f';

const ABIinterface = '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"deployedCampaigns","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getDeployedCampaigns","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"minimum","type":"uint256"}],"name":"createCampaign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]';


// let's create a local copy of the contract
const campaignFactory = new web3js.eth.Contract(JSON.parse(ABIinterface),
                                                contractAddress);


// console.log('campaignFactory contract:', campaignFactory);

export default campaignFactory;
