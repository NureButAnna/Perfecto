import { useState, useRef, useEffect } from "react";
import styles from "./AiChat.module.css";
import { MessageIcon }  from "../../utils/icons"

const SYSTEM_PROMPT = `Ти — ввічливий ШІ-консультант хімчистки Perfecto. 
Допомагаєш клієнтам з питаннями про послуги, ціни, доставку та догляд за одягом. 
Відповідай коротко, по суті, українською мовою. 
Якщо питання не стосується хімчистки чи одягу — ввічливо поверни розмову до теми.`;

export default function AiChat() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Привіт! Я ШІ-консультант Perfecto 👋 Чим можу допомогти?" }
  ]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      });

      const data = await res.json();
      const reply = data.content?.[0]?.text ?? "Вибачте, не вдалося отримати відповідь.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Виникла помилка. Спробуйте ще раз." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Чат-вікно */}
      {isOpen && (
        <div className={styles.chat}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.avatar}><MessageIcon /></div>
              <div>
                <div className={styles.name}>Perfecto Асистент</div>
                <div className={styles.status}>
                  <span className={styles.dot} />
                  Онлайн
                </div>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.msg} ${msg.role === "user" ? styles.msgUser : styles.msgBot}`}
              >
                {msg.role === "assistant" && (
                  <div className={styles.msgAvatar}>✦</div>
                )}
                <div className={styles.msgBubble}>{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className={`${styles.msg} ${styles.msgBot}`}>
                <div className={styles.msgAvatar}>✦</div>
                <div className={`${styles.msgBubble} ${styles.typing}`}>
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className={styles.inputRow}>
            <textarea
              className={styles.input}
              placeholder="Напишіть питання..."
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className={styles.sendBtn}
              onClick={sendMessage}
              disabled={!input.trim() || loading}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Кнопка відкриття */}
      <button
        className={`${styles.fab} ${isOpen ? styles.fabOpen : ""}`}
        onClick={() => setIsOpen(v => !v)}
        title="ШІ-консультант"
      >
        {isOpen ? "✕" : <MessageIcon />}
      </button>
    </div>
  );
}