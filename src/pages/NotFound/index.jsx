import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import notFound from "../../assets/404-page-not-found.svg";

import "./notFound.scss";

function NotFound() {
  return (
    <>
      <div className="header-not-found">
        <Link to="/dashboard">
          <img src={logo} alt="Logo" style={{ maxWidth: "100px" }} />
        </Link>
      </div>

      <figure>
        <img src={notFound} alt="Illustration" />

        <figcaption>
          Página não encontrada, ir para <Link to="/dashboard">Home</Link>
        </figcaption>
      </figure>
    </>
  );
}

export default NotFound;
