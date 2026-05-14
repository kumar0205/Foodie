import React, { useContext, useState, useEffect } from "react";
import "./CartSummaryBar.css";
import { StoreContext } from "../context/StoreContext";
import { useNavigate, useLocation } from "react-router-dom"; //  import useLocation
// import { food_list } from "../../assets/frontend_assets/assets";
import { ShoppingCart, DollarSign } from "lucide-react"; // Add Lucide icons

const FREE_DELIVERY_THRESHOLD = 500; // You can adjust this value as needed

const CartSummaryBar = () => {
  const { cartItems, getTotalCartAmount, food_list, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false); // to show the cart summary bar

  const totalItems = Object.values(cartItems || {}).reduce(
    (sum, qty) => sum + (Number(qty) || 0),
    0
  );
  const totalAmount = getTotalCartAmount();
  const deliveryProgress = Math.min(totalAmount / FREE_DELIVERY_THRESHOLD, 1);
  const amountLeft = Math.max(FREE_DELIVERY_THRESHOLD - totalAmount, 0);

  const [isTriggered, setIsTriggered] = useState(false);
  const [prevTotalItems, setPrevTotalItems] = useState(totalItems);

  // Trigger popup when totalItems increases
  useEffect(() => {
    if (totalItems > prevTotalItems && location.pathname !== "/cart") {
      setIsTriggered(true);
      const timer = setTimeout(() => {
        setIsTriggered(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    setPrevTotalItems(totalItems);
  }, [totalItems, location.pathname]);

  // Handle slide-in and slide-out animations
  useEffect(() => {
    if (isTriggered && location.pathname !== "/cart") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isTriggered, location.pathname]);

  return (
    <div
      className={`cart-summary-bar ${isVisible ? "slide-in" : "slide-out"}`}
    >
      <div className="cart-summary-info">
        <div className="cart-info-item">
          <span className="cart-text">
            ₹{totalAmount.toFixed(2)} | {totalItems} {totalItems === 1 ? "Item" : "Items"}
          </span>
        </div>
      </div>
      {/* Free Delivery Progress Bar */}
      <div className="free-delivery-progress-container">
        <div className="free-delivery-progress-bar-bg">
          <div
            className="free-delivery-progress-bar-fill"
            style={{ width: `${deliveryProgress * 100}%` }}
          ></div>
        </div>
        <div className="free-delivery-progress-text">
          {deliveryProgress < 1 ? (
            <span>
              Add <b>₹{amountLeft.toFixed(2)}</b> more for <b>Free Delivery</b>!
            </span>
          ) : (
            <span>
              🎉 <b>Congratulations!</b> You have unlocked <b>Free Delivery</b>!
            </span>
          )}
        </div>
      </div>
      {/* View Cart Button */}
      <button className="view-cart-btn" onClick={() => navigate("/cart")}>
        VIEW CART
      </button>
    </div>
  );
};

export default CartSummaryBar;
