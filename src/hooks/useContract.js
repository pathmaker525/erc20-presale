import { useMemo } from "react"
import { getProviderOrSigner, getContract } from "utils/index"
import useActiveWeb3React from "./useActiveWeb3React"

const useContract = (address, ABI, withSignerIfPossible = true) => {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) {
      return null
    }

    try {
      return getContract(
        address,
        ABI,
        withSignerIfPossible ? getProviderOrSigner(library, account) : null
      )
    } catch (error) {
      console.error("Failed to get contract", error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export default useContract
