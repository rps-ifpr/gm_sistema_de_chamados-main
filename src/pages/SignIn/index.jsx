import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { EyeOff, Eye } from "lucide-react";

import "./signIn.scss";

const schema = z.object({
  email: z
    .string()
    .min(1, "Campo email não pode estar vazio")
    .email("Insira um email válido."),
  password: z.string().min(1, "Campo senha não pode estar vazio"),
});

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { loadingAuth, signIn } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(data) {
    const { email, password } = data;
    await signIn(email, password);
  }

  return (
    <div className="login-area">
      <div className="card">
        <div className="loading-area">
          <span className={loadingAuth ? "loading-animation" : ""}></span>
        </div>
        <img src={logo} alt="Logo Gm solutions" />

        <span>Login</span>
        <p>Use sua conta Gm Solutions</p>

        <div className="form">
          <div className="input-container">
            <input
              className={errors?.email && "input-error"}
              type="text"
              id="email"
              autoComplete="off"
              {...register("email")}
              placeholder="email"
            />
            <label htmlFor="email">Email</label>

            {errors?.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          <div className="input-container">
            <input
              className={`default-input ${errors?.password && "input-error"}`}
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="off"
              {...register("password")}
              placeholder="Senha"
            />
            <label htmlFor="password">Senha</label>

            {errors?.password && (
              <p className="error-message">{errors.password.message}</p>
            )}

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
          </div>

          <div className="actions-area">
            <Link to="/register">Criar uma conta</Link>
            <button
              onClick={() => handleSubmit(onSubmit)()}
              className="default-btn"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
