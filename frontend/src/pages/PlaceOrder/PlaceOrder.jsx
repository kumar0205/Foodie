// import React, { useContext } from "react";
// import "./PlaceOrder.css";
// import { StoreContext } from "../../components/context/StoreContext";
// const PlaceOrder = () => {
//     const {getTotalCartAmount} = useContext(StoreContext)
//   return (
//     <form className="place-order">
//       <div className="place-order-left">
//         <p className="title">Delivery Information</p>
//         <div className="multi-fields">
//           <input placeholder="First Name" type="text" />
//           <input placeholder="Last Name" type="text" />
//         </div>
//         <input placeholder="Email Adress" type="email" />
//         <input placeholder="Street" type="text" />
//         <div className="multi-fields">
//           <input placeholder="City" type="text" />
//           <input placeholder="State" type="text" />
//         </div>
//         <div className="multi-fields">
//           <input placeholder="Zip Code" type="text" />
//           <input placeholder="Country" type="text" />
//         </div>
//         <input type="text" placeholder="Phone" />
//       </div>
//       <div className="place-order-right">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div className="cart-total-details">
//             <p>Subtotal</p>
//             <p>${getTotalCartAmount()}</p>
//           </div>
//           <hr />
//           <div className="cart-total-details">
//             <p>Delivery Fee</p>
//             <p>${getTotalCartAmount() === 0? 0 : 2}</p>
//           </div>
//           <hr />
//           <div className="cart-total-details">
//             <b>
//               <p>Total</p>
//             </b>
//             <b>
//               <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
//             </b>
//           </div>
//           <button>
//             PROCEED TO PAYMENT
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PlaceOrder;



import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../components/context/StoreContext";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
    const { getTotalCartAmount, url, setCartItems } = useContext(StoreContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        doorNo: '',
        street: '',
        village: '',
        town: '',
        pincode: ''
    });
    const [phoneError, setPhoneError] = useState(false);
    const [shakeKey, setShakeKey] = useState(0);

    const isPhoneValid = (phone) => {
        const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number format (10 digits)
        return phoneRegex.test(phone);
    };

    const isFormValid = () => {
        return (
            formData.name.trim() !== '' &&
            isPhoneValid(formData.phone) &&
            formData.doorNo.trim() !== '' &&
            formData.street.trim() !== '' &&
            formData.town.trim() !== '' &&
            formData.pincode.trim() !== ''
        );
    };

    // Fetch user profile on mount to pre-fill address
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            try {
                const response = await fetch(`${url}/api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success && data.user.address) {
                    setFormData({
                        name: data.user.address.name || '',
                        phone: data.user.address.phoneNumber || '',
                        doorNo: data.user.address.doorNo || '',
                        street: data.user.address.street || '',
                        village: data.user.address.village || '',
                        town: data.user.address.town || '',
                        pincode: data.user.address.pincode || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, [url]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const onlyNums = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({ ...prev, [name]: onlyNums }));
            if (phoneError) setPhoneError(false); // Reset error while typing
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePhoneBlur = () => {
        if (!isPhoneValid(formData.phone)) {
            setPhoneError(true);
            setShakeKey(prev => prev + 1); // Increment key to restart animation
        } else {
            setPhoneError(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Please log in to place your order.");
            return;
        }

        // 1. Save/Update user address in profile for persistence
        try {
            await fetch(`${url}/api/user/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    address: {
                        name: formData.name,
                        phoneNumber: formData.phone,
                        doorNo: formData.doorNo,
                        street: formData.street,
                        village: formData.village,
                        town: formData.town,
                        pincode: formData.pincode
                    }
                }),
            });
        } catch (error) {
            console.error("Error saving address:", error);
        }

        // 2. Place the order
        const orderData = {
            ...formData,
            cartTotal: getTotalCartAmount(),
            deliveryFee: getTotalCartAmount() === 0 ? 0 : 2,
        };

        try {
            const response = await fetch(`${url}/api/order/place`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) throw new Error("Order failed");

            const data = await response.json();
            console.log("Server response:", data);

            setCartItems({}); // Clear cart Locally
            navigate("/success");
        } catch (error) {
            console.error("Order error:", error);
            alert("Failed to place order.");
        }
    };

    return (
        <>
            <form className="place-order" onSubmit={handleSubmit}>
                <div className="place-order-left">
                    <p className="title">Delivery Information</p>
                    <input
                        name="name"
                        placeholder="Full Name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <div key={shakeKey} className={`phone-input-container ${phoneError ? 'shake error' : ''}`}>
                        <span className="prefix">+91</span>
                        <input
                            name="phone"
                            placeholder="Phone Number"
                            type="text"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            onBlur={handlePhoneBlur}
                        />
                        {phoneError && (
                            <span className="warning-icon" title="Phone number must be 10 digits">!</span>
                        )}
                    </div>
                    <div className="multi-fields">
                        <input
                            name="doorNo"
                            placeholder="Door No / House No"
                            type="text"
                            required
                            value={formData.doorNo}
                            onChange={handleInputChange}
                        />
                        <input
                            name="street"
                            placeholder="Street / Area"
                            type="text"
                            required
                            value={formData.street}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="multi-fields">
                        <input
                            name="village"
                            placeholder="Village (Optional)"
                            type="text"
                            value={formData.village}
                            onChange={handleInputChange}
                        />
                        <input
                            name="town"
                            placeholder="Town / City"
                            type="text"
                            required
                            value={formData.town}
                            onChange={handleInputChange}
                        />
                    </div>
                    <input
                        name="pincode"
                        placeholder="Pincode"
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="place-order-right">
                    <div className="cart-total">
                        <h2>Cart Totals</h2>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>
                                <p>Total</p>
                            </b>
                            <b>
                                <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
                            </b>
                        </div>
                        <button 
                            type="submit" 
                            disabled={!isFormValid()}
                            className={!isFormValid() ? "disabled" : ""}
                        >
                            PROCEED TO PAYMENT
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default PlaceOrder;