import { ConnectorIds } from "configurations/Wallets"

const WalletCard = ({ connector, walletConfig, onDismiss }) => (
  <button
    variant="tertiary"
    className="flex blur-bg shadowed rounded-sm"
    onClick={() => {
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MMStream

      // Since iOS does not support Trust Wallet we fall back to WalletConnect
      if (walletConfig.title === "Trust Wallet" && isIOS) {
        connector(ConnectorIds.WalletConnect)
      } else {
        connector(walletConfig.connectorId)
      }

      onDismiss()
    }}
  >
    {walletConfig.icon}
    <span>{walletConfig.title}</span>
  </button>
)

export default WalletCard
