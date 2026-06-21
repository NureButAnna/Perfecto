// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null); // "login" | "register" | null

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) { setLoading(false); return; }
    try {
      const res = await authApi.getMe();
      setUser(res.data);
    } catch {
      localStorage.removeItem("access_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    localStorage.setItem("access_token", res.data.access_token);
    await fetchMe();
  };

  const register = async (data) => {
    await authApi.register(data);
    await login(data.email, data.password);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  const updateUser = (updated) => setUser(updated);

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, updateUser,
      isLoginOpen:      modal === "login",
      isRegisterOpen:   modal === "register",
      openLogin:        () => setModal("login"),
      openRegister:     () => setModal("register"),
      closeModal:       () => setModal(null),
      switchToLogin:    () => setModal("login"),
      switchToRegister: () => setModal("register"),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}