import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"

import { useAlert } from "react-alert"

import PresaleComponent from "components/Presale"

import { calculateTimeLeft } from "helpers/CountdownTimer"
import {
  getBuyerStatus,
  getPresaleInfo,
  getPresaleStatus,
  getPresaleResult,
  setUserDeposit,
  claimTokens,
  withdrawBase,
} from "utils/GetPresale"

import getContract from "utils/GetContractInfo"
import getAsset from "utils/GetAssets"
import { DECIMAL_COIN } from "configurations/index"

const Presale = () => {
  const { account, chainId } = useWeb3React()

  const [refreshCount, setRefreshCount] = useState(0)

  const [startTimeLeft, setStartTimeLeft] = useState(0)
  const [endTimeLeft, setEndTimeLeft] = useState(0)

  const [baseAmount, setBaseAmount] = useState(0)

  const [buyerState, setBuyerState] = useState({})
  const [presaleInfo, setPresaleInfo] = useState({})
  const [presaleStatus, setPresaleStatus] = useState({})
  const [presaleResult, setPresaleResult] = useState()

  const [txStatus, setTxStatus] = useState("")

  // Alert Module
  const alert = useAlert()

  useEffect(() => {
    const timer = setTimeout(() => {
      setRefreshCount(refreshCount + 1)
    }, 3000)

    const fetchDatas = async () => {
      let buyer = await getBuyerStatus(account)
      setBuyerState(buyer)
      let presale_info = await getPresaleInfo()
      setPresaleInfo(presale_info)
      let presale_status = await getPresaleStatus()
      setPresaleStatus(presale_status)
      let presale_result = await getPresaleResult()
      setPresaleResult(presale_result)
    }

    fetchDatas()

    return () => {
      alert.removeAll()
      clearTimeout(timer)
    }
  }, [account, chainId, refreshCount])

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartTimeLeft(
        calculateTimeLeft(
          Object.keys(presaleInfo).length > 0
            ? ethers.BigNumber.isBigNumber(presaleInfo.presale_start)
              ? ethers.BigNumber.from(presaleInfo.presale_start).toNumber()
              : presaleInfo.presale_start
            : 0
        )
      )
    }, 1000)

    return () => clearTimeout(timer)
  }, [startTimeLeft, refreshCount])

  useEffect(() => {
    const timer = setTimeout(() => {
      setEndTimeLeft(
        calculateTimeLeft(
          Object.keys(presaleInfo).length > 0
            ? ethers.BigNumber.isBigNumber(presaleInfo.presale_end)
              ? ethers.BigNumber.from(presaleInfo.presale_end).toNumber()
              : presaleInfo.presale_end
            : 0
        )
      )
    }, 1000)

    return () => clearTimeout(timer)
  }, [endTimeLeft, refreshCount])

  const onBaseChangeHandler = (e) => {
    const value = e.target.value

    if (value <= 0) {
      setBaseAmount(-parseFloat(value))

      return
    } else {
      setBaseAmount(parseFloat(value))
    }
  }

  const alertInfo = (message) =>
    alert.info(message, {
      onOpen: () => {
        setTxStatus("Pending")
      },
    })

  const alertSuccess = (message) =>
    alert.success(message, {
      onOpen: () => {
        setTxStatus("Success")
      },
    })

  const alertError = (message) =>
    alert.error(message, {
      onOpen: () => {
        setTxStatus("Error")
      },
    })

  const onDepositHandler = () => {
    setUserDeposit(baseAmount, alertInfo, alertSuccess, alertError)
  }

  const onClaimHandler = () => {
    claimTokens(alertInfo, alertSuccess, alertError)
  }

  const onWithdrawBaseHandler = () => {
    withdrawBase(alertInfo, alertSuccess, alertError)
  }

  return (
    <PresaleComponent
      buyerAddress={account}
      startTimeLeft={startTimeLeft}
      endTimeLeft={endTimeLeft}
      token={getAsset("SAFUTRENDZ")}
      tokenContract={getContract("SAFUTRENDZ")}
      presaleContract={getContract("PRESALE")}
      presaleSupply={2500000000}
      rate={
        presaleInfo.token_rate
          ? ethers.BigNumber.isBigNumber(presaleInfo.token_rate)
            ? ethers.BigNumber.from(presaleInfo.token_rate).toNumber()
            : presaleInfo.token_rate
          : 0
      }
      softcap={
        Object.keys(presaleInfo).length > 0
          ? ethers.BigNumber.isBigNumber(presaleInfo.softcap) === true
            ? ethers.utils.formatUnits(presaleInfo.softcap, DECIMAL_COIN)
            : presaleInfo.softcap
          : 0
      }
      hardcap={
        Object.keys(presaleInfo).length > 0
          ? ethers.BigNumber.isBigNumber(presaleInfo.hardcap)
            ? ethers.utils.formatUnits(presaleInfo.hardcap, DECIMAL_COIN)
            : presaleInfo.hardcap
          : 0
      }
      minbuy={
        Object.keys(presaleInfo).length > 0
          ? ethers.BigNumber.isBigNumber(presaleInfo.raise_min)
            ? ethers.utils.formatUnits(presaleInfo.raise_min, DECIMAL_COIN)
            : presaleInfo.raise_min
          : 0
      }
      maxbuy={
        Object.keys(presaleInfo).length > 0
          ? ethers.BigNumber.isBigNumber(presaleInfo.raise_max)
            ? ethers.utils.formatUnits(presaleInfo.raise_max, DECIMAL_COIN)
            : presaleInfo.raise_max
          : 0
      }
      startdate={
        Object.keys(presaleInfo).length > 0
          ? ethers.BigNumber.isBigNumber(presaleInfo.presale_start)
            ? ethers.BigNumber.from(presaleInfo.presale_start).toNumber()
            : presaleInfo.presale_start
          : 0
      }
      enddate={
        Object.keys(presaleInfo).length > 0
          ? ethers.BigNumber.isBigNumber(presaleInfo.presale_end)
            ? ethers.BigNumber.from(presaleInfo.presale_end).toNumber()
            : presaleInfo.presale_end
          : 0
      }
      raisedamount={
        Object.keys(presaleStatus).length > 0
          ? ethers.BigNumber.isBigNumber(presaleStatus.raised_amount)
            ? ethers.utils.formatUnits(
                presaleStatus.raised_amount,
                DECIMAL_COIN
              )
            : presaleStatus.raised_amount
          : 0
      }
      sold={
        Object.keys(presaleStatus).length > 0
          ? ethers.BigNumber.isBigNumber(presaleStatus.sold_amount)
            ? ethers.utils.formatUnits(presaleStatus.sold_amount, DECIMAL_COIN)
            : presaleStatus.sold_amount
          : 0
      }
      buyerBase={
        Object.keys(buyerState).length > 0
          ? ethers.BigNumber.isBigNumber(buyerState.base)
            ? ethers.utils.formatUnits(buyerState.base, DECIMAL_COIN)
            : buyerState.base
          : 0
      }
      buyerSale={
        Object.keys(buyerState).length > 0
          ? ethers.BigNumber.isBigNumber(buyerState.sale)
            ? ethers.utils.formatUnits(buyerState.sale, DECIMAL_COIN)
            : buyerState.sale
          : 0
      }
      result={presaleResult}
      txStatus={txStatus}
      onBaseChangeHandler={onBaseChangeHandler}
      onDepositHandler={onDepositHandler}
      onClaimHandler={onClaimHandler}
      onWithdrawBaseHandler={onWithdrawBaseHandler}
    />
  )
}

export default Presale
