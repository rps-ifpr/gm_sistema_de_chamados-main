import { X } from "lucide-react";

import "./modalDetail.scss";

function ModalDetail({ conteudo, close, statusBg }) {
  return (
    <div className="modal-detail">
      <div className="modal-detail-content">
        <div className="close">
          <X size={28} color="#ccc" onClick={close} />
        </div>

        <div className="text-content">
          <h2>Detalhes do chamado</h2>

          <p>
            <strong>Cliente:</strong>
            <span>{conteudo.cliente}</span>
          </p>

          <p>
            <strong>Assunto:</strong>
            <span>{conteudo.assunto}</span>
          </p>

          <p>
            <strong>Cadastrado em:</strong>
            <span>{conteudo.createdFormat}</span>
          </p>

          <p>
            <strong>Status:</strong>
            <span className="status" style={{ backgroundColor: statusBg }}>
              {conteudo.status}
            </span>
          </p>

          {conteudo.complemento !== "" && (
            <p>
              <strong>Complemento:</strong>
              <span>{conteudo.complemento}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalDetail;
