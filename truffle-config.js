const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1337"
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          process.env.WALLET_MNEMONIC,
          `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
        ),
      network_id: 3, // Ropsten
      gas: 4000000,
      from: `${process.env.OWNER_ID}`
    },
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
 }
};
