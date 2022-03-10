require("dotenv").config()
const HDWalletProvider = require("@truffle/hdwallet-provider")
const SecretRecoverPhrase = process.env.PRIVATE_KEYS || ""

module.exports = {
  networks: {
    bsc: {
      provider: () =>
        new HDWalletProvider(
          SecretRecoverPhrase,
          `https://bsc-dataseed1.binance.org`
        ),
      network_id: 56, // Bsc's id
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 10000, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    testnet: {
      provider: () =>
        new HDWalletProvider(
          SecretRecoverPhrase,
          `https://data-seed-prebsc-1-s1.binance.org:8545`
        ),
      network_id: 97, // Bsc testnet's id
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 100000,
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.12", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200,
        },
        //  evmVersion: "byzantium"
      },
    },
  },
  contracts_directory: "./contracts",
  contracts_build_directory: "./src/configurations/abis/Generated",
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    bscscan: `${process.env.API_KEY}`,
  },
}
