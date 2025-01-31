import express from 'express';
import Url from '../models/Url.js'; // Import the Url model
import { nanoid } from 'nanoid';
import { authenticateToken } from '../middleware/AuthenticateToken.js';

const router = express.Router();

// Shorten a URL
router.post('/api/shorten', async (req, res) => {
  const { originalUrl, userId, remarks } = req.body;

  if (!originalUrl || !userId) {
    return res.status(400).json({ error: 'Original URL and userId are required.' });
  }

  const shortId = nanoid(8);

  try {
    const newUrl = new Url({
      originalUrl,
      shortId,
      userId,
      remarks,
      clicks: [],
    });

    await newUrl.save(); // Save the URL to MongoDB

    res.json({ shortUrl: `http://localhost:5000/${shortId}`, shortId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
});

// Redirect to original URL and log analytics
router.use(useragent.express());



// Get user links and analytics
router.get('/api/user/:userId/links', async (req, res) => {
  const { userId } = req.params;

  try {
    const links = await Url.find({ userId });

    const result = links.map(link => ({
      shortId: link.shortId,
      originalUrl: link.originalUrl,
      shortUrl: `http://localhost:5000/${link.shortId}`,
      remarks: link.remarks,
      clicks: link.clicks.length,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user links' });
  }
});

// Get analytics for a user
router.get('/api/user/:userId/analytics', async (req, res) => {
  const { userId } = req.params;

  try {
    const links = await Url.find({ userId });

    let totalClicks = 0;
    const dateWiseClicks = {};
    const deviceClicks = { Mobile: 0, Tablet: 0, Desktop: 0 };

    links.forEach(link => {
      link.clicks.forEach(click => {
        totalClicks++;

        const date = click.timestamp.toISOString().split('T')[0];
        dateWiseClicks[date] = (dateWiseClicks[date] || 0) + 1;

        deviceClicks[click.device]++;
      });
    });

    res.json({ totalClicks, dateWiseClicks, deviceClicks });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching analytics' });
  }
});

// Delete a link
router.delete('api/link/:shortId', authenticateToken, async (req, res) => {
  const { shortId } = req.params;

  try {
    const linkData = await Url.findOneAndDelete({ shortId });

    if (linkData) {
      res.json({ message: 'Link deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Link not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the link' });
  }
});

// Edit a link
router.put('/api/link/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const { originalUrl, remarks } = req.body;

  try {
    const linkData = await Url.findOne({ shortId });

    if (linkData) {
      if (originalUrl) linkData.originalUrl = originalUrl;
      if (remarks) linkData.remarks = remarks;

      await linkData.save(); // Save updated link

      res.json({ message: 'Link updated successfully.' });
    } else {
      res.status(404).json({ error: 'Link not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating the link' });
  }
});

export default router;
