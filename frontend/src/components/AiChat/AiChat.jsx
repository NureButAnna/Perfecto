import { useState, useRef, useEffect } from "react";
import styles from "./AiChat.module.css";
import { MessageIcon } from "../../utils/icons";
import { WELCOME_MESSAGE } from "../../config/aiChatConfig";
import { useAuth } from "../../context/AuthContext";

const BACKEND = import.meta.env.VITE_API_URL;

function getSessionId() {
  let sid = sessionStorage.getItem("chat_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("chat_session_id", sid);
  }
  return sid;
}

export default function AiChat() {
  const { user } = useAuth();

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

  // Якщо юзер щойно залогінився — прив'язуємо гостьову сесію до акаунту
  useEffect(() => {
    if (!user) return;
    const sid = sessionStorage.getItem("chat_session_id");
    if (!sid) return;

    const formData = new FormData();
    formData.append("client_id", user.id);

    fetch(`${BACKEND}/ai-chats/attach-session`, {
      method: "POST",
      headers: { "X-Session-ID": sid },
      body: formData,
    }).catch(console.error);
  }, [user]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", text);

      // Якщо є авторизований юзер — передаємо client_id, інакше session_id
      const headers = {};
      if (user?.id) {
        formData.append("client_id", user.id);
      } else {
        headers["X-Session-ID"] = getSessionId();
      }

      const res = await fetch(`${BACKEND}/ai-chats/continue`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? "Помилка запиту");
      }

      const data = await res.json();
      const reply = data.answer ?? "Вибачте, не вдалося отримати відповідь.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);

    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Виникла помилка 😔 Спробуйте ще раз або зверніться до адміністратора." }
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
                  {msg.text.split("\n").map((line, j, arr) => (
                    <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
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