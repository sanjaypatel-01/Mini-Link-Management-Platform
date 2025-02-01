import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.replace("Bearer ", "") : null;

  console.log("Auth header:", authHeader);
  console.log("Extracted Token:", token);

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    // Debugging: Show decoded token before verification
    console.log("Decoded Token (Before Verification):", jwt.decode(token));

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified token payload:", JSON.stringify(verified, null, 2));

    req.user = verified; // Ensure token contains correct userId field
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: "Invalid Token" });
  }
};
