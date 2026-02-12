import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import AuthWrapper from './AuthWrapper';
import UnauthWrapper from './UnauthWrapper';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<UnauthWrapper><Register /></UnauthWrapper>} />
        <Route path='/login' element={<UnauthWrapper><Login /></UnauthWrapper>} />
        <Route path='/profile' element={<AuthWrapper><Profile /></AuthWrapper>} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
