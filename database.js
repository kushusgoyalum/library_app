import mysql from "mysql2"

import dotenv from 'dotenv'

dotenv.config()
// const mysql = require('mysql2')

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users")
    return rows
  }
  
  export async function getUser(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM users
    WHERE id = ?
    `, [id])
    return rows[0]
  }
  
  export async function createUser(username, email, password, phone_number) {
    const [result] = await pool.query(`
    INSERT INTO users (username, email, password, phone_number)
    VALUES (?, ?, ?, ?)
    `, [username, email, password, phone_number])
    const id = result.insertId
    return getUser(id)
  }

  export async function createNewUser(id) {
    const [result] = await pool.query(`
    INSERT INTO users (status)
    VALUES ('ACTIVE')
    `)
    const _id = result.insertId
    return getUser(_id)
  }

  export async function updateUser(username, email, password, phone_number, id) {
    const [result] = await pool.query(`
    UPDATE users 
    SET username = ?, email = ?, password = ?, phone_number = ?
    WHERE id = ?
    `, [username, email, password, phone_number, id])
    return getUser(id)
  }

  export async function deleteUser(id) {
    const [result] = await pool.query(`
    DELETE FROM users 
    WHERE id = ?
    `, [id])
  }

//   const result = await createUser('test','test','test','test')
//   console.log(result)