import React, { useContext, useEffect, useState } from 'react'
import './MyBookings.css'
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/frontend_assets/assets';

import BookingTicket from '../../components/BookingTicket/BookingTicket';

const MyBookings = () => {
    const { url } = useContext(StoreContext);
    const [bookings, setBookings] = useState([]);
    const [showTicket, setShowTicket] = useState(null);

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

    return (
        <div className='my-bookings'>
            <h2>My Table Reservations</h2>
            
            {showTicket && (
                <div className="ticket-modal" onClick={() => setShowTicket(null)}>
                    <div className="ticket-modal-content" onClick={e => e.stopPropagation()}>
                        <BookingTicket booking={showTicket} />
                        <button className="close-btn" onClick={() => setShowTicket(null)}>Close</button>
                    </div>
                </div>
            )}

            <div className="container">
                {bookings.length === 0 ? <p>No reservations found.</p> : 
                bookings.map((booking, index) => (
                    <div key={index} className='my-bookings-item'>
                        <img src={assets.parcel_icon} alt="" />
                        <div className='booking-details'>
                            <p><b>Table #{booking.tableNo}</b></p>
                            <p>{booking.date} at {booking.time}</p>
                            <p>Guests: {booking.guests}</p>
                        </div>
                        <p className='status'>
                            <span className={booking.status === "Confirmed" ? "green-bullet" : booking.status === "Cancelled" ? "red-bullet" : "orange-bullet"}>&#x25cf;</span>
                            <b>{booking.status}</b>
                        </p>
                        <div className="actions">
                            <button onClick={() => setShowTicket(booking)}>View Ticket</button>
                            <button onClick={fetchBookings}>Refresh</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyBookings;
