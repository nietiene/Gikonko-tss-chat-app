import pool from "./db.js";
import bcrypt from "bcrypt";

export async function createUser(name, phone, password) {
    const hashed  = await bcrypt.hash(password, 10);
            
    if (!password && !typeof password !== 'string') {
         return res.status(400).json({ message: 'Password must be a string' });
        }
        
    console.log('password to hash:', password, typeof password);
    const [result] = await pool.query(
        `INSERT INTO user (name, phone, password) VALUES(?, ?, ?)`,
        [name, phone, hashed]
    );
    return result.insertId;
}

export async function findUserByPhone(phone) {
    const [rows] = await pool.query('SELECT * FROM user WHERE phone = ?', [phone]);
    return rows[0];
}

export function getUserIdByUsername(name) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM user WHERE name = ?";
        pool.query(query, [name], (err, result) => {
            if (err)  reject(err);
            if (result.length === 0) return reject(new Error("User not found"));
            resolve(result[0].user_id);
        })
    })
}