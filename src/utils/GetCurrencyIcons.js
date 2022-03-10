import { MAPPY, ETH, BNB, USDT, BUSD } from "resources/Cryptocurrencies"

export const getCurrencyIcon = (symbol) => {
  let icon

  switch (symbol) {
    case "MAPPY":
      icon = <MAPPY />
      break
    case "ETH":
      icon = <ETH />
      break
    case "BNB":
      icon = <BNB />
      break
    case "WBNB":
      icon = <BNB />
      break
    case "USDT":
      icon = <USDT />
      break
    case "BUSD":
      icon = <BUSD />
      break
    default:
      break
  }

  return icon
}
