import axios from "axios";
const url = "http://localhost:4000";

async function test() {
  try {
    // 1. Register or login
    let token;
    try {
      const res = await axios.post(url + "/api/auth/register", {
        name: "TestUser",
        email: "testuser2@example.com",
        password: "password123"
      });
      token = res.data.token;
    } catch(err) {
      const res = await axios.post(url + "/api/auth/login", {
        email: "testuser2@example.com",
        password: "password123"
      });
      token = res.data.token;
    }
    
    console.log("Token:", token);
    
    // 2. Fetch food to add to cart
    const foods = await axios.get(url + "/api/food/list");
    const food = foods.data.data[0];
    if (!food) {
      console.log("No food found!");
      return;
    }
    
    // 3. Add to cart
    await axios.post(url + "/api/cart/add", {
      foodId: food._id,
      quantity: 1,
      restaurantId: food.restaurantId || "67da10363734e701734b5899"
    }, {
      headers: { Authorization: "Bearer " + token }
    });
    console.log("Added to cart");
    
    // 4. Place order
    const orderRes = await axios.post(url + "/api/order/place", {
      firstName: "A",
      lastName: "B",
      email: "a@b.com",
      street: "123 St",
      city: "City",
      state: "State",
      zipCode: "123",
      country: "Country",
      phone: "12345"
    }, {
      headers: { Authorization: "Bearer " + token }
    });
    
    console.log("Order placed:", orderRes.data.success);
  } catch(e) {
    console.log("Error:", e.response ? e.response.data : e.message);
  }
}
test();
