import { bscContracts } from "configurations/Constants/Contracts"
import { getUppercased } from "./GetUnifiedString"

const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)

const getContract = (asset) => {
  const unifiedAssetName = getUppercased(asset)
  const assetInfo = bscContracts[unifiedAssetName][chainId]

  return assetInfo
}

export const getContractAddress = (asset) => getContract(asset).address

export default getContract
