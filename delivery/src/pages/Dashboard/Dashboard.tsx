import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { LogOut, MapPin, Phone, Package, Navigation } from 'lucide-react'
import { io } from 'socket.io-client'

interface DashboardProps {
  user: any
  setUser: (user: any) => void
}

const Dashboard: React.FC<DashboardProps> = ({ user, setUser }) => {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const url = "http://localhost:4000"

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/order/list`)
      if (res.data.success) {
        // Since it's a single delivery boy system, we show orders that are 
        // Ready for Delivery or already Out for Delivery by this boy
        const filtered = res.data.data.filter((o: any) => 
          o.status === "Ready for delivery" || o.status === "Out for delivery"
        )
        setOrders(filtered)
      }
    } catch (err) {
      console.error("Fetch orders error:", err)
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    const socket = io(url)
    socket.on("connect", () => socket.emit("joinAdminRoom"))
    socket.on("newOrder", () => fetchOrders())
    socket.on("statusUpdated", () => fetchOrders())
    return () => { socket.disconnect() }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("deliveryUser")
    localStorage.removeItem("authToken")
    setUser(null)
    toast.info("Logged out")
  }

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await axios.post(`${url}/api/order/status`, { orderId, status })
      if (res.data.success) {
        toast.success(`Status updated to ${status}`)
        fetchOrders()
      }
    } catch (err) {
      toast.error("Status update failed")
    }
  }

  return (
    <div className='max-w-xl mx-auto min-h-screen bg-slate-50'>
      {/* Header */}
      <header className='sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b border-slate-100'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center w-10 h-10 font-bold text-white bg-primary rounded-full'>
            {user?.name?.charAt(0) || "D"}
          </div>
          <div>
            <h2 className='font-bold text-slate-800'>{user?.name || "Delivery Partner"}</h2>
            <p className='text-xs text-slate-400'>Online & Ready</p>
          </div>
        </div>
        <button onClick={handleLogout} className='p-2 transition bg-slate-50 rounded-xl hover:bg-red-50 hover:text-red-500'>
          <LogOut size={20} />
        </button>
      </header>

      {/* Stats/Summary */}
      <div className='p-4'>
        <div className='p-6 text-white bg-slate-900 rounded-3xl shadow-xl shadow-slate-200'>
          <p className='text-slate-400 text-sm font-medium'>Orders in your queue</p>
          <h3 className='text-5xl font-black mt-1'>{orders.length}</h3>
        </div>
      </div>

      {/* Order List */}
      <div className='p-4 pb-20 space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-black text-slate-800 uppercase tracking-tight'>Active Deliveries</h3>
          <button onClick={fetchOrders} className='text-xs font-bold text-primary'>Refresh</button>
        </div>
        
        {loading ? (
          <div className='py-20 text-center text-slate-400 font-medium'>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className='py-20 text-center border-2 border-dashed rounded-3xl border-slate-200 bg-white'>
            <Package size={48} className='mx-auto mb-4 text-slate-200' />
            <p className='text-slate-500 font-medium'>No orders assigned to you yet.</p>
            <p className='text-xs text-slate-400 mt-1'>New orders will appear here automatically.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className='p-6 bg-white shadow-sm rounded-3xl border border-slate-100 hover:border-primary/20 transition-colors'>
              <div className='flex items-center justify-between mb-6'>
                <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest ${
                  order.status === "Out for delivery" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
                }`}>
                  {order.status}
                </span>
                <span className='text-xs font-bold text-slate-300'>#{order._id?.slice(-6).toUpperCase()}</span>
              </div>

              <div className='mb-8 space-y-5'>
                <div className='flex items-start gap-4'>
                  <div className='p-2 bg-orange-50 rounded-lg'>
                    <MapPin className='text-primary' size={20} />
                  </div>
                  <div>
                    <p className='text-sm font-bold text-slate-800 leading-tight'>
                      {order.address?.firstName} {order.address?.lastName}
                    </p>
                    <p className='text-xs text-slate-500 mt-1 leading-relaxed'>
                      {order.address?.street}, {order.address?.city}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='p-2 bg-slate-50 rounded-lg'>
                    <Phone className='text-slate-400' size={20} />
                  </div>
                  <p className='text-sm font-bold text-slate-600'>{order.address?.phone || "No phone provided"}</p>
                </div>
              </div>

              <div className='flex gap-3'>
                {order.status === "Ready for delivery" ? (
                  <button 
                    onClick={() => updateStatus(order._id, "Out for delivery")}
                    className='flex-1 flex items-center justify-center gap-2 py-4 font-black text-xs text-white bg-primary rounded-2xl shadow-lg shadow-primary/20 uppercase tracking-widest'
                  >
                    <Navigation size={16} /> Start Delivery
                  </button>
                ) : (
                  <button 
                    onClick={() => updateStatus(order._id, "Delivered")}
                    className='flex-1 py-4 font-black text-xs text-white bg-green-500 rounded-2xl shadow-lg shadow-green-100 uppercase tracking-widest'
                  >
                    Mark Delivered
                  </button>
                )}
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.address?.street}, ${order.address?.city}`)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className='p-4 bg-slate-100 rounded-2xl text-slate-500 hover:bg-slate-200 transition-colors'
                >
                  <Navigation size={20} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard
