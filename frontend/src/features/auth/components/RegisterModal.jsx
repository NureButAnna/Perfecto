import styles from "./RegisterModal.module.css";

function RegisterModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Реєстрація</h2>

                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <form className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Ваше ім'я *</label>
                        <input
                            type="text"
                            placeholder="Введіть ваше ім'я"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Введіть прізвище *</label>
                        <input
                            type="text"
                            placeholder="Введіть ваше прізвище"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Номер телефону *</label>
                        <input
                            type="tel"
                            placeholder="+38"
                        />
                    </div>

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

                    <div className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            id="agreement"
                        />

                        <label htmlFor="agreement">
                            Погоджуюсь з умовами використання
                        </label>
                    </div>

                    <p className={styles.policy}>
                        Реєструючись, ви погоджуєтеся на зберігання і
                        використання компанією персональних даних.
                    </p>

                    <button
                        type="submit"
                        className={styles.submitButton}
                    >
                        Зареєструватися
                    </button>
                    <div className={styles.loginSection}>
                        <span>Вже маєте акаунт?</span>
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

export default RegisterModal;