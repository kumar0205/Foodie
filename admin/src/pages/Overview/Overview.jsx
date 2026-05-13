import React, { useState, useEffect } from 'react'
import './Overview.css'
import axios from 'axios'
import { PieChart, TrendingUp, ShoppingBag, Users, Calendar, DollarSign } from 'lucide-react'

const Overview = ({ url }) => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        todayRevenue: 0,
        activeDeliveries: 0,
        pendingBookings: 0,
        totalFoods: 0,
        tableOccupancy: 0
    })

    const fetchOverviewData = async () => {
        try {
            const [ordersRes, bookingsRes, foodsRes, tablesRes] = await Promise.all([
                axios.get(url + "api/order/list"),
                axios.get(url + "api/booking/list"),
                axios.get(url + "api/food/list"),
                axios.get(url + "api/table/list")
            ])

            const orders = ordersRes.data.data || []
            const bookings = bookingsRes.data.data || []
            const tables = tablesRes.data.data || []

            const today = new Date().toISOString().split('T')[0]
            
            const revenue = orders
                .filter(o => o.status !== "Cancelled")
                .reduce((acc, o) => acc + o.totalAmount, 0)

            setStats({
                totalOrders: orders.length,
                todayRevenue: revenue.toFixed(2),
                activeDeliveries: orders.filter(o => o.status === "Out for delivery").length,
                pendingBookings: bookings.filter(b => b.status === "Pending").length,
                totalFoods: foodsRes.data.data?.length || 0,
                tableOccupancy: Math.round((tables.filter(t => t.status !== "Available").length / tables.length) * 100) || 0
            })
        } catch (error) {
            console.error("Error fetching overview data", error)
        }
    }

    useEffect(() => {
        fetchOverviewData()
        const interval = setInterval(fetchOverviewData, 30000) // Refresh every 30s
        return () => clearInterval(interval)
    }, [])

    return (
        <div className='overview'>
            <div className='overview-header'>
                <h1>Operations Dashboard</h1>
                <p>Real-time analytics for Antigravity Fodie</p>
            </div>

            <div className='stats-grid'>
                <div className='stat-card'>
                    <div className='stat-icon revenue'><DollarSign /></div>
                    <div className='stat-info'>
                        <p>Total Revenue</p>
                        <h3>${stats.todayRevenue}</h3>
                    </div>
                </div>
                <div className='stat-card'>
                    <div className='stat-icon orders'><ShoppingBag /></div>
                    <div className='stat-info'>
                        <p>Total Orders</p>
                        <h3>{stats.totalOrders}</h3>
                    </div>
                </div>
                <div className='stat-card'>
                    <div className='stat-icon deliveries'><TrendingUp /></div>
                    <div className='stat-info'>
                        <p>Active Deliveries</p>
                        <h3>{stats.activeDeliveries}</h3>
                    </div>
                </div>
                <div className='stat-card'>
                    <div className='stat-icon bookings'><Calendar /></div>
                    <div className='stat-info'>
                        <p>Pending Bookings</p>
                        <h3>{stats.pendingBookings}</h3>
                    </div>
                </div>
                <div className='stat-card'>
                    <div className='stat-icon occupancy'><Users /></div>
                    <div className='stat-info'>
                        <p>Table Occupancy</p>
                        <h3>{stats.tableOccupancy}%</h3>
                    </div>
                </div>
            </div>

            <div className='overview-charts'>
                <div className='chart-placeholder'>
                    <h3>Quick Actions</h3>
                    <div className='actions-grid'>
                        <button onClick={() => window.location.hash = '/orders'}>View Orders</button>
                        <button onClick={() => window.location.hash = '/bookings'}>Manage Tables</button>
                        <button onClick={() => window.location.hash = '/add'}>Add New Food</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview
