import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import LoginModal from "../Auth/LoginModule";
import RegisterModal from "../Auth/RegisterModule";
import { IoSearch, IoCartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useServices } from "../../hooks/services/useServices";
import CategoryDropdown from "../../features/pages/Services/components/CategoryDropdown";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const {
    user, logout,
    isLoginOpen, isRegisterOpen,
    openLogin, closeModal,
    switchToLogin, switchToRegister,
  } = useAuth();

  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isCartOpen,     setIsCartOpen]     = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { categories } = useServices();
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(`.${styles.dropdown}`)) setIsServicesOpen(false);
      if (!e.target.closest(`.${styles.userMenu}`))  setIsUserMenuOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const initials = user
    ? [user.name?.[0], user.surname?.[0]].filter(Boolean).join("").toUpperCase()
    : null;

  return (
    <header className={styles.header}>
      <div className={styles.topHeader}>
        <button className={styles.menuButton}>UA</button>

        <div className={styles.searchBox}>
          <input type="text" placeholder="Пошук" />
          <button><IoSearch /></button>
        </div>

        <h1 className={styles.logo}>Perfecto</h1>

        <div className={styles.phone}>+38 (050) 678 99 00</div>

        <div className={styles.icons}>
          {user ? (
            <div className={styles.userMenu}>
              <button
                className={styles.avatarBtn}
                onClick={() => setIsUserMenuOpen((v) => !v)}
                title={`${user.name} ${user.surname}`}
              >
                {initials}
              </button>

              {isUserMenuOpen && (
                <div className={styles.userDropdown}>
                  <div className={styles.userDropdownName}>{user.name} {user.surname}</div>
                  <div className={styles.userDropdownEmail}>{user.email}</div>
                  <hr className={styles.divider} />
                  <Link to="/profile" className={styles.userDropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                    👤 Мій профіль
                  </Link>
                  <button
                    className={`${styles.userDropdownItem} ${styles.userDropdownLogout}`}
                    onClick={() => { logout(); setIsUserMenuOpen(false); }}
                  >
                    🚪 Вийти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className={styles.menuButton} onClick={openLogin}>
              <FaRegUser size={24} />
            </button>
          )}

          <div className={styles.cartWrapper}>
            <button className={styles.menuButton} onClick={() => setIsCartOpen((v) => !v)}>
              <IoCartOutline size={28} />
              {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
            </button>

            {isCartOpen && (
              <div className={styles.cartDropdown}>
                {cart.length === 0 ? (
                  <p>Кошик порожній</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className={styles.cartItem}>
                      <p>{item.name}</p>
                      <small>{item.price} грн × {item.quantity}</small>
                    </div>
                  ))
                )}
                <Link to="/cart" onClick={() => setIsCartOpen(false)}>Перейти в кошик</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className={styles.navbar}>
        <Link to="/">Головна</Link>

        <div className={styles.dropdown}>
          <button className={styles.navLink} onClick={() => setIsServicesOpen((v) => !v)}>
            Послуги
          </button>
          {isServicesOpen && (
            <div className={styles.dropdownMenu}>
              <CategoryDropdown categories={categories} onClose={() => setIsServicesOpen(false)} />
            </div>
          )}
        </div>

        <Link to="/pricelist">Прайс-лист</Link>
        <Link to="/photo">Фото-аналіз</Link>
        <Link to="/delivery">Доставка</Link>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={closeModal} onSwitchToRegister={switchToRegister} />
      <RegisterModal isOpen={isRegisterOpen} onClose={closeModal} onSwitchToLogin={switchToLogin} />
    </header>
  );
}