import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import "./modalLogout.scss";

function ModalLogout() {
  const { logOut, setShowModalLogout, setShowNav } = useContext(AuthContext);

  function handleLogout() {
    logOut();
    setShowModalLogout(false);
    setShowNav(false);
  }

  return (
    <div className="modal-logout">
      <div className="content">
        <span>Tem certeza que deseja sair?</span>

        <div className="actions">
          <button className="btn-sair" onClick={handleLogout}>
            Sim, quero sair
          </button>
          <button
            className="btn-cancel"
            onClick={() => setShowModalLogout(false)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalLogout;
