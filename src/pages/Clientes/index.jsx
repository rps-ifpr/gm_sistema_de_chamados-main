import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import Title from "../../components/Title";
import Loader from "../../components/Loader";
import { BadgePlus } from "lucide-react";
import { db } from "../../services/firebaseConection";
import { addDoc, collection } from "firebase/firestore";

import { useForm } from "react-hook-form";

import { toast } from "react-toastify";

import "./clientes.scss";

function Clientes() {
  const { setShowNav, user } = useContext(AuthContext);

  const [loadingChanges, setLoadingChanges] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function onSubmit(data) {
    const { nomeEmpresa, cnpj, endereco } = data;

    setLoadingChanges(true);

    await addDoc(collection(db, "clientes"), {
      nomeEmpresa: nomeEmpresa,
      cnpj: cnpj,
      endereco: endereco,
      userId: user.uid,
    })
      .then(() => {
        setLoadingChanges(false);
        toast.success("Registrado com sucesso");
        reset({ nomeEmpresa: "", cnpj: "", endereco: "" });
      })
      .catch((error) => {
        console.log(error);
        setLoadingChanges(false);
      });
  }

  return (
    <div className="container">
      <Header />

      <main onClick={() => setShowNav(false)}>
        <div className="content">
          <Title>
            <BadgePlus size={30} color="#ccc" />
            Adicionar Cliente
          </Title>

          <section>
            <div className="form-clientes">
              <div className="input-container">
                <label htmlFor="nome-empresa">Nome Fantasia</label>

                <input
                  className={errors?.nomeEmpresa && "input-error"}
                  required
                  type="text"
                  placeholder="Nome da empresa"
                  id="nome-empresa"
                  {...register("nomeEmpresa", { required: true })}
                />

                {errors?.nomeEmpresa && (
                  <p className="error-message">Insira o nome da empresa</p>
                )}
              </div>

              <div className="input-container">
                <label htmlFor="cnpj">CNPJ</label>

                <input
                  className={errors?.cnpj && "input-error"}
                  required
                  type="text"
                  placeholder="Digite o CNPJ"
                  id="cnpj"
                  {...register("cnpj", { required: true })}
                />

                {errors?.cnpj && (
                  <p className="error-message">Insira o cnpj da empresa</p>
                )}
              </div>

              <div className="input-container">
                <label htmlFor="endereco-empresa">Endereço</label>

                <input
                  className={errors?.endereco && "input-error"}
                  required
                  type="text"
                  placeholder="Endereço da empresa"
                  id="endereco-empresa"
                  {...register("endereco", { required: true })}
                />

                {errors?.endereco && (
                  <p className="error-message">Insira o endereço da empresa</p>
                )}
              </div>

              <div className="btn-area">
                <button
                  className="default-btn"
                  onClick={() => handleSubmit(onSubmit)()}
                  style={loadingChanges ? { opacity: "0.7" } : {}}
                >
                  Salvar
                </button>
                {loadingChanges && <Loader />}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Clientes;
