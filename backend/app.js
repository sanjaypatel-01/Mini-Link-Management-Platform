import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import useragent from "express-useragent";
import { authenticateToken } from './middleware/AuthenticateToken.js';
import analyticsRoutes from "./routes/analytics.js";
import authRoutes from "./routes/AuthRoutes.js";
// import shortLinkRoutes from "./routes/ShortLinkRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import urlRoutes from "./routes/UrlRoutes.js";
import router from "./routes/analytics.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "https://mini-link-management-platform-ms91.vercel.app/", // Change this to your frontend URL in production
  credentials: true, // Allow cookies and headers
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(useragent.express());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Root route handler
app.get("/", (req, res) => res.send("Backend is running!"));

// Route for handling short URLs (should be before API routes)
// app.use("/", shortLinkRoutes);

// API routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", urlRoutes);
app.use("/api", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));