import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSidebarVisible } from '../store/chatSlice'
import light_logo from "../assets/light_logo.png";
import black_logo from "../assets/black_logo.png";
import { Link } from 'react-router-dom';
import { User, LogIn } from 'lucide-react';

const HeaderBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.users.user);
  const sidebarVisible = useSelector((s) => s.chat.sidebarVisible)
  const [theme, setTheme] = useState(() => {
    if (typeof document !== 'undefined') return document.documentElement.getAttribute('data-theme') || 'light'
    return 'light'
  })

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const obs = new MutationObserver(() => setTheme(root.getAttribute('data-theme') || 'light'))
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return (
    <header className="pg-header">
      <div className="pg-left">
        <button className="pg-hamburger" onClick={() => dispatch(setSidebarVisible(!sidebarVisible))} aria-label="Open sidebar">☰</button>
        <img
          src={theme === 'dark' ? light_logo : black_logo}
          alt="PrimeGPT logo"
          className="pg-logo"
        />
        <div className="pg-title">PrimeGPT</div>
      </div>
      <div className="pg-actions">
        {user && <Link to="/profile" className="pg-profile"><User /></Link>}
        {!user && <Link to="/login" className="pg-login"><LogIn /></Link>}
      </div>
    </header>
  )
}

export default HeaderBar
