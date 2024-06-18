import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { useContext } from "react";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  nome: z.string().min(1, "Campo nome não pode estar vazio."),
  email: z
    .string()
    .min(1, "Campo email não pode estar vazio")
    .email("Digite um email válido"),
  password: z
    .string()
    .min(1, "Campo senha não pode estar vazio.")
    .min(6, "Senha deve conter no minimo 6 caracteres"),
});

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { signUp, loadingAuth } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(data) {
    const { nome, email, password } = data;

    await signUp(nome, email, password);
  }

  return (
    <div className="login-area">
      <div className="card">
        <div className="loading-area">
          <span className={loadingAuth ? "loading-animation" : ""}></span>
        </div>
        <img src={logo} alt="Logo Gm solutions" />
        <span style={{ marginBottom: "0" }}>Criar nova conta</span>

        <div className="form">
          <div className="input-container">
            <input
              className={errors?.nome && "input-error"}
              type="text"
              id="name"
              autoComplete="off"
              {...register("nome")}
              placeholder="Nome"
            />
            <label htmlFor="email">Nome</label>

            {errors?.nome && (
              <p className="error-message">{errors.nome.message}</p>
            )}
          </div>

          <div className="input-container">
            <input
              className={errors?.email && "input-error"}
              type="text"
              id="email"
              autoComplete="off"
              {...register("email")}
              placeholder="Email"
            />
            <label htmlFor="email">Email</label>

            {errors?.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          <div className="input-container">
            <input
              className={errors?.password && "input-error"}
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="off"
              {...register("password")}
              placeholder="Senha"
            />
            <label htmlFor="password">Senha</label>

            <button
              className="btn-toggle-password"
              onClick={() => setShowPassword(() => !showPassword)}
            >
              {showPassword ? (
                <Eye size={24} color="#ccc" />
              ) : (
                <EyeOff size={24} color="#ccc" />
              )}
            </button>

            {errors?.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <div className="actions-area">
            <button
              onClick={() => handleSubmit(onSubmit)()}
              className="default-btn"
            >
              Cadastrar
            </button>
            <Link
              to="/"
              style={{
                width: "100%",
                textAlign: "center",
                marginTop: "3.6rem",
              }}
            >
              Já possui uma conta? Faça login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
