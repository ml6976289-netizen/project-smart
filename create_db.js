const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });
        
        const dbName = process.env.DB_NAME || 'smart_appointments';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database "${dbName}" verified/created successfully.`);
        await connection.end();
    } catch (err) {
        console.error('Error creating database:', err.message);
        process.exit(1);
    }
}

createDatabase();
