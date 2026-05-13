import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

interface LoginProps {
  setUser: (user: any) => void
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const url = "http://localhost:4000"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${url}/api/auth/login`, { email, password })
      console.log("Login API Response:", res.data)
      if (res.data.success) {
        const user = res.data.user
        console.log("Extracted User Object:", user)
        if (user.role !== "delivery") {
          toast.error("Access denied. Only delivery partners can log in here.")
          setLoading(false)
          return
        }
        localStorage.setItem("deliveryUser", JSON.stringify(user))
        localStorage.setItem("authToken", res.data.token)
        console.log("Calling setUser with:", user)
        setUser(user)
        toast.success("Login successful!")
        setTimeout(() => navigate("/"), 100)
      } else {
        toast.error(res.data.message)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen p-4 bg-primary'>
      <div className='w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl'>
        <div className='flex flex-col items-center mb-8'>
          <h1 className='text-3xl font-bold text-slate-800'>Foodie Partner</h1>
          <p className='text-slate-500'>Delivery Dashboard Login</p>
        </div>
        <form onSubmit={handleLogin} className='space-y-6'>
          <div>
            <label className='block mb-2 text-sm font-semibold text-slate-700'>Email</label>
            <input 
              type="email" 
              className='w-full p-4 border border-slate-200 rounded-xl outline-primary' 
              placeholder='your@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className='block mb-2 text-sm font-semibold text-slate-700'>Password</label>
            <input 
              type="password" 
              className='w-full p-4 border border-slate-200 rounded-xl outline-primary' 
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className='w-full py-4 text-lg font-bold text-white transition bg-primary rounded-xl hover:bg-orange-600 disabled:bg-slate-300'
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
