import { ethers } from "ethers"
import {
  getContractWithoutSigner,
  getContractWithSigner,
} from "./GetContractWithProvider"
import { getContractAddress } from "./GetContractInfo"
import { getMappyIcoAbi } from "helpers/AbiHelper"

export const getPresaleInfo = async () => {
  const contract = getContractWithoutSigner(
    getContractAddress("PRESALE"),
    getMappyIcoAbi()
  )

  try {
    let infos = await contract.presale_info()

    return infos
  } catch (error) {
    return {
      sale_token: "",
      raise_min: 0x00,
      raise_max: 0x00,
      softcap: 0x00,
      hardcap: 0x00,
      presale_start: 0x00,
      presale_end: 0x00,
    }
  }
}

/**
 * Get Presale status from the contract
 *
 * @returns presale status if true, false then return initialized value
 */
export const getPresaleStatus = async () => {
  const contract = getContractWithoutSigner(
    getContractAddress("PRESALE"),
    getMappyIcoAbi()
  )

  try {
    let infos = await contract.status()

    return infos
  } catch (error) {
    return {
      base_withdraw: 0x00,
      forced_failed: false,
      num_buyers: 0x00,
      raised_amount: 0x00,
      sold_amount: 0x00,
      token_withdraw: 0x00,
    }
  }
}

export const getTokenMetadata = async () => {
  const contract = getContractWithoutSigner(
    getContractAddress("PRESALE"),
    getMappyIcoAbi()
  )

  try {
    let infos = await contract.tokeninfo()

    return infos
  } catch (error) {
    return null
  }
}

export const getPresaleResult = async () => {
  const contract = getContractWithoutSigner(
    getContractAddress("PRESALE"),
    getMappyIcoAbi()
  )

  try {
    let infos = await contract.presaleStatus()

    return ethers.BigNumber.from(infos).toNumber()
  } catch (error) {
    return -1
  }
}

export const getBuyerStatus = async (address) => {
  const contract = getContractWithoutSigner(
    getContractAddress("PRESALE"),
    getMappyIcoAbi()
  )

  try {
    let infos = await contract.buyers(address)

    return infos
  } catch (error) {
    return {
      base: 0x00,
      sale: 0x00,
    }
  }
}

export const setUserDeposit = async (
  amount,
  alertInfo,
  alertSuccess,
  alertError
) => {
  const contract = getContractWithSigner(
    getContractAddress("PRESALE"),
    getMappyIcoAbi()
  )

  try {
    let txHash = await contract.userDeposit({
      value: ethers.utils.parseUnits(amount.toString(), 18),
    })

    alertInfo("Tx Submitted")

    let res = await txHash.wait()

    if (res.transactionHash) {
      alertSuccess("Tx Succeed")
    } else {
      alertError("Tx Failed")
    }
  } catch (error) {
    if (error.data) {
      alertError(error.data.message)
    } else {
      alertError(error.message)
    }
  }
}

export const claimTokens = async (alertInfo, alertSuccess, alertError) => {
  const contract = getContractWithSigner(
    getContractAddress("PRESALE"),
    getMappyIcoAbi()
  )

  try {
    let txHash = await contract.userWithdrawTokens()

    alertInfo("Tx Submitted")

    let res = await txHash.wait()

    if (res.transactionHash) {
      alertSuccess("Tx Succeed")
    } else {
      alertError("Tx Failed")
    }
  } catch (error) {
    if (error.data) {
      alertError(error.data.message)
    } else {
      alertError(error.message)
    }
  }
}

export const withdrawBase = async (alertInfo, alertSuccess, alertError) => {
  const contract = getContractWithSigner(
    getContractAddress("PRESALE"),
    getMappyIcoAbi()
  )

  try {
    let txHash = await contract.userWithdrawBaseTokens()

    alertInfo("Tx Submitted")

    let res = await txHash.wait()

    if (res.transactionHash) {
      alertSuccess("Tx Succeed")
    } else {
      alertError("Tx Failed")
    }
  } catch (error) {
    if (error.data) {
      alertError(error.data.message)
    } else {
      alertError(error.message)
    }
  }
}
