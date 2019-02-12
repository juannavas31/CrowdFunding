import Web3 from 'web3';

// create an instance of web3 using Metamask provider to access to rinkeby test-network
// const web3js = new Web3(window.web3.currentProvider);
// what happens if the user does not use metatmask?
// we need to handle it in another way.

let web3js;

if ((typeof window !== 'undefined') && (typeof window.web3 !== 'undefined')){
    // this code is executed inside a browser and metamask is available
    web3js = new Web3(window.web3.currentProvider);
} else {
    // this code is running in the server side, node.js, by next.js
    // (remember the server-side-rendering feature by Next.js)
    // or the user is in the browser but not using Metamask
    // in any of these cases we are going to use infura
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/73dd0c0298744ea388c58d6feb7996c7');
    // and now we make a new instance of web3js with the new provider through infura
    web3js = new Web3(provider);
};


export default web3js;
