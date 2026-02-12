import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createChat, selectChat, setShowSettings, setSidebarVisible } from '../store/chatSlice'
import axios from 'axios'
import { SquarePen } from 'lucide-react';

const Sidebar = () => {
  const chats = useSelector((s) => s.chat.chats)
  const user = useSelector((s) => s.users.user);
  const currentChatId = useSelector((s) => s.chat.currentChatId)
  const sidebarVisible = useSelector((s) => s.chat.sidebarVisible)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const closeMobile = () => dispatch(setSidebarVisible(false));
  const handelNewChat = async () => {
    // ask user once for a chat title; if they cancel, title will be empty
    if(!user){
      navigate('/login');
      return;
    }
    let title = window.prompt('Enter chat title (leave empty to auto-generate):', '')
    if(title){
      title = title.trim();
      if(title.length > 100){
        title = title.substring(0, 50)+'...';
      }
    }
    if(!title){
      return;
    }

    const response = await axios.post('https://primegpt-ls30.onrender.com/api/chat/', {
     title
    },{
      withCredentials: true
    });
    console.log(response);
    console.log(response.data);
    
    dispatch(createChat({title: response.data.chat.title, _id: response.data.chat._id }));
    closeMobile();
  }

  return (
    <>
      <aside className={`pg-sidebar ${sidebarVisible ? 'mobile-open' : ''}`}>
        <div className="pg-sidebar-top">
          <div className="pg-sidebar-top-row">
            <button className="pg-new-chat" onClick={handelNewChat}><SquarePen className='create'/> <span>New Chat</span></button>
            <button className="pg-close-sidebar" onClick={closeMobile} aria-label="Close sidebar">✕</button>
          </div>
        </div>
        <div className="pg-chat-list" onClick={closeMobile}>
          {chats.length === 0 && <div className="pg-empty">No chats yet — start a new chat.</div>}
          {chats.map(chat => (
            <div key={chat._id} className={`pg-chat-item ${currentChatId === chat._id ? 'active' : ''}`} onClick={() => dispatch(selectChat(chat._id))}>
              {chat.title || 'New chat'}
            </div>
          ))}
        </div>

        <div className="pg-sidebar-bottom">
          <button onClick={() => dispatch(setShowSettings(true))}>Settings</button>
        </div>
      </aside>
      {sidebarVisible && <div className="pg-sidebar-backdrop" onClick={closeMobile} />}
    </>
  )
}

export default Sidebar
