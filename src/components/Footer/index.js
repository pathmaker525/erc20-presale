import { Logo } from "resources/Images"
import "./style.scss"

const Footer = () => (
  <div className="footer flex">
    <div className="footer-wrapper container flex-column">
      <div className="footer-logo flex">
        <img src={Logo} alt="logo" />
      </div>
      <div className="footer-copyright">© 2022 SafuTrendz</div>
    </div>
  </div>
)

export default Footer
