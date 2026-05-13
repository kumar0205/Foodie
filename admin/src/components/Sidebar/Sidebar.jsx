import React from 'react'
import './Sidebar.css'
import {assets} from '../../assets/assets'
import { NavLink } from 'react-router-dom'
const Sidebar = ({ counts }) => {
  return (
    <div className='sidebar'>
        <div className="sidebar-options">
            <NavLink to='/' className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>Dashboard</p>
            </NavLink>
            <NavLink to='/add' className="sidebar-option">
                <img src={assets.add_icon} alt="" />
                <p>Add Items</p>
            </NavLink>
            <NavLink to='/list' className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>List Items</p>
            </NavLink>
            <NavLink to='/orders' className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>Orders</p>
                {counts?.orders > 0 && <span className="sidebar-badge">{counts.orders}</span>}
            </NavLink>
            <NavLink to='/bookings' className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>Table Bookings</p>
                {counts?.bookings > 0 && <span className="sidebar-badge">{counts.bookings}</span>}
            </NavLink>
        </div>

    </div>
  )
}

export default Sidebar
