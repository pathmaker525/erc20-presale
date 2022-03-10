import { providers } from "ethers"
import { RPC_URL } from "configurations/Constants"

const { StaticJsonRpcProvider } = providers
const rpcUrl = RPC_URL.chainId

export const simpleRpcProvider = new StaticJsonRpcProvider(rpcUrl)
