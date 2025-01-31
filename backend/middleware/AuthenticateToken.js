import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }

    req.user = decoded; // Attach decoded data (including user ID)
    next();
  });
};




// import jwt from 'jsonwebtoken';

// // export const authenticateToken = (req, res, next) => {
// //   const token = req.header('authorization')?.split(' ')[1]; // Bearer token

// //   if (!token) {
// //     return res.status(401).json({ message: 'No token, authorization denied' });
// //   }

// //   try {
// //     // Verify the token and decode it
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure you have JWT_SECRET in your .env file
// //     req.user = decoded.user; // Attach the user to the request object
// //     next(); // Call the next middleware or route handler
// //   } catch (error) {
// //     res.status(401).json({ message: 'Token is not valid' });
// //   }
// // };

// // const jwt = require("jsonwebtoken");

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.header("Authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     console.error("❌ No token provided!");
//     return res.status(401).json({ error: "Access Denied. No token provided." });
//   }

//   const token = authHeader.split(" ")[1]; // Extract the token

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       console.error("❌ Token verification failed:", err.message);
//       return res.status(403).json({ error: "Invalid or expired token." });
//     }

//     console.log("✅ Decoded Token:", decoded); // Debugging

//     if (!decoded || !decoded.id) {
//       console.error("❌ Invalid token structure, missing user ID.");
//       return res.status(403).json({ error: "Invalid token structure." });
//     }

//     req.user = decoded; // Attach decoded token data
//     next();
//   });
// };

// module.exports = authenticateToken;





// // import jwt from 'jsonwebtoken';

// // export const authenticateToken = (req, res, next) => {
// //   // Get the token from the authorization header
// //   const token = req.header('authorization')?.split(' ')[1]; // Bearer token

// //   if (!token) {
// //     return res.status(401).json({ message: 'No token, authorization denied' });
// //   }

// //   try {
// //     // Verify the token and decode it
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure you have JWT_SECRET in your .env file
// //     req.user = decoded.user; // Attach the user to the request object
// //     next(); // Call the next middleware or route handler
// //   } catch (error) {
// //     res.status(401).json({ message: 'Token is not valid' });
// //   }
// // };
