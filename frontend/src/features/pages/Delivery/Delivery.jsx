import { useState } from 'react';
import { steps } from '../../../data/deliveryData';
import {
ShieldCheck,
Clock,
MapPin,
Send,
HelpCircle,
Phone,
Sparkles,
} from 'lucide-react';

import styles from './Delivery.module.css';

export const DeliveryTab = ({ onOpenCourierBooking }) => {
const [question, setQuestion] = useState('');
const [askSuccess, setAskSuccess] = useState(false);

const handleAsk = (e) => {
e.preventDefault();

};

return ( <div id="delivery-tab-panel" className={styles.container}> <div className={styles.titleSection}> 

    <h2 className={styles.heading}>
      Послуга доставки
    </h2>

    <p className={styles.description}>
      Професійно забираємо та привозимо речі за вашою адресою у захисних пакетах та на вішалках.
    </p>
  </div>

  <section className={styles.stepsSection}>
    <h3 className={styles.stepsTitle}>
      Як це працює
    </h3>

    <div className={styles.stepsGrid}>
      {steps.map((step, idx) => (
        <div key={idx} className={styles.stepCard}>
          <div className={styles.stepNumber}>
            {idx + 1}
          </div>

          <div className={styles.stepContent}>
            <h4 className={styles.stepTitle}>
              {step.title}
            </h4>

            <p className={styles.stepDescription}>
              {step.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>

  <div className={styles.cardGrid}>
    <div className={styles.infoCard}>
      <h3 className={styles.cardTitle}>
        <ShieldCheck size={20} />
        <span>Умови та гарантії доставки</span>
      </h3>

      <div className={styles.features}>
        <div className={styles.featureItem}>
          <Clock size={18} />
          <div>
            <span className={styles.featureTitle}>
              Пунктуальність понад усе
            </span>

            <p className={styles.featureText}>
              Прибуваємо у погоджений часовий проміжок та попереджаємо про прибуття.
            </p>
          </div>
        </div>

        <div className={styles.featureItem}>
          <MapPin size={18} />
          <div>
            <span className={styles.featureTitle}>
              Географія обслуговування
            </span>

            <p className={styles.featureText}>
              Обслуговуємо все місто та найближчі населені пункти.
            </p>
          </div>
        </div>

        <div className={styles.featureItem}>
          <Sparkles size={18} />
          <div>
            <span className={styles.featureTitle}>
              Захисне пакування
            </span>

            <p className={styles.featureText}>
              Кожна річ пакується перед транспортуванням для збереження чистоти.
            </p>
          </div>
        </div>
      </div>

      <button
        id="book-courier-btn-primary"
        onClick={onOpenCourierBooking}
        className={styles.primaryButton}
      >
        Замовити виїзд кур’єра
      </button>
    </div>

    <div className={styles.questionCard}>
      <div>
        <h3 className={styles.cardTitle}>
          <HelpCircle size={20} />
          <span>Питання до спеціаліста</span>
        </h3>

        <p className={styles.questionDescription}>
          Маєте питання щодо послуги? Надішліть його нам.
        </p>

        {askSuccess ? (
          <div className={styles.success}>
            ✓ Ваше звернення успішно надіслано!
          </div>
        ) : (
          <form onSubmit={handleAsk} className={styles.form}>
            <textarea
              rows={3}
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Напишіть своє питання..."
              className={styles.textarea}
            />

            <button
              type="submit"
              className={styles.submitButton}
            >
              <Send size={14} />
              <span>Надіслати питання</span>
            </button>
          </form>
        )}
      </div>

      <div className={styles.hotline}>
        <span>Гаряча лінія:</span>

        <a
          href="tel:+380506789900"
          className={styles.hotlineLink}
        >
          <Phone size={14} />
          <span>+380 50 678 99 00</span>
        </a>
      </div>
    </div>
  </div>
</div>

);
};

export default DeliveryTab;
