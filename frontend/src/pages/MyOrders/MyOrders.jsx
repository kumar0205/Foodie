import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/frontend_assets/assets';
import { toast } from 'react-toastify';

const MyOrders = () => {
    const { url } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async (manual = false) => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            const response = await axios.get(url + "/api/order", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
            if (manual) {
                toast.success("Order status updated!");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [])

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => {
                    return (
                        <div key={index} className='my-orders-order'>
                            <img src={assets.parcel_icon} alt="" />
                            <p>{order.items.map((item, index) => {
                                if (index === order.items.length - 1) {
                                    return (item.foodId ? item.foodId.name : "Unknown Item") + " x " + item.quantity
                                }
                                else {
                                    return (item.foodId ? item.foodId.name : "Unknown Item") + " x " + item.quantity + ", "
                                }
                            })}</p>
                            <p>${order.totalAmount}.00</p>
                            <p>Items: {order.items.length}</p>
                            <p><span className={order.status === "Delivered" ? "green-bullet" : order.status === "Out for delivery" ? "blue-bullet" : "orange-bullet"}>&#x25cf;</span> <b className={order.status === "Delivered" ? "green-text" : order.status === "Out for delivery" ? "blue-text" : "orange-text"}>{order.status}</b></p>
                            <button onClick={() => fetchOrders(true)} className={order.status === "Delivered" ? "btn-green" : order.status === "Out for delivery" ? "btn-blue" : "btn-orange"}>Track Order</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MyOrders
