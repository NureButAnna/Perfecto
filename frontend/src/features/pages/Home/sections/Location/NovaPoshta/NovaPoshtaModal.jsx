import { useState, useEffect } from "react";
import { useAuth } from "../../../../../../context/AuthContext";
import { getCategories, getServicesByCategory } from "../../../../../../api/categoryApi";
import styles from "./NovaPoshtaModal.module.css";
import { useTranslation } from "react-i18next";

export default function NovaPoshtaModal({ onClose }) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [categories,       setCategories]       = useState([]);
  const [activeCategory,   setActiveCategory]   = useState(null);
  const [services,         setServices]         = useState([]);
  const [servicesLoading,  setServicesLoading]  = useState(false);
  const [selected,         setSelected]         = useState([]);
  const [city,             setCity]             = useState("");
  const [branch,           setBranch]           = useState("");
  const [comment,          setComment]          = useState("");
  const [loading,          setLoading]          = useState(false);
  const [success,          setSuccess]          = useState(false);
  const [error,            setError]            = useState("");

  useEffect(() => {
    getCategories()
      .then(data => { setCategories(data); if (data.length > 0) setActiveCategory(data[0].id); })
      .catch(() => setError(t("novaPoshta.errorFetch")));
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    setServicesLoading(true);
    setServices([]);
    getServicesByCategory(activeCategory)
      .then(data => setServices(data))
      .catch(() => setError(t("novaPoshta.errorFetch")))
      .finally(() => setServicesLoading(false));
  }, [activeCategory]);

  const toggleService = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected.length === 0) { setError(t("novaPoshta.errorServices")); return; }
    if (!city.trim() || !branch.trim()) { setError(t("novaPoshta.errorCity")); return; }
    setError("");
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 800));
      setSuccess(true);
    } catch {
      setError(t("novaPoshta.errorSubmit"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>📦</span>
            <div>
              <h2 className={styles.title}>{t("novaPoshta.title")}</h2>
              <p className={styles.subtitle}>{t("novaPoshta.subtitle")}</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {success ? (
          <div className={styles.successWrap}>
            <div className={styles.successIcon}>✅</div>
            <h3 className={styles.successTitle}>{t("novaPoshta.successTitle")}</h3>
            <p className={styles.successText}>{t("novaPoshta.successText")}</p>
            <button className={styles.btnPrimary} onClick={onClose}>{t("novaPoshta.close")}</button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.section}>
              <div className={styles.sectionLabel}>{t("novaPoshta.sectionClient")}</div>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>{t("novaPoshta.labelName")}</label>
                  <input className={styles.input} value={`${user?.name ?? ""} ${user?.surname ?? ""}`.trim()} readOnly />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>{t("novaPoshta.labelPhone")}</label>
                  <input className={styles.input} value={user?.phone_number ?? ""} readOnly />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionLabel}>{t("novaPoshta.sectionShipping")}</div>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>{t("novaPoshta.labelCity")}</label>
                  <input className={styles.input} placeholder={t("novaPoshta.placeholderCity")} value={city} onChange={e => setCity(e.target.value)} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>{t("novaPoshta.labelBranch")}</label>
                  <input className={styles.input} placeholder={t("novaPoshta.placeholderBranch")} value={branch} onChange={e => setBranch(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionLabel}>{t("novaPoshta.sectionServices")}</div>
              <div className={styles.field} style={{ marginBottom: 14 }}>
                <label className={styles.label}>{t("novaPoshta.labelCategory")}</label>
                <select className={styles.select} value={activeCategory ?? ""} onChange={e => { setActiveCategory(Number(e.target.value)); setSelected([]); }}>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              {servicesLoading ? (
                <p className={styles.loadingText}>{t("novaPoshta.loadingServices")}</p>
              ) : services.length === 0 ? (
                <p className={styles.loadingText}>{t("novaPoshta.noServices")}</p>
              ) : (
                <div className={styles.servicesGrid}>
                  {services.map(svc => (
                    <div
                      key={svc.id}
                      className={`${styles.serviceCard} ${selected.includes(svc.id) ? styles.serviceCardActive : ""}`}
                      onClick={() => toggleService(svc.id)}
                    >
                      {svc.image?.link && <img src={svc.image.link} alt={svc.name} className={styles.serviceImg} />}
                      <div className={styles.serviceName}>{svc.name}</div>
                      <div className={styles.servicePrice}>{t("novaPoshta.priceFrom", { price: Number(svc.price).toFixed(0) })}</div>
                      {selected.includes(svc.id) && <div className={styles.serviceCheck}>✓</div>}
                    </div>
                  ))}
                </div>
              )}

              {selected.length > 0 && (
                <div className={styles.selectedCount}>
                  {t("novaPoshta.selectedCount", { count: selected.length })}
                </div>
              )}
            </div>

            <div className={styles.section}>
              <div className={styles.field}>
                <label className={styles.label}>{t("novaPoshta.labelComment")}</label>
                <textarea className={styles.textarea} placeholder={t("novaPoshta.placeholderComment")} rows={3} value={comment} onChange={e => setComment(e.target.value)} />
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.footer}>
              <button type="button" className={styles.btnGhost} onClick={onClose}>{t("novaPoshta.cancel")}</button>
              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? t("novaPoshta.submitting") : t("novaPoshta.submit")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}