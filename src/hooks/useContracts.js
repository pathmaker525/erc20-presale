import { useMemo } from "react"
import { get } from "lodash"

import useContract from "./useContract"

import { getContractAddress } from "utils/GetContractInfo"
import { getMappyIcoAbi } from "helpers/AbiHelper"

export const usePresale = () => {
  const contractAddress = getContractAddress("PRESALE")
  const contractAbi = getMappyIcoAbi()

  const presaleInstance = useContract(contractAddress, contractAbi, true)

  return useMemo(() => presaleInstance, [presaleInstance])
}
