import React, { useState, useEffect } from 'react'
import './Bookings.css'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../../assets/assets'
import { io } from 'socket.io-client'

const Bookings = ({ url }) => {
    const [bookings, setBookings] = useState([])
    const [tables, setTables] = useState([])
    const [view, setView] = useState("list") // "list" or "map"

    const fetchAllData = async () => {
        try {
            const [bookingRes, tableRes] = await Promise.all([
                axios.get(url + "api/booking/list"),
                axios.get(url + "api/table/list")
            ]);
            if (bookingRes.data.success) {
                setBookings(bookingRes.data.data);
            }
            if (tableRes.data.success) setTables(tableRes.data.data)
        } catch (error) {
            toast.error("Error fetching data")
        }
    }

    const updateTableStatusManual = async (tableId, newStatus) => {
        try {
            await axios.post(url + "api/table/status", { tableId, status: newStatus });
            toast.success(`Table is now ${newStatus}`);
            fetchAllData();
        } catch (error) {
            toast.error("Error updating table status");
        }
    }

    const statusHandler = async (event, bookingId) => {
        try {
            const response = await axios.post(url + "api/booking/status", {
                bookingId,
                status: event.target.value
            })
            if (response.data.success) {
                await fetchAllData()
                toast.success("Status updated")
            }
        } catch (error) {
            toast.error("Error updating status")
        }
    }

    useEffect(() => {
        fetchAllData()
        const socket = io(url)
        socket.on("connect", () => socket.emit("joinAdminRoom"))
        socket.on("newBooking", () => fetchAllData())
        socket.on("tableStatusChanged", () => fetchAllData())
        return () => socket.disconnect()
    }, [])

    const [statusFilter, setStatusFilter] = useState("Latest")

    const filteredBookings = statusFilter === "All" 
        ? bookings 
        : statusFilter === "Latest"
            ? bookings.filter(b => b.status === "Pending")
            : bookings.filter(b => b.status === statusFilter)

    const latestCount = bookings.filter(b => b.status === "Pending").length

    const getBookingCount = (status) => {
        if (status === "All") return bookings.length;
        if (status === "Latest") return latestCount;
        return bookings.filter(b => b.status === status).length;
    }

    const getBadgeClass = (status) => {
        switch(status) {
            case "All": return "badge-grey";
            case "Pending": return "badge-orange";
            case "Confirmed": return "badge-green";
            case "Completed": return "badge-blue";
            case "Cancelled": return "badge-red";
            default: return "";
        }
    }

    return (
        <div className='booking add'>
            <div className="booking-header-admin">
                <h3>Table Management</h3>
                <div className="view-toggle">
                    <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>Booking List</button>
                    <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>Live Table Map</button>
                </div>
            </div>

            {view === "list" && (
                <div className="status-categories" style={{ marginBottom: '20px' }}>
                    {["Latest", "All", "Pending", "Confirmed", "Completed", "Cancelled"].map((status) => (
                        <button 
                            key={status} 
                            className={`${statusFilter === status ? "active" : ""} category-btn`} 
                            onClick={() => setStatusFilter(status)}
                        >
                            {status}
                            {getBookingCount(status) > 0 && <span className={`notification-badge ${getBadgeClass(status)}`}>{getBookingCount(status)}</span>}
                        </button>
                    ))}
                </div>
            )}

            {view === "list" ? (
                <div className="booking-list">
                    {filteredBookings.length === 0 ? <p>No table bookings in this category.</p> : 
                    filteredBookings.map((booking, index) => (
                        <div key={index} className='booking-item'>
                            <img src={assets.parcel_icon} alt="" />
                            <div className='booking-info'>
                                <p className='booking-user'><b>{booking.name}</b> (Table #{booking.tableNo})</p>
                                <p className='booking-email'>{booking.email}</p>
                                <p className='booking-time'><b>{booking.time}</b> | {booking.date}</p>
                                <p>Guests: <b>{booking.guests}</b> | Phone: {booking.phone}</p>
                            </div>
                            <select onChange={(event) => statusHandler(event, booking._id)} value={booking.status}>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="admin-table-grid">
                    {tables.map((table, index) => {
                        // Find if there's an active booking for this table
                        const activeBooking = bookings.find(b => b.tableId === table._id && (b.status === "Pending" || b.status === "Confirmed"));
                        
                        return (
                            <div key={index} className={`admin-table-item ${table.status.toLowerCase()}`}>
                                <span>Table {table.tableNo}</span>
                                <small>{table.status}</small>
                                
                                {activeBooking && activeBooking.status === "Pending" ? (
                                    <div className="table-actions">
                                        <button className="accept-btn" onClick={() => statusHandler({target: {value: "Confirmed"}}, activeBooking._id)}>Accept</button>
                                        <button className="decline-btn" onClick={() => statusHandler({target: {value: "Cancelled"}}, activeBooking._id)}>Decline</button>
                                    </div>
                                ) : table.status === "Booked" || table.status === "Locked" ? (
                                    <button onClick={() => updateTableStatusManual(table._id, "Available")}>Make Available</button>
                                ) : (
                                    <button onClick={() => updateTableStatusManual(table._id, "Booked")}>Mark Occupied</button>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Bookings;
