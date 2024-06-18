import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { BadgePlus } from "lucide-react";
import { db } from "../../services/firebaseConection";
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Empty from "../../components/EmptyClientes";

import { useNavigate } from "react-router-dom";

import "./novoChamado.scss";
import illustration from "../../assets/no-user-found.png";

const listRef = collection(db, "clientes");

function NovoChamado() {
  const { setShowNav, user } = useContext(AuthContext);
  const [loadingChamado, setLoadingChamado] = useState(false);

  const [loadingClientes, setLoadingClientes] = useState(false);

  const { id } = useParams();

  const [clientes, setClientes] = useState([]);
  const [clienteSelected, setClienteSelected] = useState(0);
  const [clienteIsEmpty, setClienteIsEmpty] = useState(false);
  const [status, setStatus] = useState("Aberto");
  const [assunto, setAssunto] = useState("Suporte");
  const [complemento, setComplemento] = useState("");

  const [idCliente, setIdCliente] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadClientes = async () => {
      setLoadingClientes(true);

      const querySnapShot = await getDocs(listRef)
        .then((snapshot) => {
          if (snapshot.docs.length === 0) {
            setClienteIsEmpty(true);
            setLoadingClientes(false);
            return;
          }

          let lista = [];

          snapshot.forEach((doc) => {
            if (doc.data().userId === user.uid) {
              lista.push({ id: doc.id, nomeEmpresa: doc.data().nomeEmpresa });
            }
          });

          if (lista.length === 0) {
            setLoadingClientes(false);
            setClienteIsEmpty(true);
          }

          setClientes(lista);
          setLoadingClientes(false);

          if (id) {
            loadId(lista);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Desculpe, não foi possível carregar clientes.");
          setLoadingClientes(false);
          setClientes([]);
          setClienteIsEmpty(true);
        });
    };

    loadClientes();
  }, [id]);

  async function loadId(lista) {
    const docRef = doc(db, "chamados", id);

    const querySnapShot = await getDoc(docRef).then((snapshot) => {
      setAssunto(snapshot.data().assunto);
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento);

      let index = lista.findIndex(
        (item) => item.id === snapshot.data().ClienteId
      );

      setClienteSelected(index);
      setIdCliente(true);
    });
  }

  async function handleRegister(e) {
    e.preventDefault();

    setLoadingChamado(true);

    if (idCliente) {
      const docRef = doc(db, "chamados", id);

      await updateDoc(docRef, {
        cliente: clientes[clienteSelected].nomeEmpresa,
        assunto: assunto,
        status: status,
        complemento: complemento,
        ClienteId: clientes[clienteSelected].id,
        userId: user.uid,
      })
        .then(() => {
          toast.warn("Chamado editado com sucesso.");
          setClienteSelected(0);
          setAssunto("Suporte");
          setStatus("Aberto");
          navigate("/dashboard");
          setLoadingChamado(false);
        })
        .catch((error) => {
          setLoadingChamado(false);
          if (error.code === "not-found") return;
          console.log(error);
          toast.error("Ocorreu um erro tente novamente mais tarde");
        });

      return;
    }

    await addDoc(collection(db, "chamados"), {
      created: new Date(),
      cliente: clientes[clienteSelected].nomeEmpresa,
      assunto: assunto,
      status: status,
      complemento: complemento,
      ClienteId: clientes[clienteSelected].id,
      userId: user.uid,
    })
      .then(() => {
        toast.success("Chamado adicionado com sucesso.");
        setClienteSelected(0);
        setAssunto("");
        setStatus("Aberto");
        setComplemento("");
        setLoadingChamado(false);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Desculpe, ocorreu um erro, tente novamente mais tarde.");
        setLoadingChamado(false);
      });

    if (id) {
    }
  }

  function handleChangeClientes(e) {
    setClienteSelected(e.target.value);
  }

  function handleChangeAssunto(e) {
    setAssunto(e.target.value);
  }

  function handleChangeStatus(e) {
    setStatus(e.target.value);
  }

  async function deleteChamado() {
    const docRef = doc(db, "chamados", id);

    await deleteDoc(docRef)
      .then(() => {
        navigate("/dashboard");
        toast.success("Chamado excluído");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Algo deu errado, tente novamente.");
      });
  }

  return (
    <div className="container">
      <Header />

      <main onClick={() => setShowNav(false)}>
        <div className="content">
          <Title>
            <BadgePlus size={30} color="#ccc" />
            {idCliente ? "Editar chamado" : "Novo chamado"}
          </Title>

          <section>
            {clienteIsEmpty ? (
              <Empty
                title="Não há nehum cliente para abrir um chamado.."
                text="Adicione um novo cliente na aba"
                aba="clientes"
                link="/clientes"
                img={illustration}
              />
            ) : (
              <form className="form-profile" onSubmit={handleRegister}>
                <div className="input-area">
                  <label>
                    {loadingClientes ? "Carregando Clientes..." : "Clientes"}
                  </label>

                  <select
                    value={clienteSelected}
                    onChange={handleChangeClientes}
                  >
                    {clientes.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item.nomeEmpresa}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="input-area">
                  <label>Assunto</label>

                  <select value={assunto} onChange={handleChangeAssunto}>
                    <option value="Suporte">Suporte</option>
                    <option value="Visita técnica">Visita técnica</option>
                    <option value="Financeiro">Financeiro</option>
                  </select>
                </div>

                <div className="input-area">
                  <label>Status</label>

                  <div className="radio-area">
                    <div>
                      <input
                        type="radio"
                        name="status"
                        value="Aberto"
                        id="aberto"
                        checked={status === "Aberto"}
                        onChange={handleChangeStatus}
                      />
                      <label
                        htmlFor="aberto"
                        style={{ marginBottom: "0", fontSize: "16px" }}
                      >
                        Aberto
                      </label>
                    </div>

                    <div>
                      <input
                        type="radio"
                        name="status"
                        value="Progresso"
                        id="progresso"
                        checked={status === "Progresso"}
                        onChange={handleChangeStatus}
                      />
                      <label
                        htmlFor="progresso"
                        style={{ marginBottom: "0", fontSize: "16px" }}
                      >
                        Progresso
                      </label>
                    </div>

                    <div>
                      <input
                        type="radio"
                        name="status"
                        value="Atendido"
                        id="atendido"
                        checked={status === "Atendido"}
                        onChange={handleChangeStatus}
                      />
                      <label
                        htmlFor="atendido"
                        style={{ marginBottom: "0", fontSize: "16px" }}
                      >
                        Atendido
                      </label>
                    </div>
                  </div>
                </div>

                <div className="input-area">
                  <label>Complemento</label>

                  <textarea
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                  />
                </div>

                <div className="btn-area">
                  <button
                    className="default-btn"
                    onClick={handleRegister}
                    style={loadingChamado ? { opacity: "0.7" } : {}}
                  >
                    Salvar
                  </button>
                  {id && (
                    <button
                      className="default-btn"
                      style={{ backgroundColor: "#e02222", marginLeft: "14px" }}
                      onClick={deleteChamado}
                    >
                      Excluir chamado
                    </button>
                  )}

                  {loadingChamado && <Loader />}
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default NovoChamado;
