import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import LoginModal from "../Auth/LoginModule";
import RegisterModal from "../Auth/RegisterModule";
import { IoSearch, IoCartOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useServices } from "../../hooks/services/useServices";
import CategoryDropdown from "../../features/pages/Services/components/CategoryDropdown";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function Header() {
  const {
    user, logout,
    isLoginOpen, isRegisterOpen,
    openLogin, closeModal,
    switchToLogin, switchToRegister,
  } = useAuth();

  const { t, i18n } = useTranslation();

  const [isServicesOpen,   setIsServicesOpen]   = useState(false);
  const [isCartOpen,       setIsCartOpen]       = useState(false);
  const [isUserMenuOpen,   setIsUserMenuOpen]   = useState(false);
  const [isMobileOpen,     setIsMobileOpen]     = useState(false);
  const [isMobileCatsOpen, setIsMobileCatsOpen] = useState(false);

  const { categories } = useServices();
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "uk" ? "en" : "uk");
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(`.${styles.dropdown}`))    setIsServicesOpen(false);
      if (!e.target.closest(`.${styles.userMenu}`))    setIsUserMenuOpen(false);
      if (!e.target.closest(`.${styles.cartWrapper}`)) setIsCartOpen(false);
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

        <button className={styles.menuButton} onClick={toggleLang} title={t("header.switchLang")}>
          {i18n.language === "uk" ? "EN" : "УК"}
        </button>

        <div className={styles.searchBox}>
          <input type="text" placeholder={t("header.search")} />
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
                    👤 {t("header.profile")}
                  </Link>
                  <button
                    className={`${styles.userDropdownItem} ${styles.userDropdownLogout}`}
                    onClick={() => { logout(); setIsUserMenuOpen(false); }}
                  >
                    🚪 {t("header.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className={styles.menuButton} onClick={openLogin}>
              <FaRegUser size={18} />
            </button>
          )}

          <div className={styles.cartWrapper}>
            <button className={styles.menuButton} onClick={() => setIsCartOpen((v) => !v)}>
              <IoCartOutline size={20} />
              {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
            </button>
            {isCartOpen && (
              <div className={styles.cartDropdown}>
                {cart.length === 0 ? (
                  <p>{t("header.cartEmpty")}</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className={styles.cartItem}>
                      <p>{item.name}</p>
                      <small>{item.price} {t("header.currency")} × {item.quantity}</small>
                    </div>
                  ))
                )}
                <Link to="/cart" onClick={() => setIsCartOpen(false)}>{t("header.goToCart")}</Link>
              </div>
            )}
          </div>

          <button
            className={styles.hamburger}
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label={t("header.menu")}
          >
            {isMobileOpen ? <IoCloseOutline /> : <IoMenuOutline />}
          </button>
        </div>
      </div>

      {/* desktop navbar */}
      <nav className={styles.navbar}>
        <Link to="/">{t("header.home")}</Link>
        <div className={styles.dropdown}>
          <button className={styles.navLink} onClick={() => setIsServicesOpen((v) => !v)}>
            {t("header.services")}
          </button>
          {isServicesOpen && (
            <div className={styles.dropdownMenu}>
              <CategoryDropdown categories={categories} onClose={() => setIsServicesOpen(false)} />
            </div>
          )}
        </div>
        <Link to="/pricelist">{t("header.pricelist")}</Link>
        <Link to="/photo">{t("header.photo")}</Link>
        <Link to="/delivery">{t("header.delivery")}</Link>
      </nav>

      {/* mobile nav */}
      <nav className={`${styles.mobileNav} ${isMobileOpen ? styles.open : ""}`}>
        <Link to="/" onClick={() => setIsMobileOpen(false)}>{t("header.home")}</Link>

        <button className={styles.mobileNavLink} onClick={() => setIsMobileCatsOpen((v) => !v)}>
          {t("header.services")} {isMobileCatsOpen ? "↑" : "↓"}
        </button>
        {isMobileCatsOpen && (
          <div className={styles.mobileCategories}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                onClick={() => { setIsMobileOpen(false); setIsMobileCatsOpen(false); }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        <Link to="/pricelist" onClick={() => setIsMobileOpen(false)}>{t("header.pricelist")}</Link>
        <Link to="/photo"     onClick={() => setIsMobileOpen(false)}>{t("header.photo")}</Link>
        <Link to="/delivery"  onClick={() => setIsMobileOpen(false)}>{t("header.delivery")}</Link>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={closeModal} onSwitchToRegister={switchToRegister} />
      <RegisterModal isOpen={isRegisterOpen} onClose={closeModal} onSwitchToLogin={switchToLogin} />
    </header>
  );
}