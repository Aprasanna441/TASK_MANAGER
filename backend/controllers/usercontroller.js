import bcrypt from "bcryptjs"
import  jwt from 'jsonwebtoken'
import connection from "../config/db.js";

//Function to register user
export const userSignup =  async (req, res) => {
  const {  email, password } = req.body; 

  // Checking if any of the params is not received
  if (!email || !password) {
    return res.status(400).json({ message: 'Email, and password are required.' });
  }

  try {
    // Check if the email already exists in the database
    const [existingUser] = await connection.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    //no user with the given email
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already registered.' });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const query = 'INSERT INTO users (email, password) VALUES ( ?, ?)';
    const [result] = await connection.promise().query(query, [email, hashedPassword]);
  
    // JWT Token creation
    const token = jwt.sign(
      { userId: result.insertId, email:email }, //payloads that will be JWTized.Can be extracted later  .Insert id is the primary key which is incrementing
      process.env.JWT_SECRET_KEY                 
    );
    res.status(201).json({ message: 'User registered successfully.', userId: result.insertId, token: token });

  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

 

  


//Function to let  user login
export const userLogin =     async (req, res) => {
  const { email, password } = req.body;

  // Check if email/password is not sent
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // check for users existence
    const [user] = await connection.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    // If no user is found with the given email
    if (user.length === 0) {
      return res.status(400).json({ message: 'Invalid email.' });
    }

      // hashing the password
      const hashedPassword = await bcrypt.hash(password, 10);

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    // If the password is invalid
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // JWT Token creation
    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email }, // Payload containing userId and email
      process.env.JWT_SECRET_KEY                  // Secret key used to sign the token
    );

    // Return response with userId and token
    res.status(200).json({ message: 'Login successful.', userId: user[0].id, token: token });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  
