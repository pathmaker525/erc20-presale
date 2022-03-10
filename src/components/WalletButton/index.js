import { useState } from "react"
import Modal from "components/Modal"
import { IoExitOutline, IoCloseOutline } from "react-icons/io5"
import { useWeb3React } from "@web3-react/core"

import WalletCard from "./WalletCard"
import connectors from "configurations/Wallets"

import useAuth from "hooks/useAuth"

const WalletButton = ({
  children,
  transaction,
  walletConnectAction,
  ...restProps
}) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()

  const [modalIsOpen, setModalOpen] = useState(false)

  const openModal = () => {
    setModalOpen(true)
  }

  const afterOpenModal = () => {}

  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <>
      <button {...restProps} onClick={openModal}>
        {children}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Connect Wallet"
        ariaHideApp={false}
      >
        <div className="modal-header flex">
          <h3>Connect Wallet</h3>
          <IoCloseOutline onClick={closeModal} />
        </div>
        {connectors.map((data, index) => (
          <WalletCard
            key={index}
            connector={login}
            walletConfig={data}
            onDismiss={closeModal}
          />
        ))}
        {account && account !== "" ? (
          <div className="modal-control">
            <button
              className="flex rounded-sm"
              onClick={() => {
                logout()
                closeModal()
              }}
            >
              <span>Disconnect</span>
              <IoExitOutline onClick={closeModal} />
            </button>
          </div>
        ) : (
          <></>
        )}
      </Modal>
    </>
  )
}

export default WalletButton
