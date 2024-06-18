import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import Private from "./Private";
import Profile from "../pages/Profile";
import Clientes from "../pages/Clientes";
import NotFound from "../pages/NotFound";
import NovoChamado from "../pages/NovoChamado";

function RoutesApp() {
  const { signed } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={signed ? <Dashboard /> : <SignIn />} />
      <Route path="/register" element={<SignUp />} />

      <Route
        path="/dashboard"
        element={
          <Private>
            <Dashboard />
          </Private>
        }
      />

      <Route
        path="/profile"
        element={
          <Private>
            <Profile />
          </Private>
        }
      />

      <Route
        path="/clientes"
        element={
          <Private>
            <Clientes />
          </Private>
        }
      />

      <Route
        path="/novochamado/:id?"
        element={
          <Private>
            <NovoChamado />
          </Private>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default RoutesApp;
