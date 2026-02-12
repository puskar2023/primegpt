import React, { useEffect } from 'react'
import AppRoutes from './AppRoutes'
import { useDispatch } from 'react-redux';
import { loadChats } from './store/chatSlice';
import {loadUser} from './store/userSlice';
import axios from 'axios';
import './styles/theme.css'
import './styles/auth.css'

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = saved || (prefersDark ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', theme)
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3000/api/chat/", { withCredentials: true }).then((response) => {
        dispatch(loadChats(response.data.chats.reverse()));
      }).catch((error) => {
        console.error("Error fetching chats:", error);
      });

      axios.get("http://localhost:3000/api/auth/user", { withCredentials: true }).then((response) => {
        dispatch(loadUser(response.data.user));
      }).catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return (
    <div>
      <AppRoutes />
    </div>
  )
}

export default App