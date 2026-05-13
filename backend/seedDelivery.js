import axios from 'axios'

const seedDeliveryBoy = async () => {
    const url = "http://localhost:4000"
    try {
        const res = await axios.post(`${url}/api/auth/register`, {
            name: "Delivery Partner",
            email: "delivery@foodie.com",
            password: "password123",
            role: "delivery"
        })
        console.log("✅ Delivery Boy created successfully!")
        console.log("Email: delivery@foodie.com")
        console.log("Password: password123")
    } catch (err) {
        if (err.response?.data?.message === "User already exists") {
            console.log("ℹ️ Delivery Boy already exists.")
        } else {
            console.error("❌ Error creating delivery boy:", err.response?.data || err.message)
        }
    }
}

seedDeliveryBoy()
