// backend/routes/shortLinkRoutes.js
import express from 'express';
import ShortLink from '../models/ShortLink';
import { nanoid } from 'nanoid'; // npm install nanoid
import Url from '../models/UrlModel';

const router = express.Router();

// Create new short link
router.post('/create', async (req, res) => {
  const { destinationUrl, remarks, expirationDate } = req.body;
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
    });

    await newLink.save();
    res.status(201).json({ shortLink: `https://yourdomain.com/${shortLink}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create short link' });
  }
});


// Get all short links
router.get('/', async (req, res) => {
  try {
    const links = await Url.find();
    res.status(200).json({ data: links });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch short links' });
  }
});


  

export default router;
