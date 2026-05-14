import React, { useContext, useEffect, useState } from 'react'
import './MyBookings.css'
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { Calendar, Clock, Users, Utensils, CheckCircle2, Clock3, XCircle } from 'lucide-react';

const MyBookings = () => {
    const { url } = useContext(StoreContext);
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            const response = await axios.get(url + "/api/booking/user", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setBookings(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    }

    useEffect(() => {
        fetchBookings();
    }, [])

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Confirmed': return <CheckCircle2 size={16} />;
            case 'Cancelled': return <XCircle size={16} />;
            default: return <Clock3 size={16} />;
        }
    }

    return (
        <div className='my-bookings-container'>
            <div className="bookings-header">
                <h2>My Reservations</h2>
                <p>Manage your upcoming dining experiences</p>
            </div>
            
            <div className="bookings-grid">
                {bookings.length === 0 ? (
                    <div className="empty-bookings">
                        <Utensils size={48} />
                        <p>No reservations found. Time to book a table!</p>
                    </div>
                ) : (
                    bookings.map((booking, index) => (
                        <div key={index} className='booking-card'>
                            <div className={`status-badge ${booking.status.toLowerCase()}`}>
                                {getStatusIcon(booking.status)}
                                <span>{booking.status}</span>
                            </div>
                            
                            <div className="booking-card-header">
                                <div className="table-tag">Table #{booking.tableNo}</div>
                            </div>
                            
                            <div className="booking-card-details">
                                <div className="detail-item">
                                    <Calendar size={18} />
                                    <span>{booking.date}</span>
                                </div>
                                <div className="detail-item">
                                    <Clock size={18} />
                                    <span>{booking.time}</span>
                                </div>
                                <div className="detail-item">
                                    <Users size={18} />
                                    <span>{booking.guests} Guests</span>
                                </div>
                            </div>
                            
                            <div className="booking-card-footer">
                                <p className="booking-id">ID: #{booking._id.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MyBookings;
