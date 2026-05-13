import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App: React.FC = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("deliveryUser")
    return saved ? JSON.parse(saved) : null
  })

  React.useEffect(() => {
    console.log("App User State Changed:", user)
  }, [user])

  return (
    <div className='w-full min-h-screen bg-slate-50'>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
        <Route path="/" element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
