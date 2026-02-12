import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createChat, addMessagesBatch, updateBotMessage, getState } from '../store/chatSlice'
import { io } from "socket.io-client";

const ChatInput = () => {
  const {currentChatId, chats} = useSelector((s) => s.chat);
  const [text, setText] = useState('');
  const [socket, setSocket] = useState(null);
  const textareaRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // auto-resize textarea
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 240) + 'px'
  }, [text]);

  useEffect(() => {
    const tempsocket = io("https://primegpt-ls30.onrender.com",{
      withCredentials: true
    });
    tempsocket.on("ai-response", (message) => {
      console.log("Received AI response", message);
      // content: response,
      // chat: messagePayload.chat,
      // update the assistant placeholder message for this chat
      dispatch(
        updateBotMessage({ chatId: message.chat, text: `${message.content}` }),
      );

    });

    setSocket(tempsocket);
  },[])

  const submit = (value) => {
    const t = (value ?? text).trim()
    if (!t) return;

  const timestamp = Date.now();
  // const state = getState();
  let chatId = currentChatId;

  if (!chatId) {
    chatId = timestamp.toString();
    // create a local chat with an initial title derived from the message (server may override)
    const localTitle = t.substring(0, 50);
    dispatch(createChat({ title: localTitle, _id: chatId }));
  }

  socket.emit("ai-message", {
    chat: chatId,
    content: t
  });

  const userMsg = {
    id: timestamp.toString(),
    role: "user",
    text: t,
    ts: timestamp,
  };
  const botId = (timestamp + 1).toString();
  const botMsg = {
    id: botId,
    role: "assistant",
    text: "Thinking...",
    ts: timestamp + 1,
  };

  dispatch(addMessagesBatch({ chatId, messages: [userMsg, botMsg] }));

  // setTimeout(() => {
  //   dispatch(
  //     updateBotMessage({ chatId, botId: botMsg.id, text: `PrimeGPT reply to: "${text}"` }),
  //   );
  // }, 700);

    setText('')
    // reset height
    const ta = textareaRef.current
    if (ta) ta.style.height = 'auto'
  }

  const onSubmit = (e) => {
    e.preventDefault()
    submit()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form className="pg-chat-input" onSubmit={onSubmit}>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type your message..."
        aria-label="Message input"
        rows={1}
      />
      <button type="submit" disabled={!text.trim()} aria-label="Send message">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
        </svg>
      </button>
    </form>
  )
}

export default ChatInput
