import mysql, { createPool } from "mysql2";

export const db =  mysql
    .createPool({
        host: "localhost",
        user: "root",
        password: "root",
        database: "clickup_api",
        connectionLimit: 10,
    })
    .promise();

    