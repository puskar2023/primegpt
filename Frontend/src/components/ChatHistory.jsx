import React, { useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import logo from "../assets/light_logo.png";

import "../styles/dot-loader.css";

const ChatHistory = () => {
  const chats = useSelector((s) => s.chat.chats);
  const currentChatId = useSelector((s) => s.chat.currentChatId);
  const chat = chats.find((c) => c._id === currentChatId);
  const historyRef = useRef(null);

  const sortedMessages = useMemo(() => {
    return [...(chat?.messages || [])].sort((a, b) => (a.ts || 0) - (b.ts || 0));
  }, [chat]);

  const lastKey = useMemo(() => {
    const last = sortedMessages[sortedMessages.length - 1];
    return last ? `${last.id || ""}:${last.ts || ""}` : "";
  }, [sortedMessages]);

  useEffect(() => {
    const el = historyRef.current;
    if (!el) return;

    // Find the nearest scrollable container (prefer .pg-chat-body)
    let scrollEl = el.closest && el.closest(".pg-chat-body");
    if (!scrollEl) {
      let p = el.parentElement;
      while (p && p !== document.body) {
        const style = window.getComputedStyle(p);
        if (/auto|scroll/.test(style.overflowY)) {
          scrollEl = p;
          break;
        }
        p = p.parentElement;
      }
    }
    if (!scrollEl) scrollEl = document.scrollingElement || document.documentElement;

    const doScroll = (behavior = "smooth") => {
      try {
        if (scrollEl === document.scrollingElement || scrollEl === document.documentElement) {
          window.scrollTo({ top: document.body.scrollHeight, behavior });
        } else {
          scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior });
        }
      } catch (e) {
        if (scrollEl === document.scrollingElement || scrollEl === document.documentElement) {
          window.scrollTo(0, document.body.scrollHeight);
        } else {
          scrollEl.scrollTop = scrollEl.scrollHeight;
        }
      }
    };

    // Make several scroll attempts (instant then smooth) to handle mobile keyboard resizing
    const isMobile = /Mobi|Android/i.test(navigator.userAgent || "");
    const timeouts = [];
    // immediate (instant) to jump to bottom
    timeouts.push(setTimeout(() => doScroll("auto"), 20));
    // follow-up smooth attempts
    timeouts.push(setTimeout(() => doScroll("smooth"), isMobile ? 120 : 60));
    timeouts.push(setTimeout(() => doScroll("smooth"), isMobile ? 300 : 200));
    timeouts.push(setTimeout(() => doScroll("smooth"), isMobile ? 700 : 400));

    // On mobile, viewport may change when keyboard appears; listen for resize and focus events
    let resizeTimer = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => doScroll("smooth"), 80);
    };
    const onFocusIn = (e) => {
      // if an input inside the app focuses, try scrolling again
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) {
        setTimeout(() => doScroll("smooth"), 60);
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("focusin", onFocusIn);

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("focusin", onFocusIn);
    };
  }, [currentChatId, sortedMessages.length, lastKey]);

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
          .map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
        <br />
      </span>
    ));
  }

  return (
    <div className="pg-chat-history" ref={historyRef}>
      {sortedMessages.map((m) => (
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
      ))}
    </div>
  );
};

export default ChatHistory;
