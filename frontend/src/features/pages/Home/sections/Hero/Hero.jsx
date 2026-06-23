import btn from '../../../../../styles/buttons.module.css';
import s   from './Hero.module.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className={s.hero}>
      <div className={s.container}>
        <div className={s.left}>
          <span className={s.badge}>{t("hero.badge")}</span>
          <h1 className={s.title}>
            {t("hero.title")}{" "}
            <em className={s.accent}>{t("hero.accent")}</em>
          </h1>
          <p className={s.subtitle}>{t("hero.subtitle")}</p>
          <div className={s.btns}>
            <button className={btn.btnPrimary} onClick={() => navigate("/pricelist")}>
              {t("hero.btnPrice")}
            </button>
            <button
              className={btn.btnOutline}
              onClick={() => document.getElementById("location").scrollIntoView({ behavior: "smooth" })}
            >
              {t("hero.btnFind")}
            </button>
          </div>
        </div>
        <div className={s.right}>
          <img
            src="https://perfectoservicestorage.blob.core.windows.net/img/працівниця хімчистки.png"
            alt="Perfecto"
            className={s.img}
          />
        </div>
      </div>
    </section>
  );
}