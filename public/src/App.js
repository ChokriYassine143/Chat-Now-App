import React from 'react'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import Register from './pages/Register'
import Chat from './pages/Chat'
import Login from './pages/Login'
import SetAvatar from './pages/SetAvatar'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/setAvatar" element={<SetAvatar/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App