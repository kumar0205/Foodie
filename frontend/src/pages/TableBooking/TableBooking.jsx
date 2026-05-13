import React, { useState, useContext, useEffect } from 'react';
import './TableBooking.css';
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { Users, Calendar, Clock, MapPin, CheckCircle2, Lock, XCircle, Info } from 'lucide-react';

const TableBooking = () => {
    const { url } = useContext(StoreContext);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: new Date().toISOString().split('T')[0],
        time: ""
    });

    const fetchTables = async () => {
        try {
            const response = await axios.get(url + "/api/table/list");
            if (response.data.success) {
                setTables(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    };

    useEffect(() => {
        fetchTables();
        const socket = io(url);
        socket.on("tableStatusChanged", ({ tableId, status }) => {
            setTables(prev => prev.map(t => t._id === tableId ? { ...t, status } : t));
        });
        return () => socket.disconnect();
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    };

    const onTableSelect = async (table) => {
        if (table.status === "Available") {
            try {
                const res = await axios.post(url + "/api/table/status", { 
                    tableId: table._id, 
                    status: "Locked",
                    lockedAt: Date.now() 
                });
                if (res.data.success) {
                    setSelectedTable(table);
                    toast.info(`Table #${table.tableNo} reserved for you for 5 minutes`);
                }
            } catch (err) {
                toast.error("Failed to lock table");
            }
        } else if (table.status === "Locked" && selectedTable?._id === table._id) {
            // Unlock if already selected by us
            await axios.post(url + "/api/table/status", { tableId: table._id, status: "Available", lockedAt: null });
            setSelectedTable(null);
        } else {
            toast.error(`Table is ${table.status}`);
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!selectedTable) {
            toast.error("Please select a table from the map");
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Please login to book a table");
            return;
        }

        try {
            const bookingData = { 
                ...formData, 
                tableId: selectedTable._id,
                tableNo: selectedTable.tableNo,
                guests: selectedTable.capacity 
            };
            const response = await axios.post(url + "/api/booking/place", bookingData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                // Update table status to booked
                await axios.post(url + "/api/table/status", { 
                    tableId: selectedTable._id, 
                    status: "Booked" 
                });

                toast.success("Table reserved successfully!");
                setSelectedTable(null);
                setFormData({ name: "", email: "", phone: "", date: new Date().toISOString().split('T')[0], time: "" });
            }
        } catch (error) {
            toast.error("Error booking table");
        }
    };

    return (
        <div className='table-booking-container'>
            <div className="booking-page-header">
                <div className="header-content">
                    <h1>Reserve Your Experience</h1>
                    <p>Choose the perfect spot for your dining journey. Live availability ensured.</p>
                </div>
                <div className="status-legend">
                    <div className="legend-item"><span className="dot available"></span> Available</div>
                    <div className="legend-item"><span className="dot selected"></span> Your Pick</div>
                    <div className="legend-item"><span className="dot locked"></span> Reserved</div>
                    <div className="legend-item"><span className="dot booked"></span> Booked</div>
                </div>
            </div>

            <div className="booking-main-layout">
                <div className="table-selection-section">
                    <div className="section-header">
                        <MapPin size={20} />
                        <h2>Dining Floor Map</h2>
                    </div>
                    <div className="table-grid-visual">
                        {tables.map((table, index) => (
                            <div 
                                key={index} 
                                onClick={() => onTableSelect(table)}
                                className={`table-card ${selectedTable?._id === table._id ? 'selected' : table.status.toLowerCase()}`}
                            >
                                <div className="table-icon-wrapper">
                                    <span className="table-number">#{table.tableNo}</span>
                                    {table.status === "Booked" ? <XCircle size={16} /> : 
                                     table.status === "Locked" && selectedTable?._id !== table._id ? <Lock size={16} /> : 
                                     selectedTable?._id === table._id ? <CheckCircle2 size={16} /> : null}
                                </div>
                                <div className="table-info">
                                    <Users size={14} />
                                    <span>{table.capacity} Seats</span>
                                </div>
                                <div className="table-status-label">{table.status}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="booking-details-section">
                    <div className="glass-card">
                        <form onSubmit={onSubmitHandler} className="premium-booking-form">
                            <div className="form-header">
                                <h3>{selectedTable ? `Booking Table #${selectedTable.tableNo}` : "Reservation Details"}</h3>
                                {!selectedTable && (
                                    <div className="selection-prompt">
                                        <Info size={16} />
                                        <span>Select a table to continue</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="input-group">
                                <label>Guest Name</label>
                                <input name='name' onChange={onChangeHandler} value={formData.name} type="text" placeholder='Your full name' required />
                            </div>
                            
                            <div className="input-row">
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <input name='email' onChange={onChangeHandler} value={formData.email} type="email" placeholder='hello@example.com' required />
                                </div>
                                <div className="input-group">
                                    <label>Phone Number</label>
                                    <input name='phone' onChange={onChangeHandler} value={formData.phone} type="text" placeholder='+1 234 567 890' required />
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <label><Calendar size={14} /> Date</label>
                                    <input name='date' value={formData.date} type="date" disabled />
                                </div>
                                <div className="input-group">
                                    <label><Clock size={14} /> Time</label>
                                    <input name='time' onChange={onChangeHandler} value={formData.time} type="time" required />
                                </div>
                            </div>

                            {selectedTable && (
                                <div className="booking-summary">
                                    <div className="summary-item">
                                        <span>Table Capacity</span>
                                        <span>{selectedTable.capacity} Persons</span>
                                    </div>
                                    <div className="summary-item">
                                        <span>Booking Fee</span>
                                        <span className="free">Free</span>
                                    </div>
                                </div>
                            )}

                            <button type='submit' className="submit-booking-btn" disabled={!selectedTable}>
                                {selectedTable ? "Confirm Reservation" : "Select a Table First"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableBooking;
