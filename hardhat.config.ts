// Plugins
import "dotenv/config";
// import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers";

// This adds support for typescript paths mappings
import "tsconfig-paths/register";

const accounts = {
  mnemonic:
    process.env.MNEMONIC ||
    "test test test test test test test test test test test junk",
};
const ALCHEMY_TOKEN = process.env.ALCHEMY_TOKEN || ""
const INFURA_TOKEN = process.env.INFURA_TOKEN || ""

module.exports = {
  networks: {
    goerli: {
      chainId: 5,
      url: `https://goerli.infura.io/v3/${INFURA_TOKEN}`,
      accounts,
    },
  },
  solidity: {
    version: "0.7.6",
    settings: {
        optimizer: {
            enabled: true,
            runs: 1000,
        },
    },
  },
};
