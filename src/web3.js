import Web3 from 'web3';

let web3;

if (window.ethereum) {
    console.log("web3: ", web3)
  web3 = new Web3(window.ethereum);
  try {
    window.ethereum.enable();
  } catch (error) {
    console.error("User denied account access");
  }
} else if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);
} else {
  console.error("No web3 provider detected. Install MetaMask or use a browser with Ethereum support.");
}

export default web3;
