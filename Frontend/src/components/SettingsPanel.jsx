import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { setShowSettings, loadChats, setSidebarVisible } from '../store/chatSlice'

const SettingsPanel = () => {
  const showSettings = useSelector((s) => s.chat.showSettings)
  const chats = useSelector((s) => s.chat.chats)
  const dispatch = useDispatch()
  if (!showSettings) return null

  const handleDeleteAll = async () => {
    if (!chats || chats.length === 0) return;
    if (!window.confirm('Delete all chat history? This cannot be undone.')) return;
    try{
      await axios.delete('https://primegpt-ls30.onrender.com/api/chat/', { withCredentials: true });
      dispatch(loadChats([]));
      dispatch(setShowSettings(false));
      dispatch(setSidebarVisible(false));
    }catch(err){
      console.error('Failed to delete chats', err);
      alert('Failed to delete chats');
    }
  }

  return (
    <div className="pg-settings-backdrop" onClick={() => dispatch(setShowSettings(false))}>
      <div className="pg-settings" onClick={e => e.stopPropagation()}>
        <h3>Settings</h3>
        <div className="pg-settings-row">
          <label>Model</label>
          <select defaultValue="primegpt-1">
            <option value="primegpt-1">PrimeGPT-1</option>
            <option value="primegpt-lite">PrimeGPT-Lite</option>
          </select>
        </div>
        <div className="pg-settings-row">
          <button onClick={() => dispatch(setShowSettings(false))}>Close</button>
        </div>
        <div className="pg-settings-row">
          <button
            onClick={handleDeleteAll}
            disabled={!chats || chats.length === 0}
            style={{ background: '#d9534f', color: '#fff', border: 'none', padding: '8px 12px', cursor: chats && chats.length ? 'pointer' : 'not-allowed' }}
          >
            Delete All Chats
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
