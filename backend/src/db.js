import mysql from "mysql2";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const db = mysql
    .createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
        database: process.env.DB_NAME || "clickup_db",
        port: process.env.DB_PORT || 3306,
        connectionLimit: 10,
    })
    .promise();

    