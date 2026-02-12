import React from "react";
import { useSelector } from "react-redux";
import logo from "../assets/light_logo.png";
import "../styles/dot-loader.css";
const ChatHistory = () => {
  const chats = useSelector((s) => s.chat.chats);
  const currentChatId = useSelector((s) => s.chat.currentChatId);
  const chat = chats.find((c) => c._id === currentChatId);

  if (!chat || chat.messages.length === 0)
    return (
      <div className="pg-empty">
        <img className="logo_img" src={logo} alt="" />
        <h2 className="title_gpt">PrimeGPT</h2>
        <p className="desc">
          I’m here to help you find answers and solve problems. Whether it’s a
          quick question or a complex challenge. I’ll guide you with clear and
          thoughtful responses. Let’s start building solutions together.
        </p>
      </div>
    );

  function formatText(text) {
    return text.split("\n").map((line, index) => (
      <span key={index}>
        {line
          .split(/\*\*(.*?)\*\*/g)
          .map((part, i) =>
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
          )}
        <br />
      </span>
    ));
  }

  return (
    <div className="pg-chat-history">
      {(() => {
        const sorted = [...(chat.messages || [])].sort((a, b) => (a.ts || 0) - (b.ts || 0));
        return sorted.map((m) => (
          <div key={m.id} className={`pg-msg pg-msg-${m.role}`}>
            <div className="pg-msg-text">
              {m.role === "user" ? (
                m.text
              ) : m.text === "Thinking..." ? (
                <span className="pg-dot-loader" aria-label="loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              ) : (
                formatText(m.text)
              )}
            </div>
          </div>
        ));
      })()}
    </div>
  );
};

export default ChatHistory;
