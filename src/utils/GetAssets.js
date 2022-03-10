import { bscTokens } from "configurations/Constants/Tokens"
import { getUppercased } from "./GetUnifiedString"

const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)

const getAsset = (asset) => {
  const unifiedAssetName = getUppercased(asset)
  const assetInfo = bscTokens[unifiedAssetName][chainId]

  return assetInfo
}

export const getDefaultCurrencies = () => {
  let assets = bscTokens

  return assets
}

export default getAsset
