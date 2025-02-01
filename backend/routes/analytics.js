import express from "express";
import Url from "../models/UrlModel.js";
import { authenticateToken } from "../middleware/AuthenticateToken.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/analytics", authenticateToken, async (req, res) => {
  try {
    let userId = req.user.userId; // Ensure correct field from token

    console.log("User ID from token:", userId);
    console.log("Is userId a valid ObjectId?", mongoose.isValidObjectId(userId));

    // Convert userId to ObjectId only if necessary
    if (!mongoose.isValidObjectId(userId)) {
      userId = new mongoose.Types.ObjectId(userId);
    }

    // Fetch only the current user's URLs
    const urls = await Url.find({ user: userId }).lean();

    if (!urls.length) {
      return res.status(404).json({ message: "No analytics data found for this user." });
    }

    // Extract analytics data
    const analyticsData = urls.flatMap((url) =>
      url.clicks.map((click) => ({
        timestamp: click.timestamp,
        originalLink: url.originalLink,
        shortLink: url.shortLink,
        ipAddress: click.ip === "::1" ? "127.0.0.1" : click.ip, // Convert IPv6 localhost to IPv4
        userDevice: click.device,
      }))
    );

    // Sort analytics data by timestamp (most recent first)
    analyticsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ success: true, data: analyticsData });
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics", error: error.message });
  }
});

export default router;
