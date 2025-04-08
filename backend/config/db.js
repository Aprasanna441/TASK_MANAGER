import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config(); 
const db_name = process.env.DATABASE_NAME

// Connection creation with database
export const connection = mysql.createConnection({
  host: process.env.DATABASE_SERVER,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
}); 

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
});

// Create database if it doesnt exist
const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS \`${db_name}\``;
connection.query(createDatabaseQuery, (err, result) => {
  if (err) {
    console.error('Error creating database: ', err.stack);
    return;
  }

  // Connecting to the database we created/was already created
  connection.changeUser({ database: db_name }, (err) => {
    if (err) {
      console.error('Error switching to database: ', err.stack);
      return;
    }

    // User Table Query 
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `;
    
    //Task Table Query
    const createTasksTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) 
    )
  `;
  
  //executing user table creationquery
    connection.query(createTableQuery, (err, result) => {
      if (err) {
        console.error('Error creating table user: ', err.stack);
        return;
      }

    });

    //executing task table creation query
    connection.query(createTasksTableQuery, (err, result) => {
      if (err) {
        console.error('Error creating table task: ', err.stack);
        return;
      }

    });
  });
});

export default connection;
