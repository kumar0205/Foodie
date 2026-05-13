import React, { useState, useEffect } from 'react'
import './Orders.css'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../../assets/assets'
import { io } from 'socket.io-client'

const Orders = ({ url }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    try {
      console.log("Fetching orders from:", url + "api/order/list")
      const response = await axios.get(url + "api/order/list")
      console.log("Response:", response.data)
      if (response.data.success) {
        setOrders(response.data.data)
      } else {
        toast.error(response.data.message || "Error fetching orders")
      }
    } catch (error) {
      console.error("Fetch orders error:", error)
      toast.error(error.response?.data?.message || error.message || "Error fetching orders")
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "api/order/status", {
        orderId,
        status: event.target.value
      })
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Status updated")
      }
    } catch (error) {
      console.error("Status update error:", error)
      toast.error("Error updating status")
    }
  }

  useEffect(() => {
    fetchAllOrders()

    const socket = io(url)

    socket.on("connect", () => {
      socket.emit("joinAdminRoom")
    })

    socket.on("newOrder", (order) => {
      toast.info("New order received!")
      fetchAllOrders()
    })

    socket.on("statusUpdated", (updatedOrder) => {
      fetchAllOrders()
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const [filter, setFilter] = useState("Latest")

  const filteredOrders = filter === "All" 
    ? orders 
    : filter === "Latest"
      ? orders.filter(order => !order.status || order.status === "Pending" || order.status === "Food Processing")
      : orders.filter(order => order.status === filter)

  const latestCount = orders.filter(order => !order.status || order.status === "Pending" || order.status === "Food Processing").length

  const getCount = (status) => {
    if (status === "All") return orders.length;
    if (status === "Latest") return latestCount;
    return orders.filter(order => order.status === status).length;
  }

  const getBadgeClass = (status) => {
    switch(status) {
      case "All": return "badge-grey";
      case "Pending": return "badge-orange";
      case "Accepted": return "badge-blue";
      case "Preparing": return "badge-yellow";
      case "Ready for delivery": return "badge-indigo";
      case "Out for delivery": return "badge-purple";
      case "Delivered": return "badge-green";
      default: return "";
    }
  }

  return (
    <div className='order add'>
      <div className="order-header-admin">
        <h3>Order Page</h3>
        <div className="status-categories">
          {["Latest", "All", "Pending", "Accepted", "Preparing", "Ready for delivery", "Out for delivery", "Delivered"].map((status) => (
            <button 
              key={status} 
              className={`${filter === status ? "active" : ""} category-btn`} 
              onClick={() => setFilter(status)}
            >
              {status}
              {getCount(status) > 0 && <span className={`notification-badge ${getBadgeClass(status)}`}>{getCount(status)}</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="order-list">
        {filteredOrders.length === 0 ? <p className='no-orders'>No orders in this category.</p> : 
        filteredOrders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return (item.foodId ? item.foodId.name : "Unknown Item") + " x " + item.quantity
                  }
                  else {
                    return (item.foodId ? item.foodId.name : "Unknown Item") + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className='order-item-name'>
                {order.address 
                  ? (order.address.name || ((order.address.firstName || "") + " " + (order.address.lastName || "")).trim() || "No Name Provided") 
                  : "No Name Provided"}
              </p>
              <div className="order-item-address">
                <p>{order.address ? (order.address.doorNo ? order.address.doorNo + ", " : "") + (order.address.street || "") + "," : ""}</p>
                <p>
                  {order.address 
                    ? [
                        order.address.village,
                        order.address.town || order.address.city,
                        order.address.state,
                        order.address.country,
                        order.address.pincode || order.address.zipCode
                      ].filter(Boolean).join(", ")
                    : "No address provided"}
                </p>
              </div>
              <p className='order-item-phone'>{order.address ? order.address.phone || order.address.phoneNumber : ""}</p>
              <p className='order-item-date'><b>Ordered on:</b> {new Date(order.date || order.createdAt).toLocaleDateString()} at {new Date(order.date || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.totalAmount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready for delivery">Ready for delivery</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
