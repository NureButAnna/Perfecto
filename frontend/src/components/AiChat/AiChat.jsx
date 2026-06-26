import { useState, useRef, useEffect } from "react";
import styles from "./AiChat.module.css";
import { MessageIcon } from "../../utils/icons";
import { SYSTEM_PROMPT, WELCOME_MESSAGE } from "../../config/aiChatConfig";

const AZURE_ENDPOINT  = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_API_KEY   = import.meta.env.VITE_AZURE_OPENAI_KEY;
const DEPLOYMENT_NAME = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT;

export default function AiChat() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: WELCOME_MESSAGE }
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
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

      const res = await fetch(
        `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-01`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": AZURE_API_KEY,
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...history,
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Azure OpenAI error:", err);
        throw new Error(err.error?.message ?? "Помилка запиту");
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content
        ?? "Вибачте, не вдалося отримати відповідь. Зверніться до адміністратора.";

      setMessages(prev => [...prev, { role: "assistant", text: reply }]);

    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "Виникла помилка зв'язку 😔\nБудь ласка, зверніться до адміністратора або спробуйте пізніше.",
        },
      ]);
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
                <div className={styles.msgBubble}>
                  {/* Підтримка переносів рядка у повідомленнях */}
                  {msg.text.split("\n").map((line, j) => (
                    <span key={j}>{line}{j < msg.text.split("\n").length - 1 && <br />}</span>
                  ))}
                </div>
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