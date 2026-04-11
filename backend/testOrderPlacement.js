// fetch is global in Node 20+

const url = "http://localhost:4000";
const authToken = "YOUR_TOKEN_HERE"; // This script needs a real token to work fully

async function testOrder() {
    const orderData = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        street: "123 Main St",
        city: "TestCity",
        state: "TestState",
        zipCode: "12345",
        country: "TestCountry",
        phone: "1234567890"
    };

    try {
        const response = await fetch(`${url}/api/order/place`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${authToken}` // Commented out for now as I don't have a token
            },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Data:", JSON.stringify(data, null, 2));

        if (response.status === 401) {
            console.log("✅ Received 401 as expected (no token provided)");
        } else if (response.status === 201) {
            console.log("✅ Order placed successfully (if using mock user)");
        } else {
            console.log("❌ Unexpected status code");
        }
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testOrder();
