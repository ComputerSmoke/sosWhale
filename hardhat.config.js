require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
let fs = require("fs");

let config = JSON.parse(fs.readFileSync("./params", "UTF-8"));

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4"
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/"+config.INFURA_ID,
      accounts: [config.ACCOUNT]
    }
  }
};
