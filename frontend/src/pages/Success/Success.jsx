import React, { useEffect } from 'react';
import './Success.css';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Success = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='success-container'>
            <div className='success-card'>
                <div className='icon-wrapper'>
                    <CheckCircle className='success-icon' size={80} />
                </div>
                <h1>Order Placed Successfully!</h1>
                <p>Thank you for your order. We've received it and are preparing your delicious food.</p>

                <div className='order-details-mimic'>
                    <div className='detail-row'>
                        <span>Status:</span>
                        <span className='status-tag'>Confirmed</span>
                    </div>
                    <div className='detail-row'>
                        <span>Delivery Time:</span>
                        <span>25 - 35 mins</span>
                    </div>
                </div>

                <div className='success-actions'>
                    <button className='home-btn' onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                    <button className='track-btn' onClick={() => navigate('/myorders')}>
                        View My Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Success;
