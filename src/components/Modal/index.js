import ReactModal from "react-modal"

const customStyles = {
  overlay: {
    zIndex: 100,
    backgroundColor: "rgba(33, 36, 41, 0.8)",
    backdropFilter: "blur(0.75rem)",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 420,
    padding: 24,
    borderRadius: 24,
    border: "1px solid rgba(112, 112, 112, 0.1)",
    background: "rgb(33, 36, 41)",
  },
}

const Modal = ({ children, ...restProps }) => (
  <ReactModal style={customStyles} {...restProps}>
    {children}
  </ReactModal>
)

export default Modal
