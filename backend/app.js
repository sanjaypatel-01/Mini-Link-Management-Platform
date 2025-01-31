import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import shortid from 'shortid';  // Import shortid for generating short links
import { authenticateToken } from './middleware/AuthenticateToken.js';
import { nanoid } from 'nanoid'; 
import Url from './models/UrlModel.js';
import useragent from "express-useragent";
import analyticsRoutes from "./routes/analytics.js";


dotenv.config();  // Load environment variables from .env

const app = express();

// Specify allowed origin (frontend running at http://localhost:5173)
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;  // Using environment variable for JWT secret

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)  // Using environment variable for MongoDB URI
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);



// // Short URL Schema
// const shortUrlSchema = new mongoose.Schema({
//   originalLink: String,
//   shortLink: String,
//   remarks: String,
//   expirationDate: Date,
//   status: { type: String, default: "Active" },
//   createdAt: { type: Date, default: Date.now },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
// });

// const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

// // Analytics schema
// const clickAnalyticsSchema = new mongoose.Schema({
//   shortLink: { type: mongoose.Schema.Types.ObjectId, ref: 'Url', required: true },
//   originalLink: { type: String, required: true },
//   ipAddress: { type: String, required: true },
//   userDevice: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
// });

// const ClickAnalytics = mongoose.model('ClickAnalytics', clickAnalyticsSchema);



// API Routes


app.post("/api/signup", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password and create a new user if email is unique
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, mobile, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid data" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to create a short URL (with authentication)
// Create new short link
app.post('/create', authenticateToken, async (req, res) => {
  const { destinationUrl, remarks, expirationDate } = req.body;
  const userId = req.user.id;
  console.log(req.body);  // Log the request body for debugging
  
  if (!destinationUrl || !remarks) {
    return res.status(400).json({ message: 'Destination URL and remarks are required!' });
  }

  const shortLink = nanoid(8);  // Generate a short link with 8 characters

  // If expirationDate is provided, validate it as a proper date
  let expiration = null;
  if (expirationDate) {
    expiration = new Date(expirationDate);
    if (isNaN(expiration.getTime())) {
      return res.status(400).json({ message: 'Invalid expiration date' });
    }
  }

  try {
    const newLink = new Url({
      originalLink: destinationUrl,
      shortLink,
      remarks,
      expirationDate: expiration,
      user:userId
    });

    await newLink.save();
    res.status(201).json({ shortLink: `https://yourdomain.com/${shortLink}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create short link' });
  }
});

// Route to fetch all short URLs (with pagination support)
app.get("/api/links", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;  // Default to page 1 with 10 items per page
    const userId = req.user.id;
    const links = await Url.find({ user: userId })
      .sort({ createdAt: -1 }) // Sort by most recent
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const totalLinks = await Url.countDocuments({ user: userId });
    res.status(200).json({
      data: links,
      totalLinks,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalLinks / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching links" });
  }
});

app.delete("/api/links/:id", authenticateToken, async (req, res) => {
  const { id } = req.params; // Get _id from request params

  try {
    const linkData = await Url.findByIdAndDelete(id); // Delete by _id

    if (linkData) {
      res.json({ message: "Link deleted successfully." });
    } else {
      res.status(404).json({ error: "Link not found." });
    }
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ error: "Error deleting the link" });
  }
});



// Route to get user data (protected)
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);  // Fetch user from database using JWT token
    res.json(user);  // Send user data back
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

  // backend/routes/shortLinkRoutes.js
  // ...existing code...

// ...existing code...





app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  const ip = req.ip;

  try {
    console.log(`🔍 Searching for short link: ${shortId}`);

    // ✅ Find the URL in the database
    const linkData = await Url.findOne({ shortLink: shortId });

    if (!linkData) {
      console.log("❌ URL not found in database");
      return res.status(404).json({ message: "URL not found" });
    }

    console.log(`✅ URL found: Redirecting to ${linkData.originalLink}`);

    // ✅ Ensure `req.useragent` exists
    const device = req.useragent?.isMobile
      ? "Mobile"
      : req.useragent?.isTablet
      ? "Tablet"
      : "Desktop";

    console.log(`📌 Click detected from IP: ${ip}, Device: ${device}`);

    // ✅ Ensure `clicks` is an array before pushing
    if (!Array.isArray(linkData.clicks)) {
      linkData.clicks = [];
    }

    // ✅ Ensure the pushed data is an object (not a number)
    // const clickEntry = {
    //   timestamp: new Date(),
    //   device,
    //   ip
    // };

    // Update Click Tracking to Ensure Data is Saved Correctly
    const clickEntry = {
      timestamp: new Date(),
      device: device || "Unknown",
      ip: ip || "Unknown"
    };

    // ✅ Validate before pushing
    if (typeof clickEntry === "object" && clickEntry !== null) {
      linkData.clicks.push(clickEntry);
    } else {
      console.error("Invalid click entry:", clickEntry);
    }

    // ✅ Save updated document
    await linkData.save();

    // ✅ Redirect the user
    return res.redirect(linkData.originalLink);
  } catch (error) {
    console.error("❌ Redirect error:", error);
    res.status(500).json({ message: "Failed to redirect", error: error.message });
  }
});
  

app.use("/api", analyticsRoutes); // ✅ Mount analytics routes

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});





