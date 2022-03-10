import { ethers } from "ethers"

export const getInfuraProvider = () => {
  const infuraProvider = new ethers.providers.Web3Provider(window.ethereum)

  return infuraProvider
}

export const getContractWithSigner = (address, abi) => {
  const infuraProvider = getInfuraProvider()
  const signer = infuraProvider.getSigner()

  const contract = new ethers.Contract(address, abi, signer)

  return contract
}

export const getContractWithoutSigner = (address, abi) => {
  const infuraProvider = getInfuraProvider()

  const contract = new ethers.Contract(address, abi, infuraProvider)

  return contract
}
