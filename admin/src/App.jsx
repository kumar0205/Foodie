import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Bookings from './pages/Bookings/Bookings'
import Overview from './pages/Overview/Overview'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { io } from 'socket.io-client'

const App = () => {
  const url = 'http://localhost:4000/';
  const [counts, setCounts] = useState({ orders: 0, bookings: 0 })

  const fetchCounts = async () => {
    try {
      const [orderRes, bookingRes] = await Promise.all([
        axios.get(url + "api/order/list"),
        axios.get(url + "api/booking/list")
      ])
      if (orderRes.data.success && bookingRes.data.success) {
        const orderCount = orderRes.data.data.filter(o => !o.status || o.status === "Pending" || o.status === "Food Processing").length
        const bookingCount = bookingRes.data.data.filter(b => b.status === "Pending").length
        console.log("Setting counts in App:", { orders: orderCount, bookings: bookingCount })
        setCounts({ orders: orderCount, bookings: bookingCount })
      }
    } catch (error) {
      console.error("Error fetching notification counts", error)
    }
  }

  useEffect(() => {
    fetchCounts()
    const socket = io(url)
    socket.on("connect", () => socket.emit("joinAdminRoom"))
    socket.on("newOrder", () => fetchCounts())
    socket.on("newBooking", () => fetchCounts())
    socket.on("statusUpdated", () => fetchCounts())
    socket.on("tableStatusChanged", () => fetchCounts())
    return () => socket.disconnect()
  }, [])

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar counts={counts} />
        <Routes>
          <Route path='/' element={<Overview url={url} />}></Route>
          <Route path='/add' element={<Add url={url} />}></Route>
          <Route path='/list' element={<List url={url} />}></Route>
          <Route path='/orders' element={<Orders url={url} />}></Route>
          <Route path='/bookings' element={<Bookings url={url} />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
