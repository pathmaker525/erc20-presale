import { Link } from "react-router-dom"
import FadeIn from "react-fade-in/lib/FadeIn"

import { AppRoutes } from "constants/UI"
import "./style.scss"

const NotFound = () => (
  <div className="notfound flex">
    <FadeIn className="notfound-wrapper container flex flex-column">
      <h1>404 Not Found</h1>
      <p>There is no such page you are finding.</p>
      <Link to={AppRoutes.DASHBOARD}>Go back to Dashboard</Link>
    </FadeIn>
  </div>
)

export default NotFound
