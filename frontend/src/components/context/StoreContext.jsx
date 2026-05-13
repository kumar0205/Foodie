import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { food_list as initial_food_list } from "../../assets/frontend_assets/assets";
import axios from "axios";
import { useEffect } from "react";

export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState({});

  const url = "http://localhost:4000";

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        setFoodList(response.data.data);
      } else {
        console.warn("API returned no data or success false, falling back to local list");
        setFoodList(initial_food_list);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      // Fallback to initial local list if API fails
      setFoodList(initial_food_list);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await axios.get(`${url}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.items) {
            const cartData = {};
            response.data.items.forEach(item => {
              cartData[item.foodId._id || item.foodId] = item.quantity;
            });
            setCartItems(cartData);
          }
        } catch (error) {
          console.error("Error loading cart:", error);
        }
      }
    }
    loadData();

    // 🔄 Add polling to keep the list fresh (every 30 seconds)
    const interval = setInterval(fetchFoodList, 30000);
    return () => clearInterval(interval);
  }, []);

  /** Add an item to the cart or increment quantity (with max limit) */
  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const currentQty = prev[itemId] || 0;
      return { ...prev, [itemId]: currentQty + 1 };
    });

    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const food = food_list.find(f => f._id === itemId);
        await axios.post(
          `${url}/api/cart/add`,
          { foodId: itemId, quantity: 1, restaurantId: food?.restaurantId || "67da10363734e701734b5899" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Cart sync error:", error);
      }
    }
  };


  /** Remove an item from the cart or delete if quantity is 1 */
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev;
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId] -= 1;
      else delete updated[itemId];
      return updated;
    });

    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { foodId: itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Cart sync error:", error);
      }
    }
  };

  /** Get total cart amount based on quantity & price */
  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, qty]) => {
      const itemInfo = food_list.find((p) => p._id === itemId);
      return itemInfo ? total + itemInfo.price * qty : total;
    }, 0);
  };

  /** Add an item to wishlist */
  const addToWishlist = (itemId) => {
    if (!wishlistItems[itemId]) {
      setWishlistItems((prev) => ({ ...prev, [itemId]: true }));
      toast.info("Item added to wishlist!");
    }
  };

  /** Remove an item from wishlist */
  const removeFromWishlist = (itemId) => {
    if (wishlistItems[itemId]) {
      setWishlistItems((prev) => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      });
      toast.warn("Item removed from wishlist!");
    }
  };

  /** Toggle wishlist state for an item */
  const toggleWishlist = (itemId) => {
    isInWishlist(itemId) ? removeFromWishlist(itemId) : addToWishlist(itemId);
  };

  /** Check if item is in wishlist */
  const isInWishlist = (itemId) => !!wishlistItems[itemId];

  /** Total wishlist count */
  const getWishlistCount = () => Object.keys(wishlistItems).length;

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    setCartItems,
    url,
    fetchFoodList,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
