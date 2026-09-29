const express = require("express");

const app = express();
const PORT = 5000;
app.set("json spaces", 2);
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to CampusBites Smart Cafeteria");
});

// Get all food items
app.get("/api/foods", (req, res) => {
    const foods = [
        {
            id: 1,
            name: "Veg Meals",
            price: 80,
            category: "Meals",
            available: true
        },
        {
            id: 2,
            name: "Veg Sandwich",
            price: 60,
            category: "Snacks",
            available: true
        },
        {
            id: 3,
            name: "Fresh Juice",
            price: 40,
            category: "Beverages",
            available: true
        }
    ];

    res.json(foods);
});

// Get food by ID
app.get("/api/foods/:id", (req, res) => {
    const foodId = req.params.id;

    res.json({
        message: "Food details retrieved successfully",
        food_id: foodId
    });
});

// Create a new order
app.post("/api/orders", (req, res) => {
    const order = req.body;

    res.status(201).json({
        message: "Order placed successfully",
        order: order
    });
});
// Create Order page
app.get("/create-order", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>CampusBites Create Order API</title>
            <style>
                body {
                    font-family: Arial;
                    margin: 30px;
                }

                h1 {
                    font-size: 32px;
                }

                button {
                    padding: 15px 30px;
                    font-size: 20px;
                    cursor: pointer;
                }

                pre {
                    background: #f2f2f2;
                    padding: 20px;
                    font-size: 18px;
                }
            </style>
        </head>

        <body>

            <h1>CampusBites Create Order API</h1>

            <button onclick="createOrder()">Place Order</button>

            <pre id="result">Click the button to place an order.</pre>

            <script>
                async function createOrder() {

                    const order = {
                        customerName: "Shivani",
                        food: "Veg Meals",
                        quantity: 1,
                        total: 80,
                        status: "Pending"
                    };

                    const response = await fetch("/api/orders", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(order)
                    });

                    const data = await response.json();

                    document.getElementById("result").textContent =
                        JSON.stringify(data, null, 2);
                }
            </script>

        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`CampusBites Express server running on port ${PORT}`);
});