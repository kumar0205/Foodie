import React, { useContext, useState, useEffect } from "react";
import "./FoodItem.css";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { Heart, Plus, Minus, Star } from "lucide-react";
import { assets } from "../../assets/frontend_assets/assets";

const FoodItem = ({ id, name, price, description, image, isShared = false }) => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    url,
  } = useContext(StoreContext);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsWishlisted(!!wishlistItems[id]);
  }, [wishlistItems, id]);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(id);
  };

  const handleRemoveFromCart = (e) => {
    e.stopPropagation();
    removeFromCart(id);
  };

  const handleClick = () => {
    navigate(`/food/${id}`);
  };

  return (
    <div className={`food-item-fk ${isShared ? "shared" : ""}`} onClick={handleClick}>
      <div className="fk-img-container">
        <img 
          className="fk-image" 
          src={image.startsWith("http") ? image : url + "/images/" + image} 
          alt={name} 
          loading="lazy" 
        />
        <div className="fk-rating-badge">
          <span>4.5</span>
          <Star size={10} fill="currentColor" />
        </div>
        <button 
          className={`fk-wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={toggleWishlist}
        >
          <Heart size={18} fill={isWishlisted ? "#ff4c24" : "none"} color={isWishlisted ? "#ff4c24" : "#666"} />
        </button>
      </div>

      <div className="fk-info">
        <h3 className="fk-name">{name}</h3>
        <p className="fk-desc">{description}</p>
        
        <div className="fk-footer">
          <div className="fk-price-section">
            <span className="fk-price">₹{price}</span>
            <span className="fk-old-price">₹{(price * 1.2).toFixed(0)}</span>
          </div>
          
          <div className="fk-action-container" onClick={(e) => e.stopPropagation()}>
            {!cartItems[id] ? (
              <button className="fk-add-btn" onClick={handleAddToCart}>
                <span>ADD</span>
                <Plus size={14} />
              </button>
            ) : (
              <div className="fk-counter">
                <button onClick={handleRemoveFromCart}><Minus size={14} /></button>
                <span>{cartItems[id]}</span>
                <button onClick={handleAddToCart}><Plus size={14} /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
