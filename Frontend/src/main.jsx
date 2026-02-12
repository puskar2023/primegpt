import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store'
import { loadChats } from './store/chatSlice'

// Load persisted chats (if any)



// Persist chats whenever store updates
store.subscribe(() => {
  try {
    const state = store.getState()
    localStorage.setItem('primegpt_chats', JSON.stringify(state.chat.chats))
  } catch (e) {}
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
