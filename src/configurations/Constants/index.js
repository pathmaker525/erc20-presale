export const CHAIN_ID = {
  // Binance Smart Chain
  BSC_MAINNET: 56,
  BSC_TESTNET: 97,
}

export const RPC_URL = {
  // Binance Smart Chain
  [CHAIN_ID.BSC_MAINNET]: "https://bsc-dataseed1.binance.org/",
  [CHAIN_ID.BSC_TESTNET]: "https://data-seed-prebsc-1-s1.binance.org:8545/",
}

export const SCANNER_URL = {
  [CHAIN_ID.BSC_MAINNET]: "https://bscscan.com",
  [CHAIN_ID.BSC_TESTNET]: "https://testnet.bscscan.com",
}
