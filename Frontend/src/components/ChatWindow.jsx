import React from 'react'
import HeaderBar from './HeaderBar'
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'
import { useSelector } from 'react-redux'

const ChatWindow = () => {
  const selectedChat = useSelector((s) => s.chat.currentChatId) // to re-render on chat change
  return (
    <section className="pg-chat-window">
      <HeaderBar />
      <div className="pg-chat-body">
        <ChatHistory />
      </div>
      {selectedChat && <ChatInput />}
    </section>
  )
}

export default ChatWindow
