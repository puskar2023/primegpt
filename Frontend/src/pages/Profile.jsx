import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { loadUser } from '../store/userSlice'
import { loadChats } from '../store/chatSlice';
import { ChevronLeft } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.users.user);
    const LogoutHandler = async () => {
        try {
          await axios.post('https://primegpt-ls30.onrender.com/api/auth/logout', {}, { withCredentials: true });
        } catch (e) {
          // ignore network errors, still clear client state
        }
        dispatch(loadUser(null));
        dispatch(loadChats(null));
        navigate('/');

    }

  return (
    <main className="auth-page">
      <button
        onClick={() => navigate('/')}
        aria-label="Back to home"
        style={{ position: 'absolute', top: 16, left: 16, padding: '8px 10px', cursor: 'pointer' }}
        className="auth-back-btn"
      >
        <ChevronLeft />
      </button>
      <div className="auth-card">
        <h1 className="auth-title">Profile</h1>
        <div className="auth-form">
          <div className="form-row" style={{marginBottom:12}}>
            <div className="auth-label">
              <span>First name</span>
              <div className="auth-value">{user?.fullName?.firstName || '—'}</div>
            </div>
            <div className="auth-label">
              <span>Last name</span>
              <div className="auth-value">{user?.fullName?.lastName || '—'}</div>
            </div>
          </div>

          <div className="auth-label" style={{marginBottom:12}}>
            <span>Email</span>
            <div className="auth-value">{user?.email || '—'}</div>
          </div>
        </div>

          <button className="auth-btn" onClick={LogoutHandler}>Logout</button>
      </div>
    </main>
  )
}

export default Profile