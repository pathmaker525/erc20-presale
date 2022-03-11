import { CHAIN_ID } from "."

const { BSC_MAINNET, BSC_TESTNET } = CHAIN_ID

export const bscContracts = {
  PRESALE: {
    [BSC_MAINNET]: {
      address: "0xb981c94e9357ad62A516BEF738c52506EEE9c42C",
      explorerUrl:
        "https://bscscan.com/address/0xb981c94e9357ad62a516bef738c52506eee9c42c",
    },
  },
  SAFUTRENDZ: {
    [BSC_MAINNET]: {
      address: "0x1CD316d3882E8Dd36C7B096eE362F018d6b9795d",
      explorerUrl:
        "https://bscscan.com/token/0x1cd316d3882e8dd36c7b096ee362f018d6b9795d",
    },
  },
}
