import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/frontend_assets/assets';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

const STATUS_CONFIG = {
    "Delivered":        { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', dot: '#16a34a', label: 'Delivered' },
    "Out for delivery": { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', dot: '#2563eb', label: 'Out for Delivery' },
    "default":          { color: '#d97706', bg: '#fffbeb', border: '#fde68a', dot: '#d97706', label: 'Processing' },
};

const getStatus = (status) => STATUS_CONFIG[status] || { ...STATUS_CONFIG.default, label: status };

const OrderSkeleton = () => (
    <div className="order-card-skeleton">
        <div className="skeleton-row">
            <div className="skeleton-circle skeleton-shimmer" />
            <div className="skeleton-lines">
                <div className="skeleton-line skeleton-shimmer" style={{ width: '55%' }} />
                <div className="skeleton-line skeleton-shimmer" style={{ width: '30%' }} />
            </div>
            <div className="skeleton-pill skeleton-shimmer" />
        </div>
        <div className="skeleton-divider" />
        <div className="skeleton-footer">
            <div className="skeleton-line skeleton-shimmer" style={{ width: '40%', height: '10px' }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: '20%', height: '10px' }} />
        </div>
    </div>
);

const MyOrders = () => {
    const { url } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async (manual = false) => {
        const token = localStorage.getItem("authToken");
        if (!token) { setIsLoading(false); return; }

        try {
            const response = await axios.get(url + "/api/order", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();

        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded.id || decoded.uid || decoded._id;
                const socket = io(url);
                socket.on("connect", () => socket.emit("joinUserRoom", userId));
                socket.on("statusUpdated", () => fetchOrders());
                return () => socket.disconnect();
            } catch (err) {
                console.error("Error setting up socket:", err);
            }
        }
    }, []);

    return (
        <div className='my-orders'>
            <div className="my-orders-header">
                <h2>My Orders</h2>
                {!isLoading && data.length > 0 && (
                    <span className="order-count-badge">{data.length} order{data.length !== 1 ? 's' : ''}</span>
                )}
            </div>

            <div className="orders-grid">
                {isLoading ? (
                    [1, 2, 3].map(i => <OrderSkeleton key={i} />)
                ) : data.length === 0 ? (
                    <div className="no-orders">
                        <div className="no-orders-icon">🛍️</div>
                        <h3>No Orders Yet</h3>
                        <p>Your delicious food is just a click away!</p>
                    </div>
                ) : (
                    data.map((order, index) => {
                        const st = getStatus(order.status);
                        const itemNames = order.items.map((item, idx) =>
                            (item.foodId ? item.foodId.name : "Unknown Item") + " ×" + item.quantity
                        ).join(', ');
                        const dateObj = new Date(order.date || order.createdAt);
                        const dateStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return (
                            <div key={index} className='order-card'>
                                {/* Top row: icon + items + status badge */}
                                <div className="order-card-top">
                                    <div className="order-icon-wrap">
                                        <img src={assets.parcel_icon} alt="Order" className="order-icon" />
                                    </div>
                                    <div className="order-info">
                                        <p className="order-items-text">{itemNames}</p>
                                        <span className="order-item-count">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <span
                                        className="order-status-badge"
                                        style={{ color: st.color, background: st.bg, borderColor: st.border }}
                                    >
                                        <span className="status-dot" style={{ background: st.dot }} />
                                        {st.label}
                                    </span>
                                </div>

                                {/* Divider */}
                                <div className="order-card-divider" />

                                {/* Bottom row: date + amount */}
                                <div className="order-card-bottom">
                                    <span className="order-date-text">🗓 {dateStr} · {timeStr}</span>
                                    <span className="order-amount">₹{order.totalAmount}.00</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyOrders;
