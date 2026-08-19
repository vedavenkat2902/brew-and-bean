const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.send("Brew & Bean backend is running!");
});


// Test PostgreSQL connection
app.get("/test-db", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT NOW()"
        );

        res.json({
            success: true,
            message: "PostgreSQL connected successfully!",
            time: result.rows[0].now
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed."
        });
    }
});
// ================= REGISTER USER =================

app.post("/api/register", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password
        } = req.body;

        // Check required fields
        if (!name || !email || !phone || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {

            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });

        }

        // Hash password
        const passwordHash =
            await bcrypt.hash(password, 10);

        // Save user
        const result = await pool.query(
            `INSERT INTO users
                (name, email, phone, password_hash)
             VALUES
                ($1, $2, $3, $4)
             RETURNING id, name, email, phone`,
            [
                name,
                email,
                phone,
                passwordHash
            ]
        );

        res.status(201).json({
            success: true,
            message: "Registration successful.",
            user: result.rows[0]
        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error during registration."
        });
    }

});

// ================= LOGIN USER =================

app.post("/api/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check required fields

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });

        }


        // Find user by email

        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                phone,
                password_hash
             FROM users
             WHERE email = $1`,
            [email.toLowerCase()]
        );


        if (result.rows.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Incorrect email or password."
            });

        }


        const user = result.rows[0];


        // Check password

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Incorrect email or password."
            });

        }


        // Login successful

        res.json({
            success: true,
            message: "Login successful!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error during login."
        });

    }

});

// ================= CREATE ORDER =================

app.post("/api/orders", async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            userId,
            customerName,
            phone,
            tableNumber,
            paymentMethod,
            items,
            subtotal,
            tax,
            total
        } = req.body;


        // Check required fields

        if (
            !userId ||
            !customerName ||
            !phone ||
            !tableNumber ||
            !paymentMethod ||
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Incomplete order details."
            });

        }


        // Start transaction

        await client.query("BEGIN");


        // Create order

        const orderResult = await client.query(
            `INSERT INTO orders
                (
                    user_id,
                    customer_name,
                    customer_phone,
                    table_number,
                    payment_method,
                    subtotal,
                    tax,
                    total,
                    status
                )
             VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING
                id,
                customer_name,
                table_number,
                payment_method,
                subtotal,
                tax,
                total,
                status,
                created_at`,
            [
                userId,
                customerName,
                phone,
                tableNumber,
                paymentMethod,
                subtotal,
                tax,
                total,
                "Placed"
            ]
        );


        const order = orderResult.rows[0];


        // Save individual order items

        for (const item of items) {

            await client.query(
                `INSERT INTO order_items
                    (
                        order_id,
                        item_name,
                        price,
                        quantity
                    )
                 VALUES
                    ($1, $2, $3, $4)`,
                [
                    order.id,
                    item.name,
                    item.price,
                    item.quantity
                ]
            );

        }


        // Complete transaction

        await client.query("COMMIT");


        res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            order: order
        });


    } catch (error) {

        // Undo everything if something fails

        await client.query("ROLLBACK");

        console.error(
            "Create order error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to place order."
        });


    } finally {

        client.release();

    }

});


// ================= GET USER ORDERS =================

app.get("/api/orders/:userId", async (req, res) => {

    try {

        const userId = req.params.userId;


        // Get orders for this user

        const ordersResult = await pool.query(
            `SELECT
                id,
                customer_name,
                customer_phone,
                table_number,
                payment_method,
                subtotal,
                tax,
                total,
                status,
                created_at
             FROM orders
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );


        // Get items for each order

        const orders = [];

        for (const order of ordersResult.rows) {

            const itemsResult = await pool.query(
                `SELECT
                    item_name,
                    price,
                    quantity
                 FROM order_items
                 WHERE order_id = $1`,
                [order.id]
            );


            orders.push({

                ...order,

                items: itemsResult.rows

            });

        }


        res.json({

            success: true,

            orders: orders

        });


    } catch (error) {

        console.error(
            "Get orders error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Failed to retrieve orders."

        });

    }

});


// ================= CREATE RESERVATION =================

app.post("/api/reservations", async (req, res) => {

    try {

        const {
            userId,
            reservationId,
            date,
            time,
            guests,
            name,
            phone,
            notes
        } = req.body;


        // CHECK REQUIRED FIELDS

        if (
            !userId ||
            !date ||
            !time ||
            !guests ||
            !name ||
            !phone
        ) {

            return res.status(400).json({
                success: false,
                message: "All required reservation fields must be provided."
            });

        }


        // CREATE RESERVATION ID IF NOT PROVIDED

        const finalReservationId =
            reservationId ||
            "RES" +
            Date.now().toString().slice(-6);


        // SAVE RESERVATION

        const result = await pool.query(

            `INSERT INTO reservations
                (
                    user_id,
                    reservation_id,
                    reservation_date,
                    reservation_time,
                    guests,
                    customer_name,
                    customer_phone,
                    notes,
                    status
                )
             VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING
                id,
                user_id,
                reservation_id,
                reservation_date,
                reservation_time,
                guests,
                customer_name,
                customer_phone,
                notes,
                status,
                created_at`,

            [
                userId,
                finalReservationId,
                date,
                time,
                guests,
                name,
                phone,
                notes || null,
                "Confirmed"
            ]

        );


        // SUCCESS

        res.status(201).json({

            success: true,

            message:
                "Reservation created successfully.",

            reservation:
                result.rows[0]

        });


    } catch (error) {

        console.error(
            "Reservation error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while creating reservation."

        });

    }

});
// Start server
const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Brew & Bean backend running on http://localhost:${PORT}`
    );

});