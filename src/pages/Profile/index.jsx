import { useContext, useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { Settings, Pencil, UserRound } from "lucide-react";
import { AuthContext } from "../../contexts/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConection";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

import "./profile.scss";

function Profile() {
  const { user, setUser, setStorageUser, setShowNav } = useContext(AuthContext);

  const [loadingChanges, setLoadingChanges] = useState(false);

  // efeito visual instataneo
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  // para alterar no banco
  const [imageAvatar, setImageAvatar] = useState(null);

  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);

  function handleFile(e) {
    const img = e.target.files[0];

    if (img.type === "image/jpeg" || img.type === "image/png") {
      setImageAvatar(img);

      setAvatarUrl(URL.createObjectURL(img));
    } else {
      alert("Insira uma imagem do tipo jpeg ou png.");
    }
  }

  async function handleUpload() {
    setLoadingChanges(true);

    const currentUid = user.uid;

    // cria um caminho de referencia no banco para armazenar a imagem
    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);

    uploadBytes(uploadRef, imageAvatar)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadUrl) => {
          let profileImage = downloadUrl;

          const docRef = doc(db, "users", currentUid);

          await updateDoc(docRef, {
            nome: nome,
            avatarUrl: profileImage,
          }).then(() => {
            let data = {
              ...user,
              nome: nome,
              avatarUrl: profileImage,
            };

            setUser(data);
            setStorageUser(data);
            toast.success("Dados alterados com sucesso!");
            setLoadingChanges(false);
          });
        });
      })
      .catch((e) => {
        console.log(e);
        toast.error("Ops, ocorreu um erro, tente novamente mais tarde.");
        setLoadingChanges(false);
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (imageAvatar === null && nome !== "") {
      if (nome === user.nome) return;

      setLoadingChanges(true);

      let uid = user.uid;
      const docRef = doc(db, "users", uid);

      await updateDoc(docRef, {
        nome: nome,
      })
        .then(() => {
          let data = {
            ...user,
            nome: nome,
          };

          setUser(data);
          setStorageUser(data);
          toast.success("Dados alterados com sucesso!");
          setLoadingChanges(false);
        })
        .catch((e) => {
          console.log(e);
          toast.error("Ops, ocorreu um erro, tente novamente mais tarde.");
          setLoadingChanges(false);
        });
    } else if (imageAvatar !== null && nome !== "") {
      handleUpload();
    }
  }

  return (
    <div className="container">
      <Header />

      <main onClick={() => setShowNav(false)}>
        <div className="content">
          <Title>
            <Settings size={30} color="#ccc" />
            Perfil
          </Title>

          <section>
            <form className="form-profile" onSubmit={handleSubmit}>
              <div className="avatar-container">
                {avatarUrl === null ? (
                  <UserRound size={180} color="#ccc" />
                ) : (
                  <img src={avatarUrl} alt="Foto de perfil" />
                )}

                <label htmlFor="input-file">
                  <Pencil size={16} color="#fff" />
                  Editar
                </label>
                <input
                  type="file"
                  accept="img/*"
                  id="input-file"
                  onChange={handleFile}
                />
              </div>

              <div className="input-area">
                <label>Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="input-area">
                <label>Email</label>
                <input type="text" readOnly value={email} className="email" />
              </div>

              <div className="btn-area">
                <button
                  className="default-btn"
                  type="submit"
                  style={loadingChanges ? { opacity: "0.7" } : {}}
                >
                  Salvar
                </button>
                {loadingChanges && <Loader />}
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Profile;
