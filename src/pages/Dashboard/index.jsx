import { AuthContext } from "../../contexts/auth";
import { useContext, useEffect, useState, useRef } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import ModalDetail from "../../components/ModalDetail";
import { MessagesSquare, Search, Pencil } from "lucide-react";
import { db } from "../../services/firebaseConection";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import Empty from "../../components/EmptyClientes";

import { Link } from "react-router-dom";

import "./dashboard.scss";
import { format } from "date-fns";

import illustration from "../../assets/pngwing.com.png";

const listRef = collection(db, "chamados");

function Dashboard() {
  const { setShowNav, user } = useContext(AuthContext);

  const [chamados, setChamados] = useState([]);

  const [chamadosIsEmpty, setChamadosIsEmpty] = useState(false);

  const [detail, setDetail] = useState();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadChamados = async () => {
      const queryDocs = await getDocs(collection(db, "chamados"))
        .then(async (snapShot) => {
          if (snapShot.docs.length === 0) {
            setChamadosIsEmpty(true);
            return;
          }

          const userCalls = snapShot.docs.filter(
            (doc) => doc.data().userId === user.uid
          );

          if (userCalls.length === 0) setChamadosIsEmpty(true);

          const q = query(listRef, orderBy("created", "desc"));
          const querySnapShot = await getDocs(q);

          setChamados([]);
          await updateState(querySnapShot);
        })
        .catch((error) => console.log(error));
    };

    loadChamados();

    return () => {};
  }, []);

  async function updateState(querySnapShot) {
    const lista = [];

    querySnapShot.forEach((doc) => {
      if (doc.data().userId === user.uid) {
        lista.push({
          createdFormat: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          cliente: doc.data().cliente,
          assunto: doc.data().assunto,
          status: doc.data().status,
          complemento: doc.data().complemento,
          id: doc.id,
          userId: doc.data().userId,
        });
      }
    });

    setChamados((chamados) => [...chamados, ...lista]);
  }

  function statusColor(status) {
    if (status === "Aberto") return "#3bc43b";
    if (status === "Progresso") return "#ffbb00";
    if (status === "Atendido") return "#ccc";
  }

  function toggleModal(item) {
    setDetail(item);
    setShowModal(!showModal);
  }

  return (
    <div className="container">
      <Header />

      <main onClick={() => setShowNav(false)}>
        <div className="content">
          <Title>
            <MessagesSquare size={30} color="#ccc" />
            Chamados
          </Title>

          {!chamadosIsEmpty && (
            <div className="area-btn-add-chamados">
              <Link to="/novochamado">Novo chamado</Link>
            </div>
          )}

          {chamadosIsEmpty ? (
            <section>
              <Empty
                title="Você não possui nenhum chamado.."
                text="Abra um novo chamado"
                aba="aqui"
                link="/novochamado"
                img={illustration}
              />
            </section>
          ) : (
            <section className="table-section">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Data de cadastro</th>
                    <th scope="col"></th>
                  </tr>
                </thead>

                <tbody>
                  {chamados.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Cliente">{item.cliente}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label="Status">
                          <span
                            style={{
                              backgroundColor: statusColor(item.status),
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Data de cadastro">
                          {item.createdFormat}
                        </td>

                        <td>
                          <div className="actions-table">
                            <Link
                              className="search"
                              onClick={() => toggleModal(item)}
                            >
                              <Search size={20} color="#fff" />
                            </Link>
                            <Link
                              className="edit"
                              to={`/novochamado/${item.id}`}
                            >
                              <Pencil size={20} color="#fff" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </main>

      {showModal && (
        <ModalDetail
          conteudo={detail}
          close={() => setShowModal(false)}
          statusBg={statusColor(detail.status)}
        />
      )}
    </div>
  );
}

export default Dashboard;
