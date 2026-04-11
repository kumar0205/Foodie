import React, { useState, useEffect } from 'react'
import './Orders.css'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../../assets/assets'

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
  }, [])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
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
              <p className='order-item-name'>{order.address ? order.address.firstName + " " + order.address.lastName : "No Name Provided"}</p>
              <div className="order-item-address">
                <p>{order.address ? order.address.street + "," : ""}</p>
                <p>{order.address ? order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipCode : "No address provided"}</p>
              </div>
              <p className='order-item-phone'>{order.address ? order.address.phone : ""}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.totalAmount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
