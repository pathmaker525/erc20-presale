import { CHAIN_ID } from "."

const { BSC_MAINNET, BSC_TESTNET } = CHAIN_ID

export const bscContracts = {
  PRESALE: {
    [BSC_MAINNET]: {
      address: "0x25010cBc2f119c0fca8d1BdF1C4AA49Bb46A47AF",
      explorerUrl:
        "https://bscscan.com/address/0x25010cBc2f119c0fca8d1BdF1C4AA49Bb46A47AF#code",
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
