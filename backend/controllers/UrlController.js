import Url from './models/urlModel.js';
import generateShortId from '../utils/NanoidUtil.js';

// Shorten a URL
export const shortenUrl = async (req, res) => {
  const { originalUrl, userId, remarks } = req.body;
  if (!originalUrl || !userId) {
    return res.status(400).json({ error: 'Original URL and userId are required.' });
  }

  const shortId = generateShortId();
  
  const newUrl = new Url({
    shortId,
    originalUrl,
    userId,
    remarks: remarks || '',
    clicks: [],
  });

  await newUrl.save();

  res.json({ shortUrl: `http://localhost:5000/${shortId}`, shortId });
};

// Redirect to original URL and log analytics
export const redirectToOriginalUrl = async (req, res) => {
  const { shortId } = req.params;
  
  const linkData = await Url.findOne({ shortId });

  if (linkData) {
    const device = req.useragent.isMobile ? 'Mobile' : req.useragent.isTablet ? 'Tablet' : 'Desktop';
    const clickData = {
      timestamp: new Date(),
      device,
    };
    linkData.clicks.push(clickData);

    await linkData.save();

    return res.redirect(linkData.originalUrl);
  }

  res.status(404).json({ error: 'URL not found.' });
};

// Get user links and analytics
export const getUserLinks = async (req, res) => {
  const { userId } = req.params;
  
  const links = await Url.find({ userId });

  const response = links.map(link => ({
    shortId: link.shortId,
    originalUrl: link.originalUrl,
    shortUrl: `${process.env.API_BASE_URL}/${link.shortId}`,
    remarks: link.remarks,
    clicks: link.clicks.length,
  }));

  res.json(response);
};

// Get analytics for a user
export const getUserAnalytics = async (req, res) => {
  const { userId } = req.params;

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
};

// Delete a link
export const deleteLink = async (req, res) => {
  const { shortId } = req.params;

  const linkData = await Url.findOne({ shortId });

  if (linkData) {
    await Url.deleteOne({ shortId });
    return res.json({ message: 'Link deleted successfully.' });
  }

  res.status(404).json({ error: 'Link not found.' });
};

// Edit a link
export const editLink = async (req, res) => {
  const { shortId } = req.params;
  const { originalUrl, remarks } = req.body;

  const linkData = await Url.findOne({ shortId });

  if (linkData) {
    if (originalUrl) linkData.originalUrl = originalUrl;
    if (remarks) linkData.remarks = remarks;

    await linkData.save();

    return res.json({ message: 'Link updated successfully.' });
  }

  res.status(404).json({ error: 'Link not found.' });
};
