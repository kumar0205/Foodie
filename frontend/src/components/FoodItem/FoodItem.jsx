import React, { useContext, useState, useEffect } from "react";
import "./FoodItem.css";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
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
    <div className={`food-item ${isShared ? "shared" : ""}`} onClick={handleClick}>
      <div className="food-item-img-container">
        <img className="food-item-image" src={image.startsWith("http") ? image : url + "/images/" + image} alt={name} />

        {/* ✅ Add to Cart stays at bottom-right */}
        <div className="action-buttons">
          {!cartItems[id] ? (
            <button
              className="cart-btn"
              onClick={handleAddToCart}
              aria-label="Add to Cart"
            >
              <ShoppingCart size={18} />
            </button>
          ) : (
            <div className="food-item-counter" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleRemoveFromCart}
                disabled={cartItems[id] <= 1}
              >-</button>
              <p>{cartItems[id]}</p>
              <button
                onClick={handleAddToCart}
                disabled={cartItems[id] >= 20}
              >+</button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Food Info Section */}
      <div className="food-item-info">
        {/* ✅ Heart + Name */}
        <div className="food-item-header">
          <p className="food-item-name">{name}</p>
          <button
            className={`wishlist-inline-btn ${isWishlisted ? "active" : ""}`}
            onClick={toggleWishlist}
            aria-label="Add to Wishlist"
          >
            <Heart
              size={20}
              color={isWishlisted ? "#ff4d6d" : "#888"}
              fill={isWishlisted ? "#ff4d6d" : "none"}
            />
          </button>
        </div>
        <div className="food-item-rating">
          <img src={assets.rating_starts} alt="Rating" width={70} />
        </div>


        {/* ✅ Description */}
        <p className="food-item-desc">{description}</p>

        {/* ✅ Price & Add to Cart */}
        <div className="food-item-footer">
          <p className="food-item-price">${price}</p>
          {!cartItems[id] ? (
            <button className="add-to-cart-footer-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          ) : (
            <button className="view-btn" onClick={handleClick}>
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
