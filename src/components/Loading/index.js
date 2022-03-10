import { Logo } from "resources/Images"
import "./style.scss"

const Loading = () => (
  <div className="loading flex">
    <div className="loading-wrapper container flex flex-column">
      <img src={Logo} alt="logo" />
      <span>LOADING</span>
      <div className="flex flex-column"></div>
    </div>
  </div>
)

export default Loading
