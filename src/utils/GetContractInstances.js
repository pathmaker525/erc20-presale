import { getContract } from "./index"
import { getContractAddress } from "./GetContractInfo"

import { getMappyTokenAbi, getMappyIcoAbi } from "helpers/AbiHelper"

export const getMappyTokenContract = (signer) => {
  return getContract(getContractAddress("MAPPY"), getMappyTokenAbi(), signer)
}

export const getMappyIcoContract = (signer) => {
  return getContract(getContractAddress("PRESALE"), getMappyIcoAbi(), signer)
}
