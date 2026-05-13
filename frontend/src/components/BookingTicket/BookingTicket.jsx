import React from 'react'
import './BookingTicket.css'

const BookingTicket = ({ booking }) => {
    if (!booking) return null;

    return (
        <div className="booking-ticket">
            <div className="ticket-header">
                <h2>DINING TICKET</h2>
                <div className="serial">#{booking._id.slice(-8).toUpperCase()}</div>
            </div>
            <div className="ticket-body">
                <div className="ticket-info">
                    <div className="info-group">
                        <label>GUEST</label>
                        <span>{booking.name}</span>
                    </div>
                    <div className="info-group">
                        <label>TABLE</label>
                        <span>#{booking.tableNo}</span>
                    </div>
                </div>
                <div className="ticket-info">
                    <div className="info-group">
                        <label>DATE</label>
                        <span>{booking.date}</span>
                    </div>
                    <div className="info-group">
                        <label>TIME</label>
                        <span>{booking.time}</span>
                    </div>
                </div>
                <div className="barcode">
                    {/* Placeholder for barcode aesthetic */}
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar short"></div>
                    <div className="bar"></div>
                    <div className="bar long"></div>
                </div>
            </div>
            <div className="ticket-footer">
                <p>Please present this ticket at the reception.</p>
                <span>{booking.status}</span>
            </div>
        </div>
    )
}

export default BookingTicket
