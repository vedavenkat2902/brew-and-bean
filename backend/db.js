const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "coffee_shop",
    password: "1234",
    port: 5432
});

pool.on("connect", () => {
    console.log("PostgreSQL connected successfully!");
});

pool.on("error", (error) => {
    console.error("PostgreSQL pool error:", error.message);
});

module.exports = pool;