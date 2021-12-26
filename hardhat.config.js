require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
let fs = require("fs");

let config = JSON.parse(fs.readFileSync("./params", "UTF-8"));

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    ropsten: {
      url: ""+config.ROPSTEN_ID,
      accounts: [config.ACCOUNT]
    },
    matic: {
      url: ""+config.MATIC_ID,
      accounts: [config.ACCOUNT]
    },
  }
};
