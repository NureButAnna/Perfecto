import { useState } from "react";

export function useAuthModal() {
  const [modal, setModal] = useState(null);

  return {
    isLoginOpen:    modal === "login",
    isRegisterOpen: modal === "register",
    openLogin:      () => setModal("login"),
    openRegister:   () => setModal("register"),
    closeModal:     () => setModal(null),
    switchToLogin:  () => setModal("login"),
    switchToRegister: () => setModal("register"),
  };
}