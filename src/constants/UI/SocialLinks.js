import {
  SiTwitter,
  SiFacebook,
  SiTelegram,
  SiDiscord,
  SiGmail,
} from "react-icons/si"

const SocialLinks = {
  Twitter: { link: "https://twitter.com/mappycoin", icon: <SiTwitter /> },
  Facebook: {
    link: "https://facebook.com/mappycoin",
    icon: <SiFacebook />,
  },
  Telegram: { link: "https://t.me/MappyCoinChat", icon: <SiTelegram /> },
  Discord: { link: "https://discord.gg/mappycoin", icon: <SiDiscord /> },
  Mail: {
    link: "mailto:support@mappycoin.com",
    icon: <SiGmail />,
  },
}

export default SocialLinks
