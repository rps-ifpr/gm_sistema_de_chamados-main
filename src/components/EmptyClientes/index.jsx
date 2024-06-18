import { Link } from "react-router-dom";
import "./emptyClientes.scss";

function Empty({ title, text, link, img, aba }) {
  return (
    <div className="empty-clientes">
      <figure>
        <img src={img} alt="illustration" />
      </figure>
      <h1>{title}.</h1>
      <p>
        {text} <Link to={link}>{aba}</Link>.
      </p>
    </div>
  );
}

export default Empty;
