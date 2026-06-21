import styles from "./LoginModal.module.css";

function LoginModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Вхід до акаунту</h2>

                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <form className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Електронна пошта *</label>
                        <input
                            type="email"
                            placeholder="Введіть email"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Пароль *</label>
                        <span className={styles.hint}>
                            Не менше восьми знаків
                        </span>

                        <input
                            type="password"
                            placeholder="Введіть пароль"
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                    >
                        Увійти
                    </button>
                    <div className={styles.loginSection}>
                        <span>Не має акаунту? Зареєструватися</span>
                        <button
                            type="button"
                            className={styles.loginButton}
                            //onClick={handleOpenLogin}
                            >
                            Увійти
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;