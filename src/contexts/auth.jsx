import { useState, createContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../services/firebaseConection";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const [showNav, setShowNav] = useState(false);
  const [showModalLogout, setShowModalLogout] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const userStorage = localStorage.getItem("@tickets");

      if (userStorage) {
        setUser(JSON.parse(userStorage));
        setLoading(false);
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  async function signUp(name, email, password) {
    setLoadingAuth(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        await setDoc(doc(db, "users", uid), {
          nome: name,
          avatarUrl: null,
        }).then(() => {
          let data = {
            uid: uid,
            nome: name,
            email: value.user.email,
            avatarUrl: null,
          };

          setUser(data);
          setStorageUser(data);
          setLoadingAuth(false);
          navigate("/dashboard");
          toast.success(`Bem vindo(a)!`);
        });
      })
      .catch((error) => {
        setLoadingAuth(false);
        console.log(error);
        toast.error("Ops, algo deu errado, tente novamente mais tarde.");
      });
  }

  async function signIn(email, password) {
    setLoadingAuth(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        let data = {
          uid: uid,
          nome: docSnap.data().nome,
          email: value.user.email,
          avatarUrl: docSnap.data().avatarUrl,
        };

        setUser(data);
        setStorageUser(data);
        setLoadingAuth(false);
        navigate("/dashboard");
        setLoadingAuth(false);
        toast.success(`Bem vindo(a) de volta!`);
      })
      .catch((error) => {
        console.log(error);
        // inserir tratamento de erro de credenciais
        setLoadingAuth(false);
      });
  }

  function setStorageUser(user) {
    localStorage.setItem("@tickets", JSON.stringify(user));
  }

  async function logOut() {
    await signOut(auth);
    localStorage.removeItem("@tickets");
    setUser(null);
    navigate("/");
  }

  return (
    <AuthContext.Provider
      value={{
        loadingAuth,
        signUp,
        signIn,
        logOut,
        signed: !!user,
        loading,
        user,
        showNav,
        setShowNav,
        setUser,
        setStorageUser,
        showModalLogout,
        setShowModalLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
