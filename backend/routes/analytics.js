import express from "express";
import Url from "../models/UrlModel.js"

const router = express.Router();

router.get("/analytics", async (req, res) => {
  try {
    console.log("📊 Analytics API hit"); // Debugging
    const urls = await Url.find({}, "originalLink shortLink clicks");

    const analyticsData = urls.flatMap((url) =>
      url.clicks.map((click) => ({
        timestamp: click.timestamp,
        originalLink: url.originalLink,
        shortLink: url.shortLink,
        ipAddress: click.ip,
        userDevice: click.device,
      }))
    );

    res.json(analyticsData);
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

export default router;
