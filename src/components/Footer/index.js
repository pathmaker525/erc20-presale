import { keysIn } from "lodash"
import { SocialLinks } from "constants/UI"

import { Logo } from "resources/Images"
import "./style.scss"

const Footer = () => (
  <div className="footer flex">
    <div className="footer-wrapper container flex-column">
      <div className="footer-logo flex">
        <img src={Logo} alt="logo" />
      </div>
      <div className="footer-copyright">© 2022 SafuTrendz</div>
      <div className="footer-socials flex">
        {keysIn(SocialLinks).map((data, index) => (
          <a
            key={index}
            className="flex"
            href={SocialLinks[data].link}
            target="_blank"
            rel="noreferrer"
            aria-label={data.toLowerCase()}
          >
            {SocialLinks[data].icon}
          </a>
        ))}
      </div>
    </div>
  </div>
)

export default Footer
