import btn from '../../../../../styles/buttons.module.css';
import s   from './Hero.module.css';
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className={s.hero}>
      <div className={s.inner}>
        <div className={s.left}>
          <span className={s.badge}>Працюємо з 1998 року</span>
          <h1 className={s.title}>
            Чистота без зайвих турбот —{" "}
            <em className={s.accent}>якісно, швидко, зручно.</em>
          </h1>
          <p className={s.subtitle}>
            Завдяки багаторічному досвіду ми забезпечуємо
            професійний догляд за вашими речами.
          </p>
          <div className={s.btns}>
             <button
                className={btn.btnPrimary}
                onClick={() => navigate("/pricelist")}
              >
                Розрахувати вартість
            </button>
            <button
            className={btn.btnOutline}
            onClick={() =>
              document.getElementById("location").scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Пошук відділення
            </button>
          </div>
        </div>
        <div className={s.right}>
          <img
            src="https://perfectoservicestorage.blob.core.windows.net/img/працівниця хімчистки.png"
            alt="Працівниця хімчистки"
            className={s.img}
          />
        </div>
      </div>
    </section>
  );
}