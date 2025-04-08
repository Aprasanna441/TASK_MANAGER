import jwt from 'jsonwebtoken';
import connection from "../config/db.js";


export const checkToken = async (req, res, next) => {
    let token;

    // Get the authorization header
    const { authorization } = req.headers;

    // Check if the authorization header exists and starts with 'Bearer'
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the 'Bearer' prefix
            token = authorization.split(' ')[1];

            // Verify the token and extract the payload (e.g., userId)
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Attach userId (or any other relevant data) from the token to the request object
            req.user = { userId: decoded.userId, email: decoded.email };

            //Check if the token is legit
            const [isExistingUser] = await connection.promise().query('SELECT * FROM users WHERE email = ?', [req.user.email]);

              //no user with the given email
            if (isExistingUser.length == 0) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            // Proceed to the next middleware or route handler
            next();
        } catch (e) {
            console.log(e);
            // Handle token verification errors
            res.status(401).send({ status: "failed", message: "Invalid or expired token" });
        }
    } else {
        // No authorization header or invalid format
        res.status(401).send({ status: "failed", message: "Unauthorized User" });
    }
};
