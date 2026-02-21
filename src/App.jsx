import { useState, useEffect } from "react";
import { authApi } from "./api";
import { ToastContainer, Spinner } from "./components/UI";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import "./index.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [bootstrapping, setBootstrap] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { 
      setBootstrap(false);
      return;
     }

    authApi.me()
      .then((d) => setUser(d.data.employee))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setBootstrap(false));
  }, []);

  const handleLogin  = (emp) => setUser(emp);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPage("login");
  };

  if (bootstrapping) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner dark />
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      {user ? (
        <DashboardPage user={user} onLogout={handleLogout} />
      ) : page === "login" ? (
        <LoginPage onLogin={handleLogin} onSwitch={() => setPage("register")} />
      ) : (
        <RegisterPage onLogin={handleLogin} onSwitch={() => setPage("login")} />
      )}
    </>
  );
}