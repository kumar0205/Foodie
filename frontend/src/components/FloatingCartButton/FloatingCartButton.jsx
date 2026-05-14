import React, { useContext } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import './FloatingCartButton.css';

const FloatingCartButton = () => {
    const { getTotalCartItems } = useContext(StoreContext);
    const navigate = useNavigate();

    const totalItems = getTotalCartItems();

    if (totalItems === 0) return null;

    return (
        <button className="floating-cart-btn" onClick={() => navigate('/cart')} aria-label="View Cart">
            <ShoppingCart size={24} />
            <span className="floating-cart-badge">{totalItems}</span>
        </button>
    );
};

export default FloatingCartButton;
