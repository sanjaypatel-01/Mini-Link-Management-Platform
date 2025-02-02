import express from 'express';
import Url from '../models/UrlModel.js';
import { nanoid } from 'nanoid';
import { authenticateToken } from '../middleware/AuthenticateToken.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/create', authenticateToken, async (req, res) => {
  const { destinationUrl, remarks, expirationDate } = req.body;
  let userId = req.user.userId; // Ensure this is correctly extracted

  console.log("User ID from token:", userId);
  console.log("Is userId a valid ObjectId?", mongoose.isValidObjectId(userId));

  if (!destinationUrl || !remarks) {
    return res.status(400).json({ message: 'Destination URL and remarks are required!' });
  }

  const shortLink = nanoid(8);
  let expiration = expirationDate ? new Date(expirationDate) : null;
  if (expiration && isNaN(expiration.getTime())) {
    return res.status(400).json({ message: 'Invalid expiration date' });
  }

  try {
    // Convert userId only if it's not already an ObjectId
    if (!mongoose.isValidObjectId(userId)) {
      userId = new mongoose.Types.ObjectId(userId);
    }

    const newLink = new Url({
      originalLink: destinationUrl,
      shortLink,
      remarks,
      expirationDate: expiration,
      user: userId // Now correctly formatted
    });

    console.log("New URL object before saving:", newLink);

    await newLink.save();
    res.status(201).json({ shortLink: `https://yourdomain.com/${shortLink}` });
  } catch (error) {
    console.error("Database Save Error:", error);
    res.status(500).json({ message: 'Failed to create short link', error: error.message });
  }
});


//links

router.get("/links", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    let userId = req.user.userId; // Ensure correct field

    console.log("User ID from token:", userId);
    console.log("Is userId a valid ObjectId?", mongoose.isValidObjectId(userId));

    // Convert userId to ObjectId only if necessary
    if (!mongoose.isValidObjectId(userId)) {
      userId = new mongoose.Types.ObjectId(userId);
    }

    const now = new Date();

    // Update expired links to "Inactive" before fetching
    await Url.updateMany(
      { user: userId, expirationDate: { $lt: now }, status: "Active" },
      { $set: { status: "Inactive" } }
    );

    const links = await Url.find({ user: userId })
      .sort({ createdAt: -1 }) // Newest first
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    const totalLinks = await Url.countDocuments({ user: userId });

    res.status(200).json({
      data: links,
      totalLinks,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalLinks / parsedLimit),
    });

  } catch (error) {
    console.error("Error fetching user links:", error);
    res.status(500).json({ error: "Error fetching links" });
  }
});


// Edit - links 
router.put("/links/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { originalLink, remarks } = req.body;

    // ✅ Find the link and update it
    const updatedLink = await Url.findByIdAndUpdate(
      id,
      { originalLink, remarks },
      { new: true }
    );

    if (!updatedLink) {
      return res.status(404).json({ success: false, message: "Link not found" });
    }

    res.json({ success: true, message: "Link updated successfully!", link: updatedLink });
  } catch (error) {
    console.error("Error updating link:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


//Delete - links

// router.delete("/links/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params; // Get _id from request params

//   try {
//     const linkData = await Url.findByIdAndDelete(id); // Delete by _id

//     if (linkData) {
//       res.json({ message: "Link deleted successfully." });
//     } else {
//       res.status(404).json({ error: "Link not found." });
//     }
//   } catch (error) {
//     console.error("Error deleting link:", error);
//     res.status(500).json({ error: "Error deleting the link" });
//   }
// });

router.delete("/links/:id", authenticateToken, async (req, res) => {
  const { id } = req.params; // Get _id from request params

  try {
    const linkData = await Url.findById(id); // Find by _id

    if (!linkData) {
      return res.status(404).json({ error: "Link not found." });
    }

    // Prevent deletion if the link is inactive
    if (linkData.status === "Inactive") {
      return res.status(400).json({ error: "Cannot delete inactive links." });
    }

    await Url.findByIdAndDelete(id); // Delete only if active

    res.json({ message: "Link deleted successfully." });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ error: "Error deleting the link" });
  }
});



router.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  // Capture real IP address
  const ip = req.headers["x-forwarded-for"]
    ? req.headers["x-forwarded-for"].split(",")[0].trim()
    : req.connection?.remoteAddress || req.socket?.remoteAddress || req.ip;

  try {
    console.log(`🔍 Searching for short link: ${shortId}`);

    // Find the URL in the database
    const linkData = await Url.findOne({ shortLink: shortId });

    if (!linkData) {
      console.log("URL not found in database");
      return res.status(404).json({ message: "URL not found" });
    }

    // Check if link has expired
    const now = new Date();
    if (linkData.expirationDate && new Date(linkData.expirationDate) < now) {
      console.log("Link has expired!");

      linkData.status = "Inactive"; // Update status instead of deleting
      await linkData.save(); 

      return res.status(410).json({ message: "This link has expired." }); // Return 410 Gone
    }

    console.log(`URL found: Redirecting to ${linkData.originalLink}`);

    // Ensure `originalLink` has a valid scheme (http/https)
    if (!/^https?:\/\//.test(linkData.originalLink)) {
      linkData.originalLink = "http://" + linkData.originalLink;
    }

    // Detect device
    const device = req.useragent?.isMobile
      ? "Mobile"
      : req.useragent?.isTablet
      ? "Tablet"
      : "Desktop";

    console.log(`📍 Click detected from IP: ${ip}, Device: ${device}`);

    // Ensure `clicks` array exists before pushing
    if (!Array.isArray(linkData.clicks)) {
      linkData.clicks = [];
    }

    // ✅ Create click tracking entry
    const clickEntry = {
      timestamp: new Date(),
      device: device || "Unknown",
      ip: ip || "Unknown",
    };

    console.log("Click entry:", clickEntry);

    // Push the click entry
    linkData.clicks.push(clickEntry);

    // ✅ Save updated document
    await linkData.save();

    console.log("✅ Redirecting user...");
    return res.redirect(linkData.originalLink);
  } catch (error) {
    console.error("❌ Redirect error:", error);
    res.status(500).json({ message: "Failed to redirect", error: error.message });
  }
});

router.put("/links/:id/deactivate", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLink = await Url.findByIdAndUpdate(id, { status: "Inactive" }, { new: true });

    if (!updatedLink) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.json({ success: true, message: "Link marked as inactive", link: updatedLink });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});



export default router;